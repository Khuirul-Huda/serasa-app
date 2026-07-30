/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, CheckCircle2, AlertCircle, FileSpreadsheet, Trash2, ShieldCheck, MapPin, PhoneCall, Download, Award } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import React from "react";
import * as XLSX from "xlsx";
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
    router.post(`/admin/shops/${shopId}/verify`);
  };

  const handleTogglePermit = (shopId: string, permit: "nib" | "halal" | "pirt") => {
    router.post(`/admin/shops/${shopId}/permit`, { permit });
  };

  const handleDeleteShop = (shopId: string, shopName: string) => {
    if (confirm(`Hapus toko "${shopName}" beserta produknya dari platform?`)) {
      router.delete(`/admin/shops/${shopId}`);
    }
  };

  const handleExportExcel = () => {
    const exportData = shops.map((shop, index) => ({
      No: index + 1,
      "Nama Pemilik": shop.ownerName,
      "Nama Toko": shop.name,
      "Sektor Usaha": shop.category,
      Dusun: shop.dusun,
      Alamat: shop.address,
      "No WhatsApp": shop.phone,
      "Status Verifikasi": shop.isVerified ? "Terverifikasi" : "Dalam Review",
      "Izin NIB": shop.nib ? "Ya" : "Tidak",
      "Izin HALAL": shop.halal ? "Ya" : "Tidak",
      "Izin PIRT": shop.pirt ? "Ya" : "Tidak",
      "Jam Kerja": shop.jamKerja || "08:00 - 17:00",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan_UMKM_Desa");
    XLSX.writeFile(wb, `Laporan_UMKM_Desa_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-shops-subtab">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider">
            Manajemen Direktori Toko UMKM
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Verifikasi toko warga, kelola toggle legalitas NIB/HALAL/PIRT, atau impor & ekspor laporan desa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="px-4 h-10 border-navy-200 text-navy-700 hover:bg-navy-50 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer flex-1 sm:flex-none justify-center"
          >
            <Download className="w-4 h-4 text-pastel-teal" />
            <span>Ekspor Excel</span>
          </Button>

          <Button
            onClick={onOpenImportModal}
            className="px-5 h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer flex-1 sm:flex-none justify-center"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>Impor Spreadsheet</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari toko, nama pemilik, atau dusun..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
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
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50 text-xs font-extrabold uppercase text-navy-600 tracking-wider">
                <TableHead className="p-4">Identitas Toko & Pemilik</TableHead>
                <TableHead className="p-4">Lokasi & Kontak</TableHead>
                <TableHead className="p-4">Legalitas (Klik Toggle Admin)</TableHead>
                <TableHead className="p-4">Status Verifikasi</TableHead>
                <TableHead className="p-4 text-right">Tindakan Moderasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="p-8 text-center text-xs sm:text-sm text-navy-400 italic"
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
                          className="w-12 h-12 rounded-xl object-cover border border-navy-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/shops/${shop.id}`}
                            className="font-extrabold text-navy-900 text-xs sm:text-sm hover:text-pastel-teal truncate block"
                          >
                            {shop.name}
                          </Link>
                          <span className="text-xs text-navy-500 block font-normal">
                            Pemilik: <strong className="font-semibold text-navy-700">{shop.ownerName}</strong>
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location & Contact */}
                    <TableCell className="p-4 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <span className="flex items-center gap-1.5 text-navy-800 font-medium">
                          <MapPin className="w-4 h-4 text-pastel-teal shrink-0" />
                          <span>{shop.dusun}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-navy-500">
                          <PhoneCall className="w-3.5 h-3.5 text-pastel-teal shrink-0" />
                          <span>{shop.phone}</span>
                        </span>
                      </div>
                    </TableCell>

                    {/* Interactive Legal Permit Toggles */}
                    <TableCell className="p-4 text-xs">
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePermit(shop.id, "nib")}
                          title="Klik untuk ubah status NIB"
                          className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            shop.nib
                              ? "bg-pastel-lavender-light text-pastel-lavender border-pastel-lavender/30 hover:opacity-80"
                              : "bg-navy-100 text-navy-400 border-navy-200 line-through opacity-70 hover:opacity-100"
                          }`}
                        >
                          NIB
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePermit(shop.id, "halal")}
                          title="Klik untuk ubah status HALAL"
                          className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            shop.halal
                              ? "bg-pastel-teal-light text-pastel-teal border-pastel-teal/30 hover:opacity-80"
                              : "bg-navy-100 text-navy-400 border-navy-200 line-through opacity-70 hover:opacity-100"
                          }`}
                        >
                          HALAL
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePermit(shop.id, "pirt")}
                          title="Klik untuk ubah status P-IRT"
                          className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            shop.pirt
                              ? "bg-pastel-peach-light text-pastel-peach border-pastel-peach/30 hover:opacity-80"
                              : "bg-navy-100 text-navy-400 border-navy-200 line-through opacity-70 hover:opacity-100"
                          }`}
                        >
                          P-IRT
                        </button>
                      </div>
                    </TableCell>

                    {/* Verification Status */}
                    <TableCell className="p-4">
                      {shop.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pastel-teal-light text-pastel-teal text-xs font-black uppercase rounded-lg border border-pastel-teal/20">
                          <CheckCircle2 className="w-4 h-4" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pastel-peach-light text-pastel-peach text-xs font-black uppercase rounded-lg border border-pastel-peach/20">
                          <AlertCircle className="w-4 h-4" />
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
                          className={`h-9 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
                            shop.isVerified
                              ? "bg-pastel-peach-light text-pastel-peach border-pastel-peach/20 hover:bg-pastel-peach/20"
                              : "bg-pastel-teal text-white border-pastel-teal hover:bg-pastel-teal/90"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            {shop.isVerified ? "Batalkan" : "Verifikasi"}
                          </span>
                        </Button>

                        <button
                          onClick={() => handleDeleteShop(shop.id, shop.name)}
                          className="p-2 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                          title="Hapus Toko"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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
