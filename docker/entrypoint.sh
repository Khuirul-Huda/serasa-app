#!/bin/sh
set -e

# Wait for a TCP port with a max-attempts guard.
# Uses nc (netcat-openbsd) — /dev/tcp is bash-only, not ash.
wait_for_tcp() {
    HOST="$1"
    PORT="$2"
    MAX=30
    i=0
    echo "==> Waiting for ${HOST}:${PORT}..."
    until nc -z -w 3 "${HOST}" "${PORT}" 2>/dev/null; do
        i=$((i + 1))
        if [ "$i" -ge "$MAX" ]; then
            echo "ERROR: ${HOST}:${PORT} not reachable after ${MAX} attempts. Aborting."
            exit 1
        fi
        echo "    ${HOST}:${PORT} not ready (attempt ${i}/${MAX}), retrying in 2s..."
        sleep 2
    done
    echo "    ${HOST}:${PORT} is up."
}

wait_for_tcp "${DB_HOST:-postgres}"  "${DB_PORT:-5432}"
wait_for_tcp "${REDIS_HOST:-redis}"  "${REDIS_PORT:-6379}"

export APP_BASE_PATH="${APP_BASE_PATH:-/app}"
export APP_PUBLIC_PATH="${APP_PUBLIC_PATH:-/app/public}"

echo "==> Linking storage..."
php artisan storage:link --force 2>/dev/null || true

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "==> Running migrations..."
    php artisan migrate --force --no-interaction
else
    echo "==> Skipping automatic container migrations (set RUN_MIGRATIONS=true to enable)."
fi

echo "==> Clearing config cache for Octane worker mode..."
php artisan config:clear
php artisan route:cache
php artisan view:cache
php artisan event:cache

# If custom arguments are passed (e.g. queue worker, scheduler, or SSR server), run them
if [ $# -gt 0 ]; then
    echo "==> Executing command: $@"
    exec "$@"
fi

echo "==> Starting Octane..."
# exec makes PHP PID 1 so Docker SIGTERM is forwarded correctly.
exec php artisan octane:frankenphp \
    --host=0.0.0.0 \
    --port=8000 \
    --admin-port=2019 \
    --caddyfile=/etc/caddy/Caddyfile \
    --workers="${OCTANE_WORKERS:-auto}" \
    --max-requests="${OCTANE_MAX_REQUESTS:-500}"

