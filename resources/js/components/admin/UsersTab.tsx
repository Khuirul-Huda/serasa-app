/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import { Users, Search } from 'lucide-react';
import React, { useState, useMemo } from 'react';
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

interface UsersTabProps {
    users: AdminUser[];
}

export default function UsersTab({ users }: UsersTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

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

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-users-tab"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex items-center justify-between rounded-3xl border border-navy-200/60 bg-white p-5 sm:p-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                        <Users className="h-5 w-5 text-pastel-teal" />
                        <span>Manajemen Pengguna & Peran Akun</span>
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                        Daftar seluruh akun terdaftar dan hak akses dalam portal
                        etalase desa.
                    </p>
                </div>

                <span className="rounded-xl border border-pastel-teal/20 bg-pastel-teal-light px-3.5 py-1.5 text-xs font-black tracking-wider text-pastel-teal uppercase">
                    {users.length} Akun Terdaftar
                </span>
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
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
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
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Nama Pengguna
                                </TableHead>
                                <TableHead className="p-4">
                                    Alamat Email
                                </TableHead>
                                <TableHead className="p-4">
                                    Tanggal Registrasi
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
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30"
                                    >
                                        <TableCell className="p-4 text-xs font-bold text-navy-900 sm:text-sm">
                                            {user.name}
                                        </TableCell>

                                        <TableCell className="p-4 font-mono text-xs text-navy-600 sm:text-sm">
                                            {user.email}
                                        </TableCell>

                                        <TableCell className="p-4 text-xs font-normal text-navy-500 sm:text-sm">
                                            {user.createdAt}
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
                                                <span className="rounded-lg border border-navy-200 bg-navy-100 px-2.5 py-1 text-xs font-bold text-navy-600 uppercase">
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
                                                className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
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
        </div>
    );
}
