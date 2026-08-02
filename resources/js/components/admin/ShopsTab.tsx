/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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
} from 'lucide-react';
import React, { useState } from 'react';
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
import type { Shop } from '@/types';

interface ShopsTabProps {
    shops: Shop[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: 'all' | 'verified' | 'pending';
    setStatusFilter: (filter: 'all' | 'verified' | 'pending') => void;
    onOpenImportModal: () => void;
}

export default function ShopsTab({
    shops,
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
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-shops-subtab"
        >
            {/* Header & Controls Toolbar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 sm:p-6 md:flex-row md:items-center">
                <div>
                    <h3 className="text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                        Manajemen Direktori Toko UMKM
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                        Verifikasi toko warga, kelola toggle legalitas
                        NIB/HALAL/PIRT, atau impor & ekspor laporan desa.
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2.5 md:w-auto">
                    <a
                        href="/templates/Template_Import_UMKM_2026.xlsx"
                        download="Template_Import_UMKM_2026.xlsx"
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-pastel-teal/30 bg-pastel-teal-light/40 px-4 text-xs font-bold tracking-wider text-pastel-teal uppercase transition-all hover:bg-pastel-teal hover:text-white sm:flex-none sm:text-sm"
                    >
                        <Download className="h-4 w-4" />
                        <span>Unduh Template</span>
                    </a>

                    <Button
                        onClick={handleExportExcel}
                        variant="outline"
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-navy-200 px-4 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:bg-navy-50 sm:flex-none sm:text-sm"
                    >
                        <Download className="h-4 w-4 text-pastel-teal" />
                        <span>Ekspor Excel</span>
                    </Button>

                    <Button
                        onClick={onOpenImportModal}
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:flex-none sm:text-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4 text-white" />
                        <span>Impor Spreadsheet</span>
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
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
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
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Identitas Toko & Pemilik
                                </TableHead>
                                <TableHead className="p-4">
                                    Lokasi & Kontak
                                </TableHead>
                                <TableHead className="p-4">
                                    Legalitas (Klik Toggle Admin)
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
                                        colSpan={5}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Tidak ada data toko yang cocok dengan
                                        filter pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredShops.map((shop) => (
                                    <TableRow
                                        key={shop.id}
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30"
                                    >
                                        {/* Identity */}
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={shop.logo}
                                                    alt={shop.name}
                                                    className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/shops/${shop.id}`}
                                                        className="block truncate text-xs font-extrabold text-navy-900 hover:text-pastel-teal sm:text-sm"
                                                    >
                                                        {shop.name}
                                                    </Link>
                                                    <span className="block text-xs font-normal text-navy-500">
                                                        Pemilik:{' '}
                                                        <strong className="font-semibold text-navy-700">
                                                            {shop.ownerName}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Location & Contact */}
                                        <TableCell className="p-4 text-xs sm:text-sm">
                                            <div className="space-y-1">
                                                <span className="flex items-center gap-1.5 font-medium text-navy-800">
                                                    <MapPin className="h-4 w-4 shrink-0 text-pastel-teal" />
                                                    <span>{shop.dusun}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5 font-mono text-xs text-navy-500">
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
                                                            : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100'
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
                                                            : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100'
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
                                                            : 'border-navy-200 bg-navy-100 text-navy-400 line-through opacity-70 hover:opacity-100'
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
                                            <div className="flex items-center justify-end gap-2">
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
                                                    <span>
                                                        {shop.isVerified
                                                            ? 'Batalkan'
                                                            : 'Verifikasi'}
                                                    </span>
                                                </Button>

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
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

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
