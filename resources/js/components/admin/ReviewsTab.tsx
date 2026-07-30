/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, Trash2, MessageSquare, Search, Download } from "lucide-react";
import { router } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { AdminReview } from "@/pages/admin-dashboard";

interface ReviewsTabProps {
  reviews: AdminReview[];
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewToDelete, setReviewToDelete] = useState<{ id: string; userName: string } | null>(null);

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
    if (!reviewToDelete) return;
    router.delete(`/admin/reviews/${reviewToDelete.id}`, {
      onSuccess: () => {
        toast.success(`Ulasan dari "${reviewToDelete.userName}" berhasil dihapus.`);
        setReviewToDelete(null);
      },
    });
  };

  const handleExportExcel = () => {
    const exportData = reviews.map((rev, index) => ({
      No: index + 1,
      "Pengulas": rev.userName,
      "Produk": rev.productName,
      "Rating": rev.rating,
      "Komentar": rev.comment,
      "Waktu": rev.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan_Ulasan_Pembeli");
    const fileName = `Laporan_Ulasan_Pembeli_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Laporan Excel ulasan "${fileName}" berhasil diunduh!`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-reviews-tab">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pastel-teal" />
            <span>Moderasi Ulasan & Feedback Pembeli</span>
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Pantau masukan masyarakat dan moderasi tanggapan yang tidak pantas dari etalase.
          </p>
        </div>

        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="px-4 h-10 border-navy-200 text-navy-700 hover:bg-navy-50 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 text-pastel-teal" />
          <span>Ekspor Excel Ulasan</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <Input
          type="text"
          placeholder="Cari pengulas, nama produk, atau isi ulasan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-2.5 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white text-xs sm:text-sm"
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50 text-xs font-extrabold uppercase text-navy-600 tracking-wider">
                <TableHead className="p-4">Pengulas & Tanggal</TableHead>
                <TableHead className="p-4">Produk Tujuan</TableHead>
                <TableHead className="p-4">Rating Bintang</TableHead>
                <TableHead className="p-4">Komentar / Ulasan</TableHead>
                <TableHead className="p-4 text-right">Moderasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-xs sm:text-sm text-navy-400 italic">
                    Belum ada ulasan yang cocok dengan pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((rev) => (
                  <TableRow key={rev.id} className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors">
                    <TableCell className="p-4 font-bold text-navy-900 text-xs sm:text-sm">
                      <div>
                        <span>{rev.userName}</span>
                        <span className="block text-xs text-navy-400 font-normal">{rev.createdAt}</span>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 text-xs sm:text-sm font-extrabold text-navy-800">
                      {rev.productName}
                    </TableCell>

                    <TableCell className="p-4">
                      <div className="flex items-center gap-1 bg-pastel-peach-light border border-pastel-peach/30 px-2.5 py-1 rounded-lg w-fit text-xs font-bold text-navy-800">
                        <Star className="w-3.5 h-3.5 fill-pastel-peach text-pastel-peach" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 text-xs sm:text-sm text-navy-600 font-normal leading-relaxed max-w-md">
                      "{rev.comment}"
                    </TableCell>

                    <TableCell className="p-4 text-right">
                      <button
                        onClick={() => setReviewToDelete({ id: rev.id, userName: rev.userName })}
                        className="p-2 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
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
