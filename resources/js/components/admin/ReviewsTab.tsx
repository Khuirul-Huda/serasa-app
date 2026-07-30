/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import { Star, Trash2, MessageSquare, Search, Download } from 'lucide-react';
import React, { useState, useMemo } from 'react';
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
import type { AdminReview } from '@/pages/admin-dashboard';

interface ReviewsTabProps {
    reviews: AdminReview[];
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [reviewToDelete, setReviewToDelete] = useState<{
        id: string;
        userName: string;
    } | null>(null);

    const filteredReviews = useMemo(() => {
        return reviews.filter((r) => {
            const q = searchQuery.toLowerCase();

            return (
                r.userName.toLowerCase().includes(q) ||
                r.productName.toLowerCase().includes(q) ||
                r.comment.toLowerCase().includes(q)
            );
        });
    }, [reviews, searchQuery]);

    const confirmDeleteReview = () => {
        if (!reviewToDelete) {
            return;
        }

        router.delete(`/admin/reviews/${reviewToDelete.id}`, {
            onSuccess: () => {
                toast.success(
                    `Ulasan dari "${reviewToDelete.userName}" berhasil dihapus.`,
                );
                setReviewToDelete(null);
            },
        });
    };

    const handleExportExcel = () => {
        const exportData = reviews.map((rev, index) => ({
            No: index + 1,
            Pengulas: rev.userName,
            Produk: rev.productName,
            Rating: rev.rating,
            Komentar: rev.comment,
            Waktu: rev.createdAt,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan_Ulasan_Pembeli');
        const fileName = `Laporan_Ulasan_Pembeli_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        toast.success(`Laporan Excel ulasan "${fileName}" berhasil diunduh!`);
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-reviews-tab"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                        <MessageSquare className="h-5 w-5 text-pastel-teal" />
                        <span>Moderasi Ulasan & Feedback Pembeli</span>
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                        Pantau masukan masyarakat dan moderasi tanggapan yang
                        tidak pantas dari etalase.
                    </p>
                </div>

                <Button
                    onClick={handleExportExcel}
                    variant="outline"
                    className="shadow-3xs flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-navy-200 px-4 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:bg-navy-50 sm:w-auto sm:text-sm"
                >
                    <Download className="h-4 w-4 text-pastel-teal" />
                    <span>Ekspor Excel Ulasan</span>
                </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                <Input
                    type="text"
                    placeholder="Cari pengulas, nama produk, atau isi ulasan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                />
            </div>

            {/* Reviews Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Pengulas & Tanggal
                                </TableHead>
                                <TableHead className="p-4">
                                    Produk Tujuan
                                </TableHead>
                                <TableHead className="p-4">
                                    Rating Bintang
                                </TableHead>
                                <TableHead className="p-4">
                                    Komentar / Ulasan
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Moderasi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredReviews.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Belum ada ulasan yang cocok dengan
                                        pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredReviews.map((rev) => (
                                    <TableRow
                                        key={rev.id}
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30"
                                    >
                                        <TableCell className="p-4 text-xs font-bold text-navy-900 sm:text-sm">
                                            <div>
                                                <span>{rev.userName}</span>
                                                <span className="block text-xs font-normal text-navy-400">
                                                    {rev.createdAt}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="p-4 text-xs font-extrabold text-navy-800 sm:text-sm">
                                            {rev.productName}
                                        </TableCell>

                                        <TableCell className="p-4">
                                            <div className="flex w-fit items-center gap-1 rounded-lg border border-pastel-peach/30 bg-pastel-peach-light px-2.5 py-1 text-xs font-bold text-navy-800">
                                                <Star className="h-3.5 w-3.5 fill-pastel-peach text-pastel-peach" />
                                                <span>{rev.rating}.0</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="max-w-md p-4 text-xs leading-relaxed font-normal text-navy-600 sm:text-sm">
                                            "{rev.comment}"
                                        </TableCell>

                                        <TableCell className="p-4 text-right">
                                            <button
                                                onClick={() =>
                                                    setReviewToDelete({
                                                        id: rev.id,
                                                        userName: rev.userName,
                                                    })
                                                }
                                                className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral"
                                                title="Hapus Ulasan"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmDialog
                isOpen={!!reviewToDelete}
                title="Konfirmasi Hapus Ulasan"
                description={`Hapus ulasan dari "${reviewToDelete?.userName}"? Rating rata-rata produk terkait akan dihitung ulang secara otomatis.`}
                confirmLabel="Ya, Hapus Ulasan"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={confirmDeleteReview}
                onCancel={() => setReviewToDelete(null)}
            />
        </div>
    );
}
