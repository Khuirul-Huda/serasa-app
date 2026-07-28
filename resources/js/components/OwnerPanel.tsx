/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router } from "@inertiajs/react";
import { 
  Trash2, 
  MapPin, 
  PlusCircle, 
  Store, 
  Save, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings2,
  Sparkle,
  Star,
  Search
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import LocationPickerMap from "@/components/LocationPickerMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import type { Shop, Product, Category } from "@/types";
import { formatIDR } from "@/utils";

interface OwnerPanelProps {
  myShop: Shop | undefined;
  myProducts: Product[];
  categories: Category[];
}

export default function OwnerPanel({
  myShop,
  myProducts,
  categories,
}: OwnerPanelProps) {
  // Panel state
  const [activeTab, setActiveTab] = useState<"catalog" | "shop-profile">("catalog");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Search & filter states for catalog
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState("all");

  // 1. Inertia Form for Shop Registration
  const registerForm = useForm({
    name: "",
    ownerName: "",
    description: "",
    category: categories[0]?.name || "Kuliner & Olahan",
    phone: "",
    address: "",
    dusun: "Dusun Samirono",
    lat: -7.3822,
    lng: 110.4287,
    jamKerja: "08:00 - 17:00",
    logo: null as File | null,
    image: null as File | null,
  });

  // 2. Inertia Form for Shop Profiling
  const editShopForm = useForm({
    description: myShop?.description || "",
    phone: myShop?.phone || "",
    address: myShop?.address || "",
    dusun: myShop?.dusun || "Dusun Samirono",
    lat: myShop?.lat || -7.3822,
    lng: myShop?.lng || 110.4287,
    jamKerja: myShop?.jamKerja || "08:00 - 17:00",
    logo: null as File | null,
    image: null as File | null,
    _method: "PUT", // Spoof PUT request for file upload
  });

  // 3. Inertia Form for Product Registration
  const addProductForm = useForm({
    name: "",
    description: "",
    price: "",
    unit: "Pcs",
    categoryId: categories[0]?.id || "",
    image: null as File | null,
  });

  // Filtered products list memo
  const filteredProducts = useMemo(() => {
    return myProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchCatalogQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchCatalogQuery.toLowerCase()));
      
      const matchesCategory = selectedCatalogCategory === "all" || p.categoryId === selectedCatalogCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [myProducts, searchCatalogQuery, selectedCatalogCategory]);

  // Sync edits when shop changes
  useEffect(() => {
    if (myShop) {
      editShopForm.setData({
        description: myShop.description || "",
        phone: myShop.phone || "",
        address: myShop.address || "",
        dusun: myShop.dusun || "Dusun Samirono",
        lat: myShop.lat || -7.3822,
        lng: myShop.lng || 110.4287,
        jamKerja: myShop.jamKerja || "08:00 - 17:00",
        logo: null,
        image: null,
        _method: "PUT",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myShop, activeTab]);

  // Handle Shop Registration Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerForm.post("/merchant/shop", {
      forceFormData: true,
    });
  };

  // Handle Shop Edit Form Submit (Spoofing POST as PUT for file upload support)
  const handleEditShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editShopForm.post("/merchant/shop", {
      forceFormData: true,
      onSuccess: () => {
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 3000);
      }
    });
  };

  // Handle Product Addition Form Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductForm.post("/merchant/products", {
      forceFormData: true,
      onSuccess: () => {
        addProductForm.reset();
        setIsAddingProduct(false);
      }
    });
  };

  const handleToggleProductAvailable = (productId: string) => {
    router.put(`/merchant/products/${productId}/toggle`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Hapus produk ini dari katalog etalase Anda?")) {
      router.delete(`/merchant/products/${productId}`);
    }
  };

  // Onboarding Registration Panel View (If shop does not exist)
  if (!myShop) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in font-sans text-slate-800" id="owner-onboarding">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Informational Column */}
          <div className="lg:col-span-5 bg-emerald-50/40 border-r border-slate-200 p-8 flex flex-col justify-between space-y-8 relative">
            <div className="space-y-6 relative z-10">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 border border-emerald-200">
                <Store className="w-6 h-6" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">
                  Mulai Digitalisasi <br />
                  <span className="text-emerald-700">Toko Usaha Anda</span>
                </h2>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Gabung di portal <strong className="font-bold text-slate-800">SAMIRONO ETALASE</strong>. Hadirkan etalase digital terpusat untuk memperkenalkan komoditas pangan, olahan, kriya, maupun jasa Anda secara modern.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 text-[11px] text-slate-600 font-light shadow-3xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pemetaan Geografis Akurat</strong>: Geser pin penunjuk lokasi peta ke titik rumah produksi Anda, agar pembeli dapat dinavigasikan dengan benar.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-[9px] text-emerald-700 font-bold uppercase tracking-widest relative z-10 flex items-center gap-2 font-mono">
              <Sparkle className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 animate-pulse" />
              <span>Registrasi UMKM Desa Gratis</span>
            </div>
          </div>

          {/* Registration Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">Formulir Profil Usaha Warga</h3>
              <p className="text-xs text-slate-500 mt-0.5">Lengkapi rincian berikut untuk meluncurkan etalase toko digital Anda.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Nama Toko / UMKM</Label>
                  <Input
                    type="text"
                    required
                    placeholder="Contoh: Susu Murni Bentar"
                    value={registerForm.data.name}
                    onChange={(e) => registerForm.setData("name", e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Nama Pemilik</Label>
                  <Input
                    type="text"
                    required
                    placeholder="Contoh: Bapak Haryono"
                    value={registerForm.data.ownerName}
                    onChange={(e) => registerForm.setData("ownerName", e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Nomor WhatsApp Toko</Label>
                  <Input
                    type="tel"
                    required
                    placeholder="Contoh: 6285725900000"
                    value={registerForm.data.phone}
                    onChange={(e) => registerForm.setData("phone", e.target.value)}
                    className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Wilayah Dusun</label>
                  <select
                    value={registerForm.data.dusun}
                    onChange={(e) => registerForm.setData("dusun", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-250 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs"
                  >
                    <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
                    <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
                    <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
                    <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Jam Kerja Operasional</Label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 z-10" />
                    <Input
                      type="text"
                      required
                      placeholder="Contoh: 08:00 - 17:00"
                      value={registerForm.data.jamKerja}
                      onChange={(e) => registerForm.setData("jamKerja", e.target.value)}
                      className="rounded-xl pl-9 border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Fokus Sektor Usaha</Label>
                  <select
                    value={registerForm.data.category}
                    onChange={(e) => registerForm.setData("category", e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Alamat Detail Produksi</Label>
                <Input
                  type="text"
                  required
                  placeholder="Contoh: RT 02 / RW 04, Dusun Bentar"
                  value={registerForm.data.address}
                  onChange={(e) => registerForm.setData("address", e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                />
              </div>

              {/* Map Position Picker Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Pin Peta Koordinat Lokasi</span>
                </span>
                <LocationPickerMap
                  lat={registerForm.data.lat}
                  lng={registerForm.data.lng}
                  onChange={(lat, lng) => registerForm.setData(prev => ({ ...prev, lat, lng }))}
                />
                
                <div className="flex gap-4 text-[9.5px] font-mono text-gray-500 bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs">
                  <div>Latitude: <span className="font-bold text-emerald-700">{registerForm.data.lat}</span></div>
                  <div>Longitude: <span className="font-bold text-emerald-700">{registerForm.data.lng}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Logo Toko (Opsional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => registerForm.setData("logo", e.target.files?.[0] || null)}
                    className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 cursor-pointer text-slate-500 text-[10px] py-1 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Banner Foto Toko (Opsional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => registerForm.setData("image", e.target.files?.[0] || null)}
                    className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 cursor-pointer text-slate-500 text-[10px] py-1 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Deskripsi Singkat Toko</Label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan singkat mengenai keunikan produk lokal buatan rumah produksi Anda..."
                  value={registerForm.data.description}
                  onChange={(e) => registerForm.setData("description", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all shadow-3xs"
                />
              </div>

              <Button
                type="submit"
                disabled={registerForm.processing}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <Store className="w-4 h-4 text-white" />
                <span>{registerForm.processing ? "Mendaftarkan Toko..." : "Daftarkan Toko Saya Sekarang"}</span>
              </Button>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // Dashboard Workspace Panel View
  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8 animate-fade-in font-sans text-slate-800" id="owner-workspace">
      
      {/* 1. Vercel-Style Premium Header Section */}
      <div className="bg-white border-b border-slate-200/80 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-3xs shrink-0 p-0.5">
              <img
                src={myShop.logo}
                alt={myShop.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none">{myShop.name}</h2>
                {myShop.isVerified ? (
                  <Badge variant="outline" className="bg-emerald-50 border-emerald-100 text-emerald-800 font-black uppercase text-[8px] tracking-wider py-0.5 px-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-50 animate-pulse" />
                    <span>Terverifikasi</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 border-amber-100 text-amber-800 font-black uppercase text-[8px] tracking-wider py-0.5 px-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dalam Review</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Pemilik: <span className="font-bold text-slate-700">{myShop.ownerName}</span> | Dusun: <span className="font-bold text-slate-700">{myShop.dusun}</span> | Jam Operasional: <span className="font-bold text-slate-700">{myShop.jamKerja || "-"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Vercel-Style Flat Underlined Tab Switcher */}
        <div className="flex space-x-6 border-b border-slate-200 pt-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("catalog");
              setIsAddingProduct(false);
            }}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Etalase Produk ({myProducts.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("shop-profile");
              setIsAddingProduct(false);
            }}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "shop-profile"
                ? "border-emerald-600 text-emerald-800"
                : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Profil Toko
          </button>
        </div>
      </div>

      {/* Profile Editing Panel */}
      {activeTab === "shop-profile" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs max-w-3xl mx-auto space-y-6 animate-fade-in" id="owner-edit-shop">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 uppercase tracking-wider">
              <Settings2 className="w-5 h-5 text-emerald-600" />
              <span>Konfigurasi Operasional Toko</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Ubah rincian kontak bantuan, alamat rumah produksi, dan penunjuk pin pada peta desa.</p>
          </div>

          <form onSubmit={handleEditShopSubmit} className="space-y-5 text-xs">
            {editSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center gap-2 animate-fade-in uppercase tracking-wider text-[10px] shadow-3xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                Data Profil Toko Anda Berhasil Diperbarui!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">No. WhatsApp Pembeli</Label>
                <Input
                  type="text"
                  required
                  value={editShopForm.data.phone}
                  onChange={(e) => editShopForm.setData("phone", e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Jam Operasional Toko</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 z-10" />
                  <Input
                    type="text"
                    required
                    value={editShopForm.data.jamKerja}
                    onChange={(e) => editShopForm.setData("jamKerja", e.target.value)}
                    className="rounded-xl pl-9 border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Dusun Produksi</Label>
                <select
                  value={editShopForm.data.dusun}
                  onChange={(e) => editShopForm.setData("dusun", e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs"
                >
                  <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
                  <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
                  <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
                  <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Alamat Rumah Produksi</Label>
              <Input
                type="text"
                required
                value={editShopForm.data.address}
                onChange={(e) => editShopForm.setData("address", e.target.value)}
                className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
              />
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">Ubah Koordinat Peta Desa</span>
              </span>
              <LocationPickerMap
                lat={editShopForm.data.lat}
                lng={editShopForm.data.lng}
                onChange={(lat, lng) => editShopForm.setData(prev => ({ ...prev, lat, lng }))}
              />
              
              <div className="flex gap-4 text-[9.5px] font-mono text-gray-500 bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs">
                <div>Latitude: <span className="font-bold text-emerald-700">{editShopForm.data.lat}</span></div>
                <div>Longitude: <span className="font-bold text-emerald-700">{editShopForm.data.lng}</span></div>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Uraian Toko (Deskripsi)</Label>
              <textarea
                rows={4}
                value={editShopForm.data.description}
                onChange={(e) => editShopForm.setData("description", e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all shadow-3xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Ganti Logo Toko (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => editShopForm.setData("logo", e.target.files?.[0] || null)}
                  className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 cursor-pointer text-slate-500 text-[10px] py-1 bg-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-bold text-slate-400 uppercase tracking-wider block text-[9px]">Ganti Banner Foto Toko (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => editShopForm.setData("image", e.target.files?.[0] || null)}
                  className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 cursor-pointer text-slate-500 text-[10px] py-1 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                type="submit"
                disabled={editShopForm.processing}
                className="px-6 h-10 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{editShopForm.processing ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog Management Panel */}
      {activeTab === "catalog" && (
        <div className="space-y-6 animate-fade-in" id="owner-edit-catalog">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-5 rounded-3xl shadow-3xs gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-wider">Katalog Produk Kreatif Toko</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tambahkan produk baru, atur ketersediaan stok produk warga secara instan.</p>
            </div>

            <Button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-5 h-9 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-3xs hover:shadow-xs flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{isAddingProduct ? "Batal Tambah" : "Tambah Produk Baru"}</span>
            </Button>
          </div>

          {/* Add Product Block */}
          {isAddingProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="owner-add-product-form">
              
              {/* Product Form */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-3xl shadow-3xs space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Rincian Produk Baru</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Lengkapi parameters berikut untuk menampilkan produk di etalase utama.</p>
                </div>

                <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Nama Produk</Label>
                      <Input
                        type="text"
                        required
                        placeholder="Contoh: Susu Stroberi Segar"
                        value={addProductForm.data.name}
                        onChange={(e) => addProductForm.setData("name", e.target.value)}
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Kategori Komoditas</Label>
                      <select
                        value={addProductForm.data.categoryId}
                        onChange={(e) => addProductForm.setData("categoryId", e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Harga Jual (Rupiah)</Label>
                      <Input
                        type="number"
                        required
                        placeholder="Contoh: 15000"
                        value={addProductForm.data.price}
                        onChange={(e) => addProductForm.setData("price", e.target.value)}
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Satuan Takaran</Label>
                      <Input
                        type="text"
                        required
                        placeholder="Pcs, Liter, Kg, Botol"
                        value={addProductForm.data.unit}
                        onChange={(e) => addProductForm.setData("unit", e.target.value)}
                        className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Foto Produk (File Upload)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => addProductForm.setData("image", e.target.files?.[0] || null)}
                      className="rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 cursor-pointer text-slate-500 text-[10px] py-1 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="font-bold text-slate-400 uppercase tracking-wider text-[9px] block">Deskripsi Uraian Produk</Label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan spesifikasi keunikan rasa susu, bahan baku bambu anyaman, atau cita rasa produk kuliner Anda..."
                      value={addProductForm.data.description}
                      onChange={(e) => addProductForm.setData("description", e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all shadow-3xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingProduct(false)}
                      className="rounded-xl h-9 text-slate-500"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={addProductForm.processing}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-9 font-extrabold uppercase tracking-wider shadow-3xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      {addProductForm.processing ? "Menyimpan..." : "Luncurkan Produk"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Live Preview Card Widget */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-1.5 text-slate-400 pl-1">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Pratinjau Produk (Preview)</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-3xs flex flex-col items-center p-6 justify-center min-h-[380px]">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-3xs max-w-[200px] w-full flex flex-col">
                    <div className="aspect-square w-full bg-slate-50 overflow-hidden shrink-0 relative">
                      <img
                        src={addProductForm.data.image ? (typeof addProductForm.data.image === 'string' ? addProductForm.data.image : URL.createObjectURL(addProductForm.data.image)) : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"}
                        alt="Product Live Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[8px] font-bold text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        {categories.find((c) => c.id === addProductForm.data.categoryId)?.name || "KULINER"}
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between gap-2.5 text-slate-800">
                      <div className="space-y-1">
                        <span className="block text-[11px] font-bold text-slate-800 line-clamp-1 leading-snug">
                          {addProductForm.data.name || "Nama Produk Baru"}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[9px] text-slate-400">
                          <div className="flex items-center text-amber-400 shrink-0">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </div>
                          <span>5.0 (0 Ulasan)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 shrink-0">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 leading-none">
                            {formatIDR(Number(addProductForm.data.price) || 0)}
                          </span>
                          <span className="text-[8px] text-slate-400 font-medium">/ {addProductForm.data.unit || "Pcs"}</span>
                        </div>

                        <div className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[8px] uppercase tracking-wider rounded-lg">
                          Beli
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Product Search & Filter controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari produk Anda..."
                value={searchCatalogQuery}
                onChange={(e) => setSearchCatalogQuery(e.target.value)}
                className="pl-9 rounded-xl border-slate-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 bg-white"
              />
            </div>
            <select
              value={selectedCatalogCategory}
              onChange={(e) => setSelectedCatalogCategory(e.target.value)}
              className="px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-3xs"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product List Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-b border-slate-150 hover:bg-slate-50/50">
                    <TableHead className="p-4">Nama Produk Kreatif</TableHead>
                    <TableHead className="p-4">Harga Terdaftar</TableHead>
                    <TableHead className="p-4">Sektor Komoditas</TableHead>
                    <TableHead className="p-4">Status Ketersediaan</TableHead>
                    <TableHead className="p-4 text-center">Opsi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-slate-400 italic">
                        Tidak ada produk dalam katalog Anda yang cocok dengan filter pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((prod: Product) => {
                      const productCat = categories.find((c) => c.id === prod.categoryId);

                      return (
                        <TableRow key={prod.id}>
                          
                          <TableCell className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-0.5">
                                <span className="block text-xs text-slate-900 font-bold">{prod.name}</span>
                                <div className="flex items-center gap-1 text-[9.5px] text-slate-400 font-medium leading-none">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                                  <span>{prod.rating.toFixed(1)} ({prod.reviewsCount} Ulasan)</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="p-4 font-bold text-slate-800 text-sm font-mono">
                            {formatIDR(prod.price)} <span className="text-[10px] font-normal text-slate-400">/ {prod.unit}</span>
                          </TableCell>

                          <TableCell className="p-4">
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 font-bold text-[8px] uppercase tracking-wider">
                              {productCat?.name || "Kategori"}
                            </span>
                          </TableCell>

                          <TableCell className="p-4">
                            {prod.isAvailable ? (
                              <button
                                onClick={() => handleToggleProductAvailable(prod.id)}
                                className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-2.5 py-1 rounded-lg font-black text-[8px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                <span>Tersedia</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleProductAvailable(prod.id)}
                                className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg font-black text-[8px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span>Habis</span>
                              </button>
                            )}
                          </TableCell>

                          <TableCell className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-150 hover:border-red-200 rounded-xl transition-all cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TableCell>

                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
