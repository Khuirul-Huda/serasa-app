# syntax=docker/dockerfile:1.9

##############################################################
# Stage 1 — Vendor: install PHP production dependencies
##############################################################
FROM composer:2.8 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN --mount=type=cache,target=/root/.composer/cache \
    composer install \
        --no-dev \
        --no-scripts \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --classmap-authoritative

# Copy full source so classmap covers all app classes
COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

##############################################################
# Stage 2 — Assets: PHP + Bun for Wayfinder & frontend assets
##############################################################
FROM dunglas/frankenphp:1.4-php8.3-alpine AS assets

ENV NODE_ENV=production
WORKDIR /app

# Install Node and copy Bun binary from official Bun image
RUN apk add --no-cache nodejs
COPY --from=oven/bun:1.2-alpine /usr/local/bin/bun /usr/local/bin/bun

# Copy full source and PHP vendor from vendor stage
COPY --from=vendor /app /app

# Install JS dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Generate Wayfinder TypeScript definitions via PHP and build frontend & SSR bundles
RUN bun run build:ssr

##############################################################
# Stage 3 — Runtime: FrankenPHP + Octane worker mode
##############################################################
FROM dunglas/frankenphp:1.4-php8.3-alpine AS runtime

LABEL org.opencontainers.image.title="serasa-app" \
      org.opencontainers.image.source="https://github.com/your-org/serasa-app"

ENV OCTANE_SERVER=frankenphp \
    PORT=8000

# ── System packages ───────────────────────────────────────────
# netcat-openbsd: TCP wait in entrypoint.sh
# procps:         provides pgrep for queue worker healthcheck
# nodejs:         provides Node runtime for Inertia SSR server
RUN apk add --no-cache netcat-openbsd procps nodejs

# ── PHP extensions ────────────────────────────────────────────
RUN install-php-extensions \
        pdo_pgsql \
        pgsql \
        opcache \
        pcntl \
        redis \
        zip \
        intl \
        gd \
        exif \
        bcmath \
        sockets

# ── PHP ini files ─────────────────────────────────────────────
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/10-opcache.ini
COPY docker/php/app.ini     /usr/local/etc/php/conf.d/20-app.ini

# ── Caddy data dirs — owned by www-data for TLS cert storage ──
RUN mkdir -p /data/caddy /config/caddy \
    && chown -R www-data:www-data /data/caddy /config/caddy

WORKDIR /app

# ── Application source from build stages ─────────────────────
COPY --from=vendor --chown=www-data:www-data /app               /app
COPY --from=assets --chown=www-data:www-data /app/public/build  /app/public/build
COPY --from=assets --chown=www-data:www-data /app/bootstrap/ssr /app/bootstrap/ssr

# ── FrankenPHP / Caddy config ─────────────────────────────────
COPY docker/Caddyfile /etc/caddy/Caddyfile
RUN chown www-data:www-data /etc/caddy/Caddyfile

# ── Entrypoint ────────────────────────────────────────────────
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

# ── Runtime-writable directories ─────────────────────────────
RUN mkdir -p \
        storage/framework/sessions \
        storage/framework/views \
        storage/framework/cache/data \
        storage/app/public \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

USER www-data

EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --start-period=45s --retries=3 \
    CMD wget -qO- http://localhost:8000/up || exit 1

ENTRYPOINT ["/entrypoint.sh"]
