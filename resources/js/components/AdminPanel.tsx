/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { 
  BarChart3, 
  CheckCircle2, 
  Trash2, 
  Save, 
  Store, 
  Sparkles,
  Layout,
  AlertCircle,
  Award,
  Package,
  Activity,
  UserCheck
} from "lucide-react";
import { AppSettings, Shop, Product, Category } from "@/types";

interface AdminPanelProps {
  settings: AppSettings;
  shops: Shop[];
  products: Product[];
  categories: Category[];
}

export default function AdminPanel({
  settings,
  shops,
  products,
  categories,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "shops" | "config">("stats");
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    return { name: cat.name, count, color: cat.color };
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="serasa-admin-panel">
      
      {/* Panel Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[9px] font-extrabold uppercase rounded-md border border-emerald-100 tracking-wider">
              Pemerintah Desa
            </span>
            <span className="inline-flex items-center gap-1 text-amber-600 font-mono text-[9px] uppercase tracking-widest font-extrabold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <UserCheck className="w-3 h-3" />
              <span>Admin Panel</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-2">
            Sistem Informasi & Digitalisasi UMKM Samirono
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Kelola identitas etalase desa, verifikasi legalitas pelaku usaha warga, dan pantau perkembangan ekonomi lokal.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200 w-full lg:w-auto">
          <button
            onClick={() => setActiveSubTab("stats")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSubTab === "stats"
                ? "bg-white text-emerald-700 shadow-3xs border border-gray-200"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dasbor Statistik</span>
          </button>
          <button
            onClick={() => setActiveSubTab("shops")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSubTab === "shops"
                ? "bg-white text-emerald-700 shadow-3xs border border-gray-200"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Verifikasi Toko ({pendingShops})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("config")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeSubTab === "config"
                ? "bg-white text-emerald-700 shadow-3xs border border-gray-200"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Konfigurasi Portal</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeSubTab === "stats" && (
        <div className="space-y-6 animate-fade-in" id="admin-subtab-stats">
          {/* Key Metrics Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total UMKM Samirono</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalShops}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Usaha</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Store className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Terverifikasi Desa</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-bold text-emerald-600 tracking-tight">{verifiedShops}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">dari {totalShops}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Katalog Produk Aktif</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalProducts}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Item</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Package className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status Sinkronisasi</span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-xl font-bold text-emerald-700 tracking-tight">STABIL</span>
                  <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Aktif</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Activity className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          {/* Visual Sector Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-gray-200 p-6 rounded-2xl shadow-3xs space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 tracking-tight">Sebaran Produk Berdasarkan Sektor Kreatif</h3>
                <p className="text-xs text-gray-500 mt-0.5">Menganalisis diversifikasi jenis produk yang diproduksi warga.</p>
              </div>

              <div className="space-y-4 pt-2">
                {categoryDistribution.map((item) => {
                  const maxCount = Math.max(...categoryDistribution.map((c) => c.count), 1);
                  const percentage = (item.count / maxCount) * 100;
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">{item.name}</span>
                        <span className="font-mono text-[9.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/70 px-2 py-0.5 rounded">
                          {item.count} Produk
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/40">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-emerald-950 text-white p-6 rounded-2xl shadow-3xs space-y-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-slate-950/90 z-0" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Digitalisasi Ekonomi Samirono</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Portal <strong className="font-bold text-white">SAMIRONO ETALASE</strong> didesain untuk menyatukan seluruh pelaku UMKM dalam satu portal interaktif yang modern.
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Sebagai admin desa, Anda bertanggung jawab dalam memverifikasi keaslian dan legalitas toko baru, mengontrol branding utama portal, serta memantau statistik sebaran produk kreatif Samirono secara real-time.
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-emerald-400 relative z-10">
                <span>Samirono Digital Portal</span>
                <span>v1.0 (Stabil)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Manager Tab */}
      {activeSubTab === "shops" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-3xs p-6 space-y-4 animate-fade-in" id="admin-subtab-verification">
          <div>
            <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide">Persetujuan & Manajemen UMKM Desa</h3>
            <p className="text-xs text-gray-500 mt-0.5">Validasi toko digital milik warga desa sebelum ditampilkan di daftar utama dengan lencana verifikasi.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold tracking-wider text-[10px] uppercase">
                  <th className="p-4">Nama Toko UMKM</th>
                  <th className="p-4">Pemilik & Kontak</th>
                  <th className="p-4">Lokasi Dusun</th>
                  <th className="p-4">Kategori Utama</th>
                  <th className="p-4">Status Legalitas</th>
                  <th className="p-4 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shops.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400 italic">
                      Belum ada toko yang terdaftar di dalam sistem.
                    </td>
                  </tr>
                ) : (
                  shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-emerald-50/10 transition-colors">
                      <td className="p-4 font-bold text-gray-800">
                        <div className="flex items-center gap-3">
                          <img
                            src={shop.logo}
                            alt={shop.name}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 shadow-3xs shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="block text-xs font-bold text-gray-900">{shop.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{shop.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="block font-bold text-gray-700">{shop.ownerName}</span>
                        <a 
                          href={`https://wa.me/${shop.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-600 hover:underline font-bold"
                        >
                          +{shop.phone}
                        </a>
                      </td>
                      <td className="p-4 font-bold text-gray-600 uppercase tracking-wider text-[9px]">{shop.dusun}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 font-bold text-[8px] uppercase tracking-wider">
                          {shop.category}
                        </span>
                      </td>
                      <td className="p-4">
                        {shop.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md font-extrabold text-[8px] uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-50" />
                            <span>Terverifikasi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-md font-extrabold text-[8px] uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVerifyShop(shop.id)}
                            className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all text-[8px] cursor-pointer ${
                              shop.isVerified
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs hover:shadow-md"
                            }`}
                          >
                            {shop.isVerified ? "Cabut Verifikasi" : "Verifikasi Toko"}
                          </button>
                          <button
                            onClick={() => handleDeleteShop(shop.id)}
                            className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all cursor-pointer"
                            title="Hapus Toko"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Portal Configurations */}
      {activeSubTab === "config" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-3xs p-6 space-y-6 animate-fade-in" id="admin-subtab-config">
          <div>
            <h3 className="font-bold text-lg text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2.5">
              Konfigurasi Identitas Portal Digital
            </h3>
            <p className="text-xs text-gray-500 mt-1.5">Edit nama aplikasi, tagline, dan deskripsi wilayah Samirono secara dinamis. Hasil perubahan langsung ter-update di seluruh website.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {saveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold rounded-xl flex items-center gap-2 uppercase tracking-wider animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                Sistem Berhasil Diperbarui! Nama aplikasi dan parameter visual disimpan di database utama.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Nama Aplikasi Portal</label>
                <input
                  type="text"
                  required
                  value={data.appName}
                  onChange={(e) => setData("appName", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  id="admin-input-appname"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Wilayah Administratif Desa</label>
                <input
                  type="text"
                  required
                  value={data.villageName}
                  onChange={(e) => setData("villageName", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Slogan / Tagline Utama</label>
              <input
                type="text"
                required
                value={data.tagline}
                onChange={(e) => setData("tagline", e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Naratif Etalase Desa</label>
              <textarea
                required
                rows={4}
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">WhatsApp Kontak Bantuan Desa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 6285725912345"
                  value={data.adminPhone}
                  onChange={(e) => setData("adminPhone", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Foto Banner Utama (Unsplash URL)</label>
                <input
                  type="url"
                  required
                  value={data.heroBanner}
                  onChange={(e) => setData("heroBanner", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                id="admin-save-btn"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
