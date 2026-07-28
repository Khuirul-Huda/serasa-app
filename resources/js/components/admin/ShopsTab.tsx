/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, CheckCircle2, AlertCircle, FileSpreadsheet, Trash2, ShieldCheck, MapPin, PhoneCall } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Shop } from "@/types";

interface ShopsTabProps {
  shops: Shop[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "verified" | "pending";
  setStatusFilter: (filter: "all" | "verified" | "pending") => void;
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
  const filteredShops = shops.filter((shop) => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && shop.isVerified) ||
      (statusFilter === "pending" && !shop.isVerified);

    return matchesSearch && matchesStatus;
  });

  const handleToggleVerify = (shopId: string) => {
    router.put(`/admin/shops/${shopId}/verify`);
  };

  const handleDeleteShop = (shopId: string, shopName: string) => {
    if (confirm(`Hapus toko "${shopName}" beserta produknya dari platform?`)) {
      router.delete(`/admin/shops/${shopId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-shops-subtab">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-navy-200/60 p-5 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">
            Manajemen Direktori Toko UMKM
          </h3>
          <p className="text-xs text-navy-500 mt-0.5">
            Verifikasi toko warga, kelola legalitas NIB/HALAL, atau impor spreadsheet data desa.
          </p>
        </div>

        <Button
          onClick={onOpenImportModal}
          className="px-5 h-9 bg-pastel-teal hover:bg-pastel-teal/90 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Import Spreadsheet Excel</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari toko, nama pemilik, atau dusun..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
        >
          <option value="all">Semua Status Verification ({shops.length})</option>
          <option value="verified">
            Terverifikasi ({shops.filter((s) => s.isVerified).length})
          </option>
          <option value="pending">
            Dalam Review ({shops.filter((s) => !s.isVerified).length})
          </option>
        </select>
      </div>

      {/* Shops Table */}
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50">
                <TableHead className="p-4">Identitas Toko & Pemilik</TableHead>
                <TableHead className="p-4">Lokasi & Kontak</TableHead>
                <TableHead className="p-4">Legalitas (NIB/PIRT)</TableHead>
                <TableHead className="p-4">Status Verifikasi</TableHead>
                <TableHead className="p-4 text-right">Tindakan Moderasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-8 text-center text-xs text-navy-400 italic"
                  >
                    Tidak ada data toko yang cocok dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredShops.map((shop) => (
                  <TableRow
                    key={shop.id}
                    className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors"
                  >
                    {/* Identity */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={shop.logo}
                          alt={shop.name}
                          className="w-10 h-10 rounded-xl object-cover border border-navy-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/shops/${shop.id}`}
                            className="font-bold text-navy-900 text-xs hover:text-pastel-teal truncate block"
                          >
                            {shop.name}
                          </Link>
                          <span className="text-[10px] text-navy-400 block font-medium">
                            Pemilik: {shop.ownerName}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location & Contact */}
                    <TableCell className="p-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1 text-navy-700 font-medium">
                          <MapPin className="w-3 h-3 text-pastel-teal shrink-0" />
                          <span>{shop.dusun}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px] text-navy-400">
                          <PhoneCall className="w-3 h-3 text-pastel-teal shrink-0" />
                          <span>{shop.phone}</span>
                        </span>
                      </div>
                    </TableCell>

                    {/* Legalities */}
                    <TableCell className="p-4 text-xs">
                      <div className="flex gap-1 flex-wrap">
                        {shop.nib ? (
                          <span className="px-1.5 py-0.5 bg-pastel-lavender-light text-pastel-lavender text-[8px] font-black uppercase rounded">
                            NIB
                          </span>
                        ) : null}
                        {shop.halal ? (
                          <span className="px-1.5 py-0.5 bg-pastel-teal-light text-pastel-teal text-[8px] font-black uppercase rounded">
                            HALAL
                          </span>
                        ) : null}
                        {shop.pirt ? (
                          <span className="px-1.5 py-0.5 bg-pastel-peach-light text-pastel-peach text-[8px] font-black uppercase rounded">
                            P-IRT
                          </span>
                        ) : null}
                        {!shop.nib && !shop.halal && !shop.pirt && (
                          <span className="text-[10px] text-navy-400 italic">
                            -
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Verification Status */}
                    <TableCell className="p-4">
                      {shop.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pastel-teal-light text-pastel-teal text-[9px] font-black uppercase rounded-lg border border-pastel-teal/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pastel-peach-light text-pastel-peach text-[9px] font-black uppercase rounded-lg border border-pastel-peach/20">
                          <AlertCircle className="w-3.5 h-3.5" />
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
                          onClick={() => handleToggleVerify(shop.id)}
                          className={`h-8 rounded-xl text-[9.5px] font-bold uppercase tracking-wider cursor-pointer ${
                            shop.isVerified
                              ? "bg-pastel-peach-light text-pastel-peach border-pastel-peach/20 hover:bg-pastel-peach/20"
                              : "bg-pastel-teal text-white border-pastel-teal hover:bg-pastel-teal/90"
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>
                            {shop.isVerified ? "Batalkan" : "Verifikasi"}
                          </span>
                        </Button>

                        <button
                          onClick={() => handleDeleteShop(shop.id, shop.name)}
                          className="p-1.5 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors"
                          title="Hapus Toko"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
