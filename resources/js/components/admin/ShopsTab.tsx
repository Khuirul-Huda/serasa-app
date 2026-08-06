/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, router } from '@inertiajs/react';
import {
    Search,
    CheckCircle2,
    AlertCircle,
    FileSpreadsheet,
    Trash2,
    ShieldCheck,
    MapPin,
    PhoneCall,
    Download,
    Plus,
    Pencil,
    X,
    Store,
    UserCheck,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
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

interface ShopsTabProps {
    shops: Shop[];
    users?: AdminUser[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: 'all' | 'verified' | 'pending';
    setStatusFilter: (filter: 'all' | 'verified' | 'pending') => void;
    onOpenImportModal: () => void;
}

const DEFAULT_SHOP_FORM = {
    name: '',
    owner_name: '',
    user_id: '',
    category: 'Kuliner & Olahan',
    dusun: 'Dusun Samirono',
    address: '',
    phone: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    nib: false,
    halal: false,
    pirt: false,
    is_verified: true,
};

export default function ShopsTab({
    shops,
    users = [],
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    onOpenImportModal,
}: ShopsTabProps) {
    const [shopToDelete, setShopToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const [isShopModalOpen, setIsShopModalOpen] = useState(false);
    const [editingShopId, setEditingShopId] = useState<string | null>(null);
    const [shopForm, setShopForm] = useState(DEFAULT_SHOP_FORM);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredShops = shops.filter((shop) => {
        const matchesSearch =
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'verified' && shop.isVerified) ||
            (statusFilter === 'pending' && !shop.isVerified);

        return matchesSearch && matchesStatus;
    });

    const handleOpenCreateModal = () => {
        setEditingShopId(null);
        setShopForm(DEFAULT_SHOP_FORM);
        setIsShopModalOpen(true);
    };

    const handleOpenEditModal = (shop: Shop) => {
        setEditingShopId(shop.id);
        setShopForm({
            name: shop.name,
            owner_name: shop.ownerName,
            user_id: shop.userId ? String(shop.userId) : '',
            category: shop.category,
            dusun: shop.dusun,
            address: shop.address,
            phone: shop.phone,
            description: shop.description || '',
            image: shop.image || DEFAULT_SHOP_FORM.image,
            logo: shop.logo || DEFAULT_SHOP_FORM.logo,
            nib: Boolean(shop.nib),
            halal: Boolean(shop.halal),
            pirt: Boolean(shop.pirt),
            is_verified: Boolean(shop.isVerified),
        });
        setIsShopModalOpen(true);
    };

    const handleSelectUserLink = (userIdStr: string) => {
        if (!userIdStr) {
            setShopForm((prev) => ({ ...prev, user_id: '' }));
            return;
        }

        const selectedUser = users.find((u) => String(u.id) === userIdStr);
        if (selectedUser) {
            setShopForm((prev) => ({
                ...prev,
                user_id: userIdStr,
                owner_name: prev.owner_name ? prev.owner_name : selectedUser.name,
            }));
        }
    };

    const handleSaveShop = (e: React.FormEvent) => {
        e.preventDefault();

        if (!shopForm.name.trim() || !shopForm.owner_name.trim()) {
            toast.error('Nama Toko dan Nama Pemilik wajib diisi!');
            return;
        }

        const payload = {
            ...shopForm,
            user_id: shopForm.user_id ? Number(shopForm.user_id) : null,
        };

        if (editingShopId) {
            router.put(`/admin/shops/${editingShopId}`, payload, {
                onSuccess: () => {
                    toast.success(`Data toko "${shopForm.name}" berhasil diperbarui!`);
                    setIsShopModalOpen(false);
                },
                onError: () => toast.error('Gagal memperbarui data toko!'),
            });
        } else {
            router.post('/admin/shops', payload, {
                onSuccess: () => {
                    toast.success(`Toko UMKM "${shopForm.name}" berhasil dibuat!`);
                    setIsShopModalOpen(false);
                },
                onError: () => toast.error('Gagal membuat toko baru!'),
            });
        }
    };

    const handleToggleVerify = (shopId: string, isVerified: boolean) => {
        router.post(
            `/admin/shops/${shopId}/verify`,
            {},
            {
                onSuccess: () => {
                    toast.success(
                        isVerified
                            ? 'Status verifikasi toko dibatalkan.'
                            : 'Toko berhasil diverifikasi!',
                    );
                },
            },
        );
    };

    const handleTogglePermit = (
        shopId: string,
        permit: 'nib' | 'halal' | 'pirt',
    ) => {
        router.post(
            `/admin/shops/${shopId}/permit`,
            { permit },
            {
                onSuccess: () => {
                    toast.success(
                        `Izin ${permit.toUpperCase()} toko berhasil diperbarui!`,
                    );
                },
            },
        );
    };

    const confirmDeleteShop = () => {
        if (!shopToDelete) {
            return;
        }

        router.delete(`/admin/shops/${shopToDelete.id}`, {
            onSuccess: () => {
                toast.success(`Toko "${shopToDelete.name}" berhasil dihapus.`);
                setShopToDelete(null);
            },
        });
    };

    const handleExportExcel = () => {
        const exportData = shops.map((shop, index) => ({
            No: index + 1,
            'Nama Pemilik': shop.ownerName,
            'Nama Toko': shop.name,
            'Sektor Usaha': shop.category,
            Dusun: shop.dusun,
            Alamat: shop.address,
            'No WhatsApp': shop.phone,
            'Status Verifikasi': shop.isVerified
                ? 'Terverifikasi'
                : 'Dalam Review',
            'Izin NIB': shop.nib ? 'Ya' : 'Tidak',
            'Izin HALAL': shop.halal ? 'Ya' : 'Tidak',
            'Izin PIRT': shop.pirt ? 'Ya' : 'Tidak',
            'Jam Kerja': shop.jamKerja || '08:00 - 17:00',
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan_UMKM_Desa');
        const fileName = `Laporan_UMKM_Desa_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        toast.success(`Laporan Excel "${fileName}" berhasil diunduh!`);
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900 dark:text-navy-100"
            id="admin-shops-subtab"
        >
            {/* Header & Controls Toolbar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 dark:border-navy-800 dark:bg-navy-900 sm:p-6 md:flex-row md:items-center">
                <div>
                    <h3 className="text-lg font-extrabold tracking-wider text-navy-900 uppercase dark:text-white">
                        Manajemen Direktori Toko UMKM
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400 sm:text-sm">
                        Verifikasi toko warga, kelola penautan akun pemilik, toggle legalitas
                        NIB/HALAL/PIRT, atau impor & ekspor data.
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2.5 md:w-auto">
                    <Button
                        onClick={handleOpenCreateModal}
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-4 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:flex-none sm:text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah UMKM</span>
                    </Button>

                    <Button
                        onClick={onOpenImportModal}
                        variant="outline"
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-navy-200 px-4 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 sm:flex-none sm:text-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4 text-pastel-teal" />
                        <span>Impor</span>
                    </Button>

                    <Button
                        onClick={handleExportExcel}
                        variant="outline"
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-navy-200 px-4 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 sm:flex-none sm:text-sm"
                    >
                        <Download className="h-4 w-4 text-pastel-teal" />
                        <span>Ekspor</span>
                    </Button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <Input
                        type="text"
                        placeholder="Cari toko, nama pemilik, atau dusun..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-800 dark:bg-navy-900 sm:text-sm"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 sm:text-sm"
                >
                    <option value="all">
                        Semua Status Verification ({shops.length})
                    </option>
                    <option value="verified">
                        Terverifikasi (
                        {shops.filter((s) => s.isVerified).length})
                    </option>
                    <option value="pending">
                        Dalam Review (
                        {shops.filter((s) => !s.isVerified).length})
                    </option>
                </select>
            </div>

            {/* Shops Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase dark:border-navy-800 dark:bg-navy-950 dark:text-navy-400 hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Identitas Toko & Pemilik
                                </TableHead>
                                <TableHead className="p-4">
                                    Akun Pemilik (Linked User)
                                </TableHead>
                                <TableHead className="p-4">
                                    Lokasi & Kontak
                                </TableHead>
                                <TableHead className="p-4">
                                    Legalitas (Toggle Admin)
                                </TableHead>
                                <TableHead className="p-4">
                                    Status Verifikasi
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Tindakan Moderasi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShops.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Tidak ada data toko yang cocok dengan
                                        filter pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredShops.map((shop) => {
                                    const linkedUser = users.find((u) => u.id === shop.userId);

                                    return (
                                        <TableRow
                                            key={shop.id}
                                            className="border-b border-navy-100 transition-colors hover:bg-navy-50/30 dark:border-navy-800 dark:hover:bg-navy-950/50"
                                        >
                                            {/* Identity */}
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={shop.logo}
                                                        alt={shop.name}
                                                        className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover dark:border-navy-700"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/shops/${shop.id}`}
                                                            className="block truncate text-xs font-extrabold text-navy-900 hover:text-pastel-teal dark:text-white sm:text-sm"
                                                        >
                                                            {shop.name}
                                                        </Link>
                                                        <span className="block text-xs font-normal text-navy-500 dark:text-navy-400">
                                                            Pemilik:{' '}
                                                            <strong className="font-semibold text-navy-700 dark:text-navy-200">
                                                                {shop.ownerName}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Linked User Account */}
                                            <TableCell className="p-4 text-xs">
                                                {linkedUser ? (
                                                    <div className="space-y-0.5">
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-pastel-teal">
                                                            <UserCheck className="h-3.5 w-3.5" />
                                                            {linkedUser.name}
                                                        </span>
                                                        <span className="block font-mono text-[11px] text-navy-400">
                                                            {linkedUser.email}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-navy-400 italic">Standalone (Belum bertaut)</span>
                                                )}
                                            </TableCell>

                                            {/* Location & Contact */}
                                            <TableCell className="p-4 text-xs sm:text-sm">
                                                <div className="space-y-1">
                                                    <span className="flex items-center gap-1.5 font-medium text-navy-800 dark:text-navy-200">
                                                        <MapPin className="h-4 w-4 shrink-0 text-pastel-teal" />
                                                        <span>{shop.dusun}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 font-mono text-xs text-navy-500 dark:text-navy-400">
                                                        <PhoneCall className="h-3.5 w-3.5 shrink-0 text-pastel-teal" />
                                                        <span>{shop.phone}</span>
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Interactive Legal Permit Toggles */}
                                            <TableCell className="p-4 text-xs">
                                                <div className="flex flex-wrap gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTogglePermit(
                                                                shop.id,
                                                                'nib',
                                                            )
                                                        }
                                                        title="Klik untuk ubah status NIB"
                                                        className={`cursor-pointer rounded-lg border px-2 py-1 text-[10px] font-black uppercase transition-all ${
                                                            shop.nib
                                                                ? 'border-pastel-lavender/30 bg-pastel-lavender-light text-pastel-lavender hover:opacity-80'
                                                                : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100 dark:border-navy-700 dark:bg-navy-800'
                                                        }`}
                                                    >
                                                        NIB
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTogglePermit(
                                                                shop.id,
                                                                'halal',
                                                            )
                                                        }
                                                        title="Klik untuk ubah status HALAL"
                                                        className={`cursor-pointer rounded-lg border px-2 py-1 text-[10px] font-black uppercase transition-all ${
                                                            shop.halal
                                                                ? 'border-pastel-teal/30 bg-pastel-teal-light text-pastel-teal hover:opacity-80'
                                                                : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100 dark:border-navy-700 dark:bg-navy-800'
                                                        }`}
                                                    >
                                                        HALAL
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleTogglePermit(
                                                                shop.id,
                                                                'pirt',
                                                            )
                                                        }
                                                        title="Klik untuk ubah status P-IRT"
                                                        className={`cursor-pointer rounded-lg border px-2 py-1 text-[10px] font-black uppercase transition-all ${
                                                            shop.pirt
                                                                ? 'border-pastel-peach/30 bg-pastel-peach-light text-pastel-peach hover:opacity-80'
                                                                : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100 dark:border-navy-700 dark:bg-navy-800'
                                                        }`}
                                                    >
                                                        P-IRT
                                                    </button>
                                                </div>
                                            </TableCell>

                                            {/* Verification Status */}
                                            <TableCell className="p-4">
                                                {shop.isVerified ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-3 py-1 text-xs font-black text-pastel-teal uppercase">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Terverifikasi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-pastel-peach/20 bg-pastel-peach-light px-3 py-1 text-xs font-black text-pastel-peach uppercase">
                                                        <AlertCircle className="h-4 w-4" />
                                                        Dalam Review
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleToggleVerify(
                                                                shop.id,
                                                                shop.isVerified,
                                                            )
                                                        }
                                                        className={`h-9 cursor-pointer rounded-xl text-xs font-bold tracking-wider uppercase ${
                                                            shop.isVerified
                                                                ? 'border-pastel-peach/20 bg-pastel-peach-light text-pastel-peach hover:bg-pastel-peach/20'
                                                                : 'border-pastel-teal bg-pastel-teal text-white hover:bg-pastel-teal/90'
                                                        }`}
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                        <span className="hidden sm:inline">
                                                            {shop.isVerified
                                                                ? 'Batalkan'
                                                                : 'Verifikasi'}
                                                        </span>
                                                    </Button>

                                                    <button
                                                        onClick={() => handleOpenEditModal(shop)}
                                                        className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-100 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800"
                                                        title="Edit / Tautkan Toko"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            setShopToDelete({
                                                                id: shop.id,
                                                                name: shop.name,
                                                            })
                                                        }
                                                        className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral"
                                                        title="Hapus Toko"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* CREATE / EDIT SHOP MODAL DIALOG PORTAL */}
            {isShopModalOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-xs animate-fade-in font-sans text-navy-900 dark:text-navy-100 overflow-y-auto">
                    <div className="relative my-8 w-full max-w-lg rounded-3xl border border-navy-200/80 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900">
                        <div className="flex items-center justify-between border-b border-navy-100 pb-3 dark:border-navy-800">
                            <h3 className="flex items-center gap-2 text-sm font-black text-navy-900 uppercase dark:text-white">
                                <Store className="h-4 w-4 text-pastel-teal" />
                                <span>{editingShopId ? 'Edit & Tautkan Toko UMKM' : 'Tambah Toko UMKM Baru'}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsShopModalOpen(false)}
                                className="rounded-xl p-1 text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveShop} className="mt-4 space-y-4">
                            {/* USER LINKING SELECT */}
                            <div className="rounded-2xl border border-pastel-teal/30 bg-pastel-teal-light/20 p-3.5 dark:bg-navy-950 space-y-1">
                                <label className="block text-xs font-black text-pastel-teal uppercase">
                                    Tautkan Akun Pemilik (User Account Link)
                                </label>
                                <select
                                    value={shopForm.user_id}
                                    onChange={(e) => handleSelectUserLink(e.target.value)}
                                    className="w-full rounded-xl border border-navy-200 bg-white p-2.5 text-xs font-bold text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100"
                                >
                                    <option value="">-- Tanpa Tautan Akun (Standalone) --</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={String(u.id)}>
                                            👤 {u.name} ({u.email}) - Role: {u.role.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[11px] text-navy-500 dark:text-navy-400">
                                    Pengguna yang ditautkan dapat mengelola produk toko ini melalui dashboard seller (`/merchant/dashboard`).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Nama Toko UMKM *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Kue Karamel Samirono..."
                                        value={shopForm.name}
                                        onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Nama Pemilik Toko *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Siti Tani..."
                                        value={shopForm.owner_name}
                                        onChange={(e) => setShopForm({ ...shopForm, owner_name: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Sektor Usaha *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Kuliner / Kerajinan / Pertanian..."
                                        value={shopForm.category}
                                        onChange={(e) => setShopForm({ ...shopForm, category: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Dusun *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Dusun Samirono / Bentar / Nglelo..."
                                        value={shopForm.dusun}
                                        onChange={(e) => setShopForm({ ...shopForm, dusun: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        No WhatsApp (628...)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="6285725900000"
                                        value={shopForm.phone}
                                        onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Alamat Lengkap RT/RW
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="RT 02 RW 01 Dusun Samirono..."
                                        value={shopForm.address}
                                        onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Deskripsi Singkat Toko
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Penjelasan keunggulan toko atau produk unggulan warga..."
                                    value={shopForm.description}
                                    onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                />
                            </div>

                            {/* Legalities Badges & Verification Checkboxes */}
                            <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-3 dark:border-navy-800 dark:bg-navy-950 space-y-2">
                                <label className="block text-xs font-black text-navy-700 uppercase dark:text-navy-300">
                                    Status Legalitas & Verifikasi
                                </label>

                                <div className="flex flex-wrap gap-4 text-xs font-bold text-navy-800 dark:text-navy-200">
                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            checked={shopForm.nib}
                                            onChange={(e) => setShopForm({ ...shopForm, nib: e.target.checked })}
                                            className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                        />
                                        <span>Punya NIB</span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            checked={shopForm.halal}
                                            onChange={(e) => setShopForm({ ...shopForm, halal: e.target.checked })}
                                            className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                        />
                                        <span>Punya HALAL</span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            checked={shopForm.pirt}
                                            onChange={(e) => setShopForm({ ...shopForm, pirt: e.target.checked })}
                                            className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                        />
                                        <span>Punya P-IRT</span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-1.5">
                                        <input
                                            type="checkbox"
                                            checked={shopForm.is_verified}
                                            onChange={(e) => setShopForm({ ...shopForm, is_verified: e.target.checked })}
                                            className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                        />
                                        <span className="text-pastel-teal font-extrabold">Langsung Verifikasi</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsShopModalOpen(false)}
                                    className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-bold text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-pastel-teal px-5 py-2 text-xs font-black text-white shadow-xs hover:bg-pastel-teal/90"
                                >
                                    {editingShopId ? 'Simpan Perubahan' : 'Buat Toko Baru'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Custom Confirmation Modal */}
            <ConfirmDialog
                isOpen={!!shopToDelete}
                title="Konfirmasi Hapus Toko"
                description={`Apakah Anda yakin ingin menghapus toko "${shopToDelete?.name}" beserta seluruh produknya dari direktori desa? Action ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus Toko"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={confirmDeleteShop}
                onCancel={() => setShopToDelete(null)}
            />
        </div>
    );
}
