/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router, Link } from "@inertiajs/react";
import { 
  CheckCircle2, 
  Trash2, 
  Save, 
  Store, 
  Sparkles,
  AlertCircle,
  Award,
  Package,
  Activity,
  UserCheck,
  Search,
  Eye,
  MapPin,
  PhoneCall,
  FileSpreadsheet,
  UploadCloud,
  X,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import React, { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import type { AppSettings, Shop, Product, Category } from "@/types";

interface AdminPanelProps {
  settings: AppSettings;
  shops: Shop[];
  products: Product[];
  categories: Category[];
}

interface ParsedImportRow {
  rowNum: number;
  ownerName: string;
  address: string;
  dusun: string;
  phone: string;
  name: string;
  category: string;
  nib: boolean;
  halal: boolean;
  pirt: boolean;
  isConflict: boolean;
  conflictShopName?: string;
  action: "import" | "skip";
}

export default function AdminPanel({
  settings,
  shops,
  products,
  categories,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "shops" | "config">("stats");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchShopQuery, setSearchShopQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending">("all");

  // Excel Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importRows, setImportRows] = useState<ParsedImportRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmittingImport, setIsSubmittingImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inertia Form for app settings
  const { data, setData, post, processing } = useForm({
    appName: settings.appName,
    tagline: settings.tagline,
    villageName: settings.villageName,
    description: settings.description,
    adminPhone: settings.adminPhone,
    heroBanner: settings.heroBanner,
  });

  const totalShops = shops.length;
  const verifiedShops = shops.filter((s) => s.isVerified).length;
  const pendingShops = totalShops - verifiedShops;
  const totalProducts = products.length;

  const categoryDistribution = categories.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length;

    return { id: cat.id, name: cat.name, count, color: cat.color };
  });

  const filteredShopsTable = useMemo(() => {
    return shops.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchShopQuery.toLowerCase()) ||
        s.ownerName.toLowerCase().includes(searchShopQuery.toLowerCase()) ||
        s.dusun.toLowerCase().includes(searchShopQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "verified" && s.isVerified) || 
        (statusFilter === "pending" && !s.isVerified);
        
      return matchesSearch && matchesStatus;
    });
  }, [shops, searchShopQuery, statusFilter]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/settings", {
      onSuccess: () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      },
    });
  };

  const handleToggleVerifyShop = (shopId: string) => {
    router.post(`/admin/shops/${shopId}/verify`);
  };

  const handleDeleteShop = (shopId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus toko ini beserta seluruh produknya secara permanen dari sistem desa?")) {
      router.delete(`/admin/shops/${shopId}`);
    }
  };

  // Parse Excel File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

        const parsed: ParsedImportRow[] = [];

        // Data rows start from row index 4 (0: title, 1: year, 2: update date, 3: header 1, 4: header 2, 5+: data)
        for (let i = 5; i < rawRows.length; i++) {
          const row = rawRows[i];
          if (!row || row.length === 0) continue;

          const no = row[0];
          const ownerName = row[1] ? String(row[1]).trim() : "";
          const address = row[2] ? String(row[2]).trim() : "";
          const phone = row[3] ? String(row[3]).trim() : "";
          let businessName = row[4] ? String(row[4]).trim() : "";
          const businessType = row[5] ? String(row[5]).trim() : "";

          // Skip completely empty rows
          if (!ownerName && !businessName && !businessType) continue;

          // Auto-fill fallback rule: if nama usaha is null/empty, get from jenis usaha
          if (!businessName && businessType) {
            businessName = businessType;
          }

          // Extract dusun from address if possible, default to Desa Samirono
          let dusun = "Desa Samirono";
          if (address.toLowerCase().includes("pongangan")) dusun = "Dusun Pongangan";
          else if (address.toLowerCase().includes("tawang")) dusun = "Dusun Tawang";
          else if (address.toLowerCase().includes("samirono")) dusun = "Dusun Samirono";
          else if (address.toLowerCase().includes("bentar")) dusun = "Dusun Bentar";
          else if (address.toLowerCase().includes("surowono")) dusun = "Dusun Surowono";

          // Parse Permit Booleans (checking for 'v', 'V', '1', checkmarks)
          const nibVal = row[6] ? String(row[6]).trim().toLowerCase() : "";
          const halalVal = row[7] ? String(row[7]).trim().toLowerCase() : "";
          const pirtVal = row[8] ? String(row[8]).trim().toLowerCase() : "";

          const nib = nibVal === "v" || nibVal === "1" || nibVal === "true";
          const halal = halalVal === "v" || halalVal === "1" || halalVal === "true";
          const pirt = pirtVal === "v" || pirtVal === "1" || pirtVal === "false" ? (pirtVal === "v" || pirtVal === "1") : false;

          // Conflict resolution check against existing loaded shops
          const existingMatch = shops.find(
            (s) => s.name.toLowerCase() === businessName.toLowerCase() ||
                   s.ownerName.toLowerCase() === ownerName.toLowerCase()
          );

          parsed.push({
            rowNum: i + 1,
            ownerName: ownerName || "Pemilik Samirono",
            address: address || "Desa Samirono",
            dusun,
            phone: phone || "6285725912345",
            name: businessName || "UMKM Samirono",
            category: businessType || "Kuliner & Olahan",
            nib,
            halal,
            pirt,
            isConflict: !!existingMatch,
            conflictShopName: existingMatch ? existingMatch.name : undefined,
            action: "import",
          });
        }

        setImportRows(parsed);
      } catch (err) {
        alert("Gagal membaca file Excel. Pastikan format file .xlsx valid.");
      } finally {
        setIsParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleToggleRowAction = (index: number) => {
    setImportRows((prev) => {
      const next = [...prev];
      next[index].action = next[index].action === "import" ? "skip" : "import";
      return next;
    });
  };

  const handleSubmitImport = () => {
    const toImport = importRows.filter((r) => r.action === "import");
    if (toImport.length === 0) {
      alert("Tidak ada data UMKM yang dipilih untuk diimpor.");
      return;
    }

    setIsSubmittingImport(true);

    const payloadShops = toImport.map((r) => ({
      name: r.name,
      owner_name: r.ownerName,
      address: r.address,
      dusun: r.dusun,
      phone: r.phone,
      category: r.category,
      description: `UMKM ${r.name} di ${r.dusun}, Desa Samirono. Jenis Usaha: ${r.category}.`,
      nib: r.nib,
      halal: r.halal,
      pirt: r.pirt,
      is_verified: true,
    }));

    router.post(
      "/admin/shops/bulk-import",
      { shops: payloadShops },
      {
        onSuccess: () => {
          setIsSubmittingImport(false);
          setIsImportModalOpen(false);
          setImportRows([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => {
          setIsSubmittingImport(false);
          alert("Gagal menyimpan data impor ke server.");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8 animate-fade-in font-sans text-slate-800">
      
      {/* 1. Vercel-Style Premium Header Section */}
      <div className="bg-white border-b border-slate-200/80 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 space-y-6 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-md tracking-wider">
                Pemerintah Desa
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 font-mono text-[9px] uppercase tracking-widest font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                <UserCheck className="w-3 h-3 text-slate-500" />
                <span>Admin Console</span>
              </span>
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Portal Admin <span className="text-emerald-700">Etalase Warga</span>
            </h1>
            <p className="text-xs text-slate-500 font-normal max-w-2xl leading-relaxed">
              Atur identitas etalase desa, verifikasi legalitas UMKM warga, dan pantau perkembangan ekonomi lokal di wilayah administratif Samirono.
            </p>
          </div>
        </div>

        {/* Vercel-Style Flat Underlined Tab Switcher */}
        <div className="flex space-x-6 border-b border-slate-200 pt-2 shrink-0">
          <button
            onClick={() => setActiveSubTab("stats")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "stats"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Dasbor Statistik
          </button>
          <button
            onClick={() => setActiveSubTab("shops")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "shops"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Verifikasi Toko ({pendingShops})
          </button>
          <button
            onClick={() => setActiveSubTab("config")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeSubTab === "config"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Konfigurasi Portal
          </button>
        </div>
      </div>

      {/* 2. Main Workspaces */}
      
      {/* Dasbor Statistik Tab */}
      {activeSubTab === "stats" && (
        <div className="space-y-6 animate-fade-in" id="admin-subtab-stats">
          
          {/* Key Metrics Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col justify-between h-32 hover:border-emerald-600/30 hover:shadow-xs transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Mitra UMKM</span>
                <Store className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{totalShops}</div>
                <p className="text-[10px] text-slate-400 font-medium">Rumah produksi terdaftar</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col justify-between h-32 hover:border-emerald-600/30 hover:shadow-xs transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Verifikasi</span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{verifiedShops}</div>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="h-full bg-emerald-600 rounded-full" 
                    style={{ width: `${totalShops > 0 ? (verifiedShops / totalShops) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col justify-between h-32 hover:border-emerald-600/30 hover:shadow-xs transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Katalog Produk</span>
                <Package className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{totalProducts}</div>
                <p className="text-[10px] text-slate-400 font-medium">Item produk aktif di web</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-3xs flex flex-col justify-between h-32 hover:border-emerald-600/30 hover:shadow-xs transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Sistem Sync</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-black text-emerald-700 tracking-tight leading-none">FRANKENPHP</div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Octane Worker Mode</p>
              </div>
            </div>

          </div>

          {/* Sektor Distribution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sektor Progress Bars */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-3xl shadow-3xs space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Distribusi Sektor Kreatif</h3>
                <p className="text-xs text-slate-500">Grafik perbandingan sebaran produk ekonomi warga berdasarkan kategori.</p>
              </div>

              <div className="space-y-5">
                {categoryDistribution.map((item) => {
                  const maxCount = Math.max(...categoryDistribution.map((c) => c.count), 1);
                  const percentage = (item.count / maxCount) * 100;
                  
                  const colorMap: Record<string, string> = {
                    "cat-kuliner": "bg-rose-500",
                    "cat-pertanian": "bg-emerald-600",
                    "cat-kerajinan": "bg-amber-600",
                    "cat-wisata": "bg-sky-600",
                    "cat-fashion": "bg-purple-600"
                  };
                  const barColor = colorMap[item.id] || "bg-emerald-600";

                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${barColor}`} />
                          {item.name}
                        </span>
                        <span className="font-mono text-[9.5px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/50">
                          {item.count} Item
                        </span>
                      </div>
                      
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-150 p-0.5">
                        <div 
                          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Premium Info Panel */}
            <div className="lg:col-span-5 bg-emerald-50/40 border border-emerald-100 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">Digitalisasi Samirono</h3>
                  <p className="text-xs text-emerald-900/80 leading-relaxed font-light">
                    Sistem administrasi portal ini memudahkan kontrol informasi produk warga, meningkatkan reputasi legalitas UMKM, serta menjamin keaslian data.
                  </p>
                  <p className="text-xs text-emerald-900/80 leading-relaxed font-light">
                    Sebagai admin desa, pastikan Anda memverifikasi setiap toko baru yang didaftarkan oleh warga untuk menjaga keamanan bertransaksi.
                  </p>
                </div>
              </div>

              <div className="border-t border-emerald-200/70 pt-4 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-emerald-700 font-mono">
                <span>Dikelola Pemerintah Desa</span>
                <span>Version 1.2 (Stabil)</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Verifikasi Toko Tab */}
      {activeSubTab === "shops" && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-3xs p-6 space-y-6 animate-fade-in" id="admin-subtab-verification">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Verifikasi Legalitas Usaha</h3>
              <p className="text-xs text-slate-500 mt-0.5">Validasi legalitas rumah produksi warga sebelum diaktifkan pada katalog utama.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import UMKM (Excel)</span>
              </button>

              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari toko, pemilik, dusun..."
                  value={searchShopQuery}
                  onChange={(e) => setSearchShopQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-55/40 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs text-[10px]"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Aktif (Verified)</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-150 hover:bg-slate-50/50">
                  <TableHead className="p-4">Toko UMKM</TableHead>
                  <TableHead className="p-4">Pemilik & Kontak</TableHead>
                  <TableHead className="p-4">Lokasi Dusun</TableHead>
                  <TableHead className="p-4">Kategori Utama</TableHead>

                  <TableHead className="p-4">Izin Legalitas</TableHead>
                  <TableHead className="p-4">Status</TableHead>
                  <TableHead className="p-4 text-center">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShopsTable.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-400 italic">
                      Tidak ada toko terdaftar yang cocok dengan kriteria pencarian Anda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShopsTable.map((shop) => (
                    <TableRow key={shop.id}>
                      
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <span className="block font-extrabold text-slate-900 text-xs">{shop.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[180px]">{shop.address}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="p-4">
                        <span className="block font-bold text-slate-700">{shop.ownerName}</span>
                        <a 
                          href={`https://wa.me/${shop.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:underline font-extrabold uppercase tracking-wide mt-0.5 font-mono"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>+{shop.phone}</span>
                        </a>
                      </TableCell>

                      <TableCell className="p-4 font-mono font-bold text-slate-600 uppercase tracking-widest text-[9.5px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{shop.dusun}</span>
                        </div>
                      </TableCell>

                      <TableCell className="p-4">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200/60 font-bold text-[8.5px] uppercase tracking-wider">
                          {shop.category}
                        </span>
                      </TableCell>

                      <TableCell className="p-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {shop.nib ? (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-black rounded border border-blue-200">
                              NIB
                            </span>
                          ) : null}
                          {shop.halal ? (
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-black rounded border border-emerald-200">
                              HALAL
                            </span>
                          ) : null}
                          {shop.pirt ? (
                            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[8px] font-black rounded border border-purple-200">
                              P-IRT
                            </span>
                          ) : null}
                          {!shop.nib && !shop.halal && !shop.pirt && (
                            <span className="text-[10px] text-slate-400 font-mono italic">-</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="p-4">
                        {shop.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-wider">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50" />
                            <span>AKTIF</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-wider">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleVerifyShop(shop.id)}
                            className={`px-3 py-2 rounded-xl font-extrabold uppercase tracking-wider transition-all text-[8.5px] cursor-pointer border ${
                              shop.isVerified
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-3xs"
                            }`}
                          >
                            {shop.isVerified ? "Cabut Verifikasi" : "Verifikasi Toko"}
                          </button>
                          
                          <Link
                            href={`/shops/${shop.id}`}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                            title="Buka Toko"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteShop(shop.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-150 hover:border-red-200 rounded-xl transition-all cursor-pointer"
                            title="Hapus Toko"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* Konfigurasi Portal Tab */}
      {activeSubTab === "config" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="admin-subtab-config">
          
          {/* Config Forms */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Identitas Portal Utama</h3>
              <p className="text-xs text-slate-500">Edit data visual yang ditampilkan pada halaman depan web secara dinamis.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl flex items-center gap-2 uppercase tracking-wider animate-fade-in shadow-3xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  Branding Berhasil Diperbarui! Parameter visual disimpan di database utama.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nama Aplikasi Portal</label>
                  <input
                    type="text"
                    required
                    value={data.appName}
                    onChange={(e) => setData("appName", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-3xs"
                    id="admin-input-appname"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Wilayah Administratif Desa</label>
                  <input
                    type="text"
                    required
                    value={data.villageName}
                    onChange={(e) => setData("villageName", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-3xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Slogan / Tagline Utama</label>
                <input
                  type="text"
                  required
                  value={data.tagline}
                  onChange={(e) => setData("tagline", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-3xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Deskripsi Naratif Etalase Desa</label>
                <textarea
                  required
                  rows={4}
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all shadow-3xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">WhatsApp Kontak Bantuan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 6285725912345"
                    value={data.adminPhone}
                    onChange={(e) => setData("adminPhone", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-3xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Foto Banner Utama (Unsplash URL)</label>
                  <input
                    type="url"
                    required
                    value={data.heroBanner}
                    onChange={(e) => setData("heroBanner", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-3xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  id="admin-save-btn"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Live Mockup Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5 text-slate-400 pl-1">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Tampilan Pratinjau Halaman Depan</span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-3xs flex flex-col h-[480px]">
              
              {/* Header mockup navbar */}
              <div className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-emerald-700 rounded-lg flex items-center justify-center">
                    <Store className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-800">
                    {data.appName || "SAMIRONO ETALASE"}
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Banner mockup section */}
              <div className="relative h-44 shrink-0 bg-slate-900 overflow-hidden">
                <img
                  src={data.heroBanner}
                  alt="Live Preview Banner"
                  className="w-full h-full object-cover opacity-35"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[7px] font-extrabold uppercase tracking-wider rounded">
                      {data.villageName || "DESA SAMIRONO"}
                    </span>
                    <h4 className="text-[14px] font-extrabold tracking-tight leading-snug line-clamp-1">
                      {data.appName || "Samirono Etalase"}
                    </h4>
                    <p className="text-amber-400 font-bold text-[9px] line-clamp-1 leading-none">
                      {data.tagline || "Platform Ekonomi Warga"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description mockup body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-slate-50/30">
                <div className="space-y-1.5">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block font-mono">Tentang Etalase</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-light line-clamp-4">
                    {data.description || "Digitalisasi etalase produk warga."}
                  </p>
                </div>

                <div className="border-t border-slate-150 pt-3.5 space-y-2">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400 block font-mono">Kontak Bantuan</span>
                  <div className="flex items-center gap-2 p-2 bg-white border border-slate-150 rounded-xl">
                    <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-700 shrink-0 border border-slate-100">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 font-medium block leading-none">WhatsApp Admin</span>
                      <span className="text-[10px] font-extrabold text-emerald-800 block mt-1">+{data.adminPhone || "628..."}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom footer bar mockup */}
              <div className="bg-white border-t border-slate-100 px-4 py-2.5 text-center text-[8px] font-mono text-slate-400 uppercase tracking-widest shrink-0 font-bold">
                KAMPUNG DIGITAL DESA SAMIRONO
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. EXCEL IMPORT MODAL WITH CONFLICT RESOLUTION */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800 border border-emerald-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Import Data UMKM dari Excel</h3>
                  <p className="text-[11px] text-slate-500">Unggah file spreadsheet DATA UMKM 2026 (.xlsx) untuk ditinjau & diimpor secara otomatis.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportRows([]);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center transition-all">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="excel-file-input"
                />
                <label htmlFor="excel-file-input" className="cursor-pointer space-y-2 block">
                  <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-slate-800 block uppercase tracking-wider">
                      Klik untuk Memilih File Excel (.xlsx)
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Mendukung format DATA UMKM 2026.xlsx
                    </span>
                  </div>
                </label>
              </div>

              {isParsing && (
                <div className="py-8 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Membaca & Memproses Lembar Kerja Excel...</p>
                </div>
              )}

              {/* Preview & Conflict Review Table */}
              {!isParsing && importRows.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Hasil Peninjauan Data ({importRows.length} Baris Ditemukan)
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Sistem telah menerapkan aturan fallback (Nama Usaha diambil dari Jenis Usaha jika kosong) & mengecek potensi konflik.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-bold font-mono">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                        Baru: {importRows.filter((r) => !r.isConflict).length}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                        Konflik/Sama: {importRows.filter((r) => r.isConflict).length}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-72">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                          <TableHead className="p-3 text-[10px]">Pilih</TableHead>
                          <TableHead className="p-3 text-[10px]">Baris</TableHead>
                          <TableHead className="p-3 text-[10px]">Nama Usaha (UMKM)</TableHead>
                          <TableHead className="p-3 text-[10px]">Pemilik & Dusun</TableHead>
                          <TableHead className="p-3 text-[10px]">Kategori</TableHead>
                          <TableHead className="p-3 text-[10px]">Permit Legalitas</TableHead>
                          <TableHead className="p-3 text-[10px]">Status Konflik</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importRows.map((row, idx) => (
                          <TableRow
                            key={idx}
                            className={row.isConflict ? "bg-amber-50/30" : "hover:bg-slate-50/50"}
                          >
                            <TableCell className="p-3">
                              <input
                                type="checkbox"
                                checked={row.action === "import"}
                                onChange={() => handleToggleRowAction(idx)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                            </TableCell>

                            <TableCell className="p-3 font-mono text-[10px] text-slate-500">
                              #{row.rowNum}
                            </TableCell>

                            <TableCell className="p-3">
                              <span className="font-extrabold text-xs text-slate-900 block">{row.name}</span>
                              <span className="text-[9px] text-slate-400 block font-mono">{row.phone}</span>
                            </TableCell>

                            <TableCell className="p-3 text-xs">
                              <span className="font-bold text-slate-700 block">{row.ownerName}</span>
                              <span className="text-[9.5px] text-slate-400 font-mono block">{row.dusun}</span>
                            </TableCell>

                            <TableCell className="p-3">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[8.5px] font-bold rounded border border-slate-200">
                                {row.category}
                              </span>
                            </TableCell>

                            <TableCell className="p-3">
                              <div className="flex items-center gap-1">
                                {row.nib && <span className="px-1 py-0.5 bg-blue-50 text-blue-700 text-[7px] font-bold rounded border border-blue-200">NIB</span>}
                                {row.halal && <span className="px-1 py-0.5 bg-emerald-50 text-emerald-700 text-[7px] font-bold rounded border border-emerald-200">HALAL</span>}
                                {row.pirt && <span className="px-1 py-0.5 bg-purple-50 text-purple-700 text-[7px] font-bold rounded border border-purple-200">P-IRT</span>}
                                {!row.nib && !row.halal && !row.pirt && <span className="text-[9px] text-slate-300 italic">-</span>}
                              </div>
                            </TableCell>

                            <TableCell className="p-3">
                              {row.isConflict ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-black uppercase rounded border border-amber-200">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  <span>Update Toko Sama</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase rounded border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Baru</span>
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-150 bg-slate-50/50 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">
                {importRows.filter((r) => r.action === "import").length} item dipilih untuk disimpan
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportRows([]);
                  }}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  onClick={handleSubmitImport}
                  disabled={isSubmittingImport || importRows.filter((r) => r.action === "import").length === 0}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmittingImport ? "Menyimpan..." : "Simpan Data ke Server"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
