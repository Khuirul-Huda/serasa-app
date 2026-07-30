/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, Trash2, MessageSquare, ShieldAlert } from "lucide-react";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
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
  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Hapus ulasan ini dari platform? Rating rata-rata produk akan dihitung ulang.")) {
      router.delete(`/admin/reviews/${reviewId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-reviews-tab">
      {/* Header Bar */}
      <div className="bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-pastel-teal" />
            <span>Moderasi Ulasan & Feedback Pembeli</span>
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Pantau masukan masyarakat dan moderasi tanggapan yang tidak pantas dari etalase.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-pastel-teal-light border border-pastel-teal/20 text-pastel-teal font-black text-xs uppercase tracking-wider rounded-xl">
          {reviews.length} Ulasan Masuk
        </span>
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
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-xs sm:text-sm text-navy-400 italic">
                    Belum ada ulasan pembeli terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((rev) => (
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
                        onClick={() => handleDeleteReview(rev.id)}
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
    </div>
  );
}
