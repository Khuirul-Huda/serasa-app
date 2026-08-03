/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import { Bell, Store, CheckCircle2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import type { Shop } from '@/types';

interface NotificationDropdownProps {
    shops?: Shop[];
    onOpen?: () => void;
}

export default function NotificationDropdown({
    shops = [],
    onOpen,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        onOpen?.();
    };

    const verifiedShops = shops.filter((s) => s.isVerified).slice(0, 3);

    return (
        <div className="relative" ref={notifRef}>
            <button
                onClick={handleToggle}
                className="relative cursor-pointer rounded-xl p-2 text-navy-600 transition-all hover:bg-navy-100 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800 dark:hover:text-pastel-teal"
                title="Notifikasi Portal"
            >
                <Bell className="h-5 w-5" />
                {verifiedShops.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white bg-pastel-coral dark:border-navy-900" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 animate-fade-in rounded-2xl border border-navy-200 bg-white px-3.5 py-3 text-xs shadow-xl dark:border-navy-800 dark:bg-navy-900/95 dark:text-navy-100 dark:shadow-2xl">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-2 dark:border-navy-800">
                        <span className="font-bold text-navy-900 dark:text-navy-100">
                            Notifikasi Portal
                        </span>
                        <span className="text-[9px] font-bold tracking-wider text-navy-400 uppercase dark:text-navy-500">
                            Terbaru
                        </span>
                    </div>

                    <div className="max-h-64 divide-y divide-navy-100 overflow-y-auto dark:divide-navy-800">
                        {verifiedShops.length === 0 ? (
                            <div className="py-6 text-center text-xs text-navy-400 italic dark:text-navy-500">
                                Belum ada pembaruan notifikasi
                            </div>
                        ) : (
                            verifiedShops.map((shop) => (
                                <Link
                                    key={shop.id}
                                    href={`/shops/${shop.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block flex items-start gap-2.5 rounded-xl p-1.5 py-2.5 transition-colors hover:bg-navy-50/50 dark:hover:bg-navy-800/60"
                                >
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal dark:border-navy-700 dark:bg-navy-800">
                                        <Store className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-1">
                                            <span className="truncate text-[11px] font-bold text-navy-800 dark:text-navy-200">
                                                {shop.name}
                                            </span>
                                            <CheckCircle2 className="h-3 w-3 shrink-0 text-pastel-teal" />
                                        </div>
                                        <p className="line-clamp-1 text-[10px] leading-relaxed font-normal text-navy-500 dark:text-navy-400">
                                            Toko UMKM sektor {shop.category}{' '}
                                            aktif di {shop.dusun}.
                                        </p>
                                        <span className="block text-[9px] font-medium text-navy-400 dark:text-navy-500">
                                            Status Terverifikasi
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
