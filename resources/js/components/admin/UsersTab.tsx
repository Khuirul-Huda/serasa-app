/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, router } from '@inertiajs/react';
import { Users, Search, UserPlus, X, KeyRound, Mail, User as UserIcon, Store, Link as LinkIcon } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { AdminUser } from '@/pages/admin-dashboard';
import type { Shop } from '@/types';

export interface ExtendedAdminUser extends AdminUser {
    shopId?: string | null;
    shopName?: string | null;
}

interface UsersTabProps {
    users: ExtendedAdminUser[];
    shops?: Shop[];
}

export default function UsersTab({ users, shops = [] }: UsersTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q);
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    const handleRoleChange = (
        userId: number,
        newRole: string,
        userName: string,
    ) => {
        router.post(
            `/admin/users/${userId}/role`,
            { role: newRole },
            {
                onSuccess: () => {
                    toast.success(
                        `Peran akun "${userName}" berhasil diubah menjadi ${newRole.toUpperCase()}.`,
                    );
                },
            },
        );
    };

    const handleLinkShopToUser = (userId: number, shopId: string, userName: string) => {
        if (!shopId) return;

        const shop = shops.find((s) => s.id === shopId);
        if (!shop) return;

        router.put(`/admin/shops/${shopId}`, {
            name: shop.name,
            owner_name: userName,
            user_id: userId,
            category: shop.category,
            dusun: shop.dusun,
            address: shop.address,
            phone: shop.phone,
            description: shop.description || '',
            image: shop.image,
            logo: shop.logo,
            nib: Boolean(shop.nib),
            halal: Boolean(shop.halal),
            pirt: Boolean(shop.pirt),
            is_verified: Boolean(shop.isVerified),
        }, {
            onSuccess: () => {
                toast.success(`Akun "${userName}" berhasil ditautkan ke toko "${shop.name}"!`);
            },
            onError: () => toast.error('Gagal menautkan toko ke pengguna!'),
        });
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
            toast.error('Semua bidang (Nama, Email, Password) harus diisi!');
            return;
        }

        router.post('/admin/users', newUser, {
            onSuccess: () => {
                toast.success(`Akun "${newUser.name}" berhasil dibuat!`);
                setIsCreateModalOpen(false);
                setNewUser({ name: '', email: '', password: '', role: 'user' });
            },
            onError: () => toast.error('Gagal membuat akun. Periksa format email dan password!'),
        });
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900 dark:text-navy-100"
            id="admin-users-tab"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 dark:border-navy-800 dark:bg-navy-900 sm:p-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-navy-900 uppercase dark:text-white">
                        <Users className="h-5 w-5 text-pastel-teal" />
                        <span>Manajemen Pengguna & Peran Akun</span>
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400 sm:text-sm">
                        Daftar seluruh akun terdaftar, penautan toko UMKM, dan hak akses dalam portal desa.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-2xl bg-pastel-teal px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition-all hover:bg-pastel-teal/90"
                    >
                        <UserPlus className="h-4 w-4" />
                        <span>Buat Akun Baru</span>
                    </button>

                    <span className="rounded-xl border border-pastel-teal/20 bg-pastel-teal-light px-3.5 py-2 text-xs font-black tracking-wider text-pastel-teal uppercase dark:bg-navy-950">
                        {users.length} Akun
                    </span>
                </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <Input
                        type="text"
                        placeholder="Cari nama pengguna atau email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-800 dark:bg-navy-900 sm:text-sm"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 sm:text-sm"
                >
                    <option value="all">Semua Peran ({users.length})</option>
                    <option value="admin">
                        Super Admin (
                        {users.filter((u) => u.role === 'admin').length})
                    </option>
                    <option value="owner">
                        Owner Toko (
                        {users.filter((u) => u.role === 'owner').length})
                    </option>
                    <option value="user">
                        Pengguna Warga (
                        {users.filter((u) => u.role === 'user').length})
                    </option>
                </select>
            </div>

            {/* Users Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase dark:border-navy-800 dark:bg-navy-950 dark:text-navy-400 hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Nama Pengguna
                                </TableHead>
                                <TableHead className="p-4">
                                    Alamat Email
                                </TableHead>
                                <TableHead className="p-4">
                                    Toko Dikelola (Linked Shop)
                                </TableHead>
                                <TableHead className="p-4">
                                    Peran (Role)
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Ubah Peran (Role)
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Belum ada akun yang cocok dengan filter
                                        pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30 dark:border-navy-800 dark:hover:bg-navy-950/50"
                                    >
                                        <TableCell className="p-4 text-xs font-bold text-navy-900 dark:text-white sm:text-sm">
                                            {user.name}
                                        </TableCell>

                                        <TableCell className="p-4 font-mono text-xs text-navy-600 dark:text-navy-300 sm:text-sm">
                                            {user.email}
                                        </TableCell>

                                        {/* Linked Shop Column */}
                                        <TableCell className="p-4 text-xs">
                                            {user.shopName ? (
                                                <Link
                                                    href={`/shops/${user.shopId}`}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-pastel-teal/30 bg-pastel-teal-light px-3 py-1.5 font-bold text-pastel-teal transition-all hover:bg-pastel-teal hover:text-white dark:bg-navy-950"
                                                >
                                                    <Store className="h-3.5 w-3.5" />
                                                    <span>{user.shopName}</span>
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-navy-400 italic">Belum bertaut toko</span>
                                                    {shops.length > 0 && (
                                                        <select
                                                            defaultValue=""
                                                            onChange={(e) =>
                                                                handleLinkShopToUser(
                                                                    user.id,
                                                                    e.target.value,
                                                                    user.name,
                                                                )
                                                            }
                                                            className="rounded-lg border border-navy-200 bg-white px-2 py-1 text-[11px] font-bold text-navy-700 hover:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                                        >
                                                            <option value="" disabled>
                                                                + Tautkan Toko
                                                            </option>
                                                            {shops.map((s) => (
                                                                <option key={s.id} value={s.id}>
                                                                    {s.name} ({s.ownerName})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell className="p-4">
                                            {user.role === 'admin' ? (
                                                <span className="rounded-lg border border-pastel-peach/30 bg-pastel-peach-light px-2.5 py-1 text-xs font-black text-pastel-peach uppercase">
                                                    Admin Desa
                                                </span>
                                            ) : user.role === 'owner' ? (
                                                <span className="rounded-lg border border-pastel-teal/30 bg-pastel-teal-light px-2.5 py-1 text-xs font-black text-pastel-teal uppercase">
                                                    Owner Toko
                                                </span>
                                            ) : (
                                                <span className="rounded-lg border border-navy-200 bg-navy-100 px-2.5 py-1 text-xs font-bold text-navy-600 uppercase dark:border-navy-700 dark:bg-navy-800 dark:text-navy-300">
                                                    Pengguna
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="p-4 text-right">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        user.id,
                                                        e.target.value,
                                                        user.name,
                                                    )
                                                }
                                                className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-200"
                                            >
                                                <option value="user">
                                                    Pengguna (Warga)
                                                </option>
                                                <option value="owner">
                                                    Owner Toko (Pelaku Usaha)
                                                </option>
                                                <option value="admin">
                                                    Super Admin (Pemerintah
                                                    Desa)
                                                </option>
                                            </select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* CREATE USER MODAL DIALOG PORTAL */}
            {isCreateModalOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-xs animate-fade-in font-sans text-navy-900 dark:text-navy-100">
                    <div className="relative w-full max-w-md rounded-3xl border border-navy-200/80 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900">
                        <div className="flex items-center justify-between border-b border-navy-100 pb-3 dark:border-navy-800">
                            <h3 className="flex items-center gap-2 text-sm font-black text-navy-900 uppercase dark:text-white">
                                <UserPlus className="h-4 w-4 text-pastel-teal" />
                                <span>Buat Akun Pengguna Baru</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-xl p-1 text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Nama Lengkap *
                                </label>
                                <div className="relative mt-1">
                                    <UserIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                    <input
                                        type="text"
                                        placeholder="Nama Pengguna / Pemilik..."
                                        value={newUser.name}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, name: e.target.value })
                                        }
                                        required
                                        className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 pl-9 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Alamat Email *
                                </label>
                                <div className="relative mt-1">
                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                    <input
                                        type="email"
                                        placeholder="email@samirono.id..."
                                        value={newUser.email}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, email: e.target.value })
                                        }
                                        required
                                        className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 pl-9 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Password *
                                </label>
                                <div className="relative mt-1">
                                    <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
                                    <input
                                        type="password"
                                        placeholder="Minimal 8 karakter..."
                                        value={newUser.password}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, password: e.target.value })
                                        }
                                        required
                                        minLength={8}
                                        className="w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 pl-9 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Peran / Hak Akses (Role) *
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, role: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-bold text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                >
                                    <option value="user">Pengguna Warga (Biasa)</option>
                                    <option value="owner">Owner Toko (Pelaku Usaha)</option>
                                    <option value="admin">Super Admin (Pemerintah Desa)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-bold text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-pastel-teal px-5 py-2 text-xs font-black text-white shadow-xs hover:bg-pastel-teal/90"
                                >
                                    Buat Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
