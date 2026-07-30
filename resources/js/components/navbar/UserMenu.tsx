/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, usePage, router } from '@inertiajs/react';
import {
    User as UserIcon,
    ShieldCheck,
    Store,
    Settings,
    ChevronDown,
    LogOut,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

export default function UserMenu() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/login"
                    className="text-[10.5px] font-bold tracking-wider text-navy-600 uppercase transition-colors hover:text-pastel-teal"
                >
                    Masuk
                </Link>
                <span className="text-navy-300">|</span>
                <Link
                    href="/register"
                    className="rounded-lg bg-pastel-coral px-3 py-1 text-[10.5px] font-bold tracking-wider text-white uppercase shadow-2xs transition-colors hover:bg-pastel-coral/90"
                >
                    Daftar
                </Link>
            </div>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-pastel-teal/15 bg-pastel-teal-light/60 px-2.5 py-1 text-[10px] font-bold tracking-wider text-navy-700 uppercase transition-all hover:text-pastel-teal"
            >
                <UserIcon className="h-3.5 w-3.5 text-pastel-teal" />
                <span>Halo, </span>
                <span className="text-pastel-teal underline">
                    {user.name} ({user.role === 'admin' ? 'Admin' : 'Owner'})
                </span>
                <ChevronDown className="h-3 w-3 text-pastel-teal" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-48 animate-fade-in rounded-xl border border-navy-200 bg-white py-2 text-xs shadow-lg">
                    <div className="border-b border-navy-100 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-navy-400 uppercase">
                        Akun Saya
                    </div>
                    {user.role === 'admin' ? (
                        <Link
                            href="/admin/dashboard"
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-navy-700 transition-colors hover:bg-pastel-teal-light"
                        >
                            <ShieldCheck className="h-4 w-4 text-pastel-peach" />
                            <span>Panel Admin</span>
                        </Link>
                    ) : (
                        <Link
                            href="/merchant/dashboard"
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-navy-700 transition-colors hover:bg-pastel-teal-light"
                        >
                            <Store className="h-4 w-4 text-pastel-teal" />
                            <span>Kelola Toko</span>
                        </Link>
                    )}
                    <Link
                        href="/settings/profile"
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-navy-700 transition-colors hover:bg-pastel-teal-light"
                    >
                        <Settings className="h-4 w-4 text-navy-400" />
                        <span>Ubah Profil</span>
                    </Link>
                    <hr className="my-1 border-navy-100" />
                    <form onSubmit={handleLogout}>
                        <button
                            type="submit"
                            className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2 text-left text-pastel-coral transition-colors hover:bg-pastel-coral-light"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Keluar</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
