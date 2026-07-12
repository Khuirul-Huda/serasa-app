/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { 
  Trash2, 
  MapPin, 
  PlusCircle, 
  Store, 
  ShoppingBag, 
  Save, 
  Sparkles,
  Clock,
  CheckCircle2,
  Sparkle
} from "lucide-react";
import { Shop, Product, Category } from "@/types";
import { formatIDR } from "@/utils";
import { useForm, router } from "@inertiajs/react";

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
  });

  // 3. Inertia Form for Product Registration
  const addProductForm = useForm({
    name: "",
    description: "",
    price: "",
    unit: "Pcs",
    categoryId: categories[0]?.id || "",
    image: "",
  });

  // Leaflet Map Refs
  const regMapContainerRef = useRef<HTMLDivElement | null>(null);
  const regMapInstanceRef = useRef<L.Map | null>(null);
  const regMarkerRef = useRef<L.Marker | null>(null);

  const editMapContainerRef = useRef<HTMLDivElement | null>(null);
  const editMapInstanceRef = useRef<L.Map | null>(null);
  const editMarkerRef = useRef<L.Marker | null>(null);

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
      });

      if (editMapInstanceRef.current && editMarkerRef.current) {
        const lat = myShop.lat || -7.3822;
        const lng = myShop.lng || 110.4287;
        editMarkerRef.current.setLatLng([lat, lng]);
        editMapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  }, [myShop, activeTab]);

  // Leaflet Map Picker for REGISTER Form
  useEffect(() => {
    if (myShop || !regMapContainerRef.current) return;

    if (!regMapInstanceRef.current) {
      const map = L.map(regMapContainerRef.current, {
        center: [-7.3822, 110.4287],
        zoom: 15,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);

      const marker = L.marker([-7.3822, 110.4287], {
        draggable: true,
        icon: L.divIcon({
          html: `
            <div class="flex flex-col items-center justify-center relative select-none">
              <div class="absolute w-8 h-8 rounded-full animate-ping bg-emerald-500 opacity-30"></div>
              <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-white bg-emerald-600 shadow-md border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-white"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          `,
          className: 'custom-picker-leaflet-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
      }).addTo(map);

      marker.on('dragend', () => {
        const latLng = marker.getLatLng();
        registerForm.setData(prev => ({
          ...prev,
          lat: Number(latLng.lat.toFixed(6)),
          lng: Number(latLng.lng.toFixed(6))
        }));
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        registerForm.setData(prev => ({
          ...prev,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6))
        }));
      });

      regMapInstanceRef.current = map;
      regMarkerRef.current = marker;
    }

    return () => {
      if (regMapInstanceRef.current) {
        regMapInstanceRef.current.remove();
        regMapInstanceRef.current = null;
        regMarkerRef.current = null;
      }
    };
  }, [myShop]);

  // Leaflet Map Picker for EDIT Form
  useEffect(() => {
    if (!myShop || !editMapContainerRef.current) return;

    if (!editMapInstanceRef.current) {
      const initialLat = myShop.lat || -7.3822;
      const initialLng = myShop.lng || 110.4287;

      const map = L.map(editMapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20
      }).addTo(map);

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: L.divIcon({
          html: `
            <div class="flex flex-col items-center justify-center relative select-none">
              <div class="absolute w-8 h-8 rounded-full animate-ping bg-emerald-500 opacity-30"></div>
              <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-white bg-emerald-600 shadow-md border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-white"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          `,
          className: 'custom-picker-leaflet-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
      }).addTo(map);

      marker.on('dragend', () => {
        const latLng = marker.getLatLng();
        editShopForm.setData(prev => ({
          ...prev,
          lat: Number(latLng.lat.toFixed(6)),
          lng: Number(latLng.lng.toFixed(6))
        }));
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        editShopForm.setData(prev => ({
          ...prev,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6))
        }));
      });

      editMapInstanceRef.current = map;
      editMarkerRef.current = marker;
    }

    return () => {
      if (editMapInstanceRef.current) {
        editMapInstanceRef.current.remove();
        editMapInstanceRef.current = null;
        editMarkerRef.current = null;
      }
    };
  }, [myShop, activeTab]);

  // Handle Shop Registration Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerForm.post("/merchant/shop");
  };

  // Handle Shop Edit Form Submit
  const handleEditShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editShopForm.put("/merchant/shop", {
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

  // Onboarding Registration Panel View
  if (!myShop) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="owner-onboarding">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          <div className="md:col-span-5 bg-emerald-950 text-white p-8 flex flex-col justify-between space-y-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-slate-950/80 z-0" />
            
            <div className="space-y-5 relative z-10">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xs">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight leading-snug">Mulai Digitalisasi Usaha Anda!</h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Daftarkan UMKM Anda secara gratis di platform <strong className="font-extrabold text-white">SAMIRONO ETALASE</strong>. Dapatkan etalase digital terpusat yang memudahkan wisatawan, pembeli luar desa, maupun dinas pariwisata menemukan katalog Anda.
              </p>
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-2 text-[11px] text-gray-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Atur <strong className="text-white">Posisi Akurat Usaha Anda</strong> secara geografis pada peta Samirono menggunakan pin geser, agar pembeli mudah menemukan lokasi rumah produksi Anda.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-[10px] text-emerald-400 font-bold uppercase tracking-wider relative z-10 flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-amber-400" />
              <span>Katalog instan yang bisa Anda edit sendiri</span>
            </div>
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
            <div>
              <h3 className="font-bold text-gray-900 text-xl tracking-tight">Pendaftaran Toko Kreatif Desa</h3>
              <p className="text-xs text-gray-500 mt-0.5">Gabung bersama pelaku UMKM unggulan Desa Samirono.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Nama Toko / Usaha</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Susu Segar Samirono"
                    value={registerForm.data.name}
                    onChange={(e) => registerForm.setData("name", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Nama Lengkap Pemilik</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bapak Mulyono"
                    value={registerForm.data.ownerName}
                    onChange={(e) => registerForm.setData("ownerName", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">No. WhatsApp Toko</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 628571234567"
                    value={registerForm.data.phone}
                    onChange={(e) => registerForm.setData("phone", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Dusun Tempat Usaha</label>
                  <select
                    value={registerForm.data.dusun}
                    onChange={(e) => registerForm.setData("dusun", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
                    <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
                    <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
                    <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Jam Kerja / Operasional</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 08:00 - 17:00"
                      value={registerForm.data.jamKerja}
                      onChange={(e) => registerForm.setData("jamKerja", e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Kategori Fokus Usaha</label>
                  <select
                    value={registerForm.data.category}
                    onChange={(e) => registerForm.setData("category", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Alamat Lengkap Rumah Produksi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rt 01 / Rw 02, Dusun Bentar"
                  value={registerForm.data.address}
                  onChange={(e) => registerForm.setData("address", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                />
              </div>

              {/* Leaflet Map Picker */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                <span className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm tracking-tight text-gray-800">Tentukan Koordinat Lokasi Peta Desa</span>
                </span>
                
                <div ref={regMapContainerRef} className="w-full h-48 rounded-xl border border-gray-200 overflow-hidden shadow-3xs z-0" style={{ minHeight: "180px" }} />
                
                <div className="flex gap-4 text-[10px] font-mono text-gray-500 bg-white p-2.5 rounded-lg border border-gray-200">
                  <div>Latitude: <span className="font-bold text-emerald-700">{registerForm.data.lat}</span></div>
                  <div>Longitude: <span className="font-bold text-emerald-700">{registerForm.data.lng}</span></div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider block text-[9px]">Uraian Singkat Toko (Deskripsi)</label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan sejarah singkat produk Anda atau dedikasi toko Anda..."
                  value={registerForm.data.description}
                  onChange={(e) => registerForm.setData("description", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={registerForm.processing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Store className="w-4 h-4 text-white" />
                <span>{registerForm.processing ? "Mendaftarkan..." : "Daftarkan Toko Sekarang (Selesai)"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Workspace Panel View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="owner-workspace">
      
      {/* Upper Shop Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-3xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shadow-3xs shrink-0">
            <img
              src={myShop.logo}
              alt={myShop.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{myShop.name}</h2>
              {myShop.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800 text-[8px] font-extrabold tracking-wider uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                  <span>Terverifikasi</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-amber-800 text-[8px] font-extrabold tracking-wider uppercase">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Menunggu Verifikasi</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Pemilik: <span className="text-gray-800 font-semibold">{myShop.ownerName}</span> | Dusun: <span className="font-semibold">{myShop.dusun}</span> | Jam Kerja: <span className="font-semibold">{myShop.jamKerja || "-"}</span>
            </p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "bg-white text-emerald-700 shadow-3xs border border-gray-200"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Katalog ({myProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("shop-profile")}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "shop-profile"
                ? "bg-white text-emerald-700 shadow-3xs border border-gray-200"
                : "text-gray-500 hover:text-emerald-600"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Edit Profil Toko</span>
          </button>
        </div>
      </div>

      {/* Profile Editing Tab */}
      {activeTab === "shop-profile" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-3xs max-w-3xl mx-auto space-y-6 animate-fade-in" id="owner-edit-shop">
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-1.5 uppercase tracking-wide border-b border-gray-100 pb-2.5">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Pengaturan & Lokasi Geografis</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1.5">Ubah alamat produksi, nomor HP pelayanan, jam kerja, dan letak pin koordinat peta Samirono.</p>
          </div>

          <form onSubmit={handleEditShopSubmit} className="space-y-4 text-xs">
            {editSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center gap-2 animate-fade-in uppercase tracking-wider text-[10px]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                Profil Toko Anda Berhasil Diperbarui!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">WhatsApp Pelayanan</label>
                <input
                  type="text"
                  required
                  value={editShopForm.data.phone}
                  onChange={(e) => editShopForm.setData("phone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Jam Kerja / Operasional</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="text"
                    required
                    value={editShopForm.data.jamKerja}
                    onChange={(e) => editShopForm.setData("jamKerja", e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Dusun Produksi</label>
                <select
                  value={editShopForm.data.dusun}
                  onChange={(e) => editShopForm.setData("dusun", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold uppercase tracking-wider cursor-pointer"
                >
                  <option value="Dusun Samirono">Dusun Samirono (Pusat)</option>
                  <option value="Dusun Bentar">Dusun Bentar (Susu)</option>
                  <option value="Dusun Surowono">Dusun Surowono (Pertanian)</option>
                  <option value="Dusun Tawang">Dusun Tawang (Kuliner)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Alamat Lengkap</label>
              <input
                type="text"
                required
                value={editShopForm.data.address}
                onChange={(e) => editShopForm.setData("address", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium transition-all"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-gray-800">Titik Geografis di Peta Desa</span>
              </span>
              
              <div ref={editMapContainerRef} className="w-full h-48 rounded-xl border border-gray-200 overflow-hidden shadow-3xs z-0" style={{ minHeight: "180px" }} />
              
              <div className="flex gap-4 text-[10px] font-mono text-gray-500 bg-white p-2.5 rounded-lg border border-gray-200">
                <div>Latitude: <span className="font-bold text-emerald-700">{editShopForm.data.lat}</span></div>
                <div>Longitude: <span className="font-bold text-emerald-700">{editShopForm.data.lng}</span></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Uraian/Deskripsi Toko</label>
              <textarea
                rows={4}
                value={editShopForm.data.description}
                onChange={(e) => editShopForm.setData("description", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={editShopForm.processing}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-white" />
                <span>{editShopForm.processing ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog Listings Tab */}
      {activeTab === "catalog" && (
        <div className="space-y-6 animate-fade-in" id="owner-edit-catalog">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 p-5 rounded-2xl shadow-3xs gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-base uppercase tracking-wide">Daftar Produk Kreatif Anda</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tambahkan produk baru, ubah ketersediaan stok, atau hapus item katalog.</p>
            </div>

            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          {isAddingProduct && (
            <div className="bg-emerald-50/20 rounded-2xl border border-emerald-100 p-6 space-y-4 animate-fade-in" id="owner-add-product-form">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">Tambahkan Produk Ekonomi Kreatif Baru</h4>
                <p className="text-[11px] text-gray-500">Isi lengkap rincian produk agar mudah dipromosikan ke calon pelanggan.</p>
              </div>

              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Nama Produk Kreatif</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Keju Ricotta Lokal 200gr"
                      value={addProductForm.data.name}
                      onChange={(e) => addProductForm.setData("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Kategori Produk</label>
                    <select
                      value={addProductForm.data.categoryId}
                      onChange={(e) => addProductForm.setData("categoryId", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Harga Jual (Rupiah)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 25000"
                      value={addProductForm.data.price}
                      onChange={(e) => addProductForm.setData("price", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Satuan Takaran Jual</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pcs, Liter, Kg, Box"
                      value={addProductForm.data.unit}
                      onChange={(e) => addProductForm.setData("unit", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">URL Foto Produk</label>
                  <input
                    type="url"
                    placeholder="Contoh: https://images.unsplash.com/... (Jika dikosongkan, sistem memilih gambar relevan)"
                    value={addProductForm.data.image}
                    onChange={(e) => addProductForm.setData("image", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-500 uppercase tracking-wider text-[9px] block">Deskripsi Produk (Uraian)</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan spesifikasi produk, kelebihan, bahan dasar..."
                    value={addProductForm.data.description}
                    onChange={(e) => addProductForm.setData("description", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={addProductForm.processing}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-3xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {addProductForm.processing ? "Menyimpan..." : "Simpan Produk"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product List Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-3xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold tracking-wider text-[10px] uppercase">
                    <th className="p-4">Nama Produk</th>
                    <th className="p-4">Harga Terdaftar</th>
                    <th className="p-4">Kategori Sektor</th>
                    <th className="p-4">Status Ketersediaan</th>
                    <th className="p-4 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-gray-400 italic">
                        Katalog Anda masih kosong. Silakan klik "Tambah Produk Baru" untuk meluncurkan produk pertama Anda!
                      </td>
                    </tr>
                  ) : (
                    myProducts.map((prod) => {
                      const productCat = categories.find((c) => c.id === prod.categoryId);
                      return (
                        <tr key={prod.id} className="hover:bg-emerald-50/10 transition-colors">
                          <td className="p-4 font-bold text-gray-800">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-11 h-11 rounded-lg object-cover border border-gray-150 shadow-3xs shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="block text-xs text-gray-800 font-bold">{prod.name}</span>
                                <span className="text-[10px] text-gray-400 font-semibold">Rating: ⭐ {prod.rating} ({prod.reviewsCount} Ulasan)</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-bold text-gray-850 text-sm">
                            {formatIDR(prod.price)} <span className="text-[10px] font-normal text-gray-400">/ {prod.unit}</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 font-bold text-[8px] uppercase tracking-wider">
                              {productCat?.name || "Kategori"}
                            </span>
                          </td>
                          <td className="p-4">
                            {prod.isAvailable ? (
                              <button
                                onClick={() => handleToggleProductAvailable(prod.id)}
                                className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                <span>Tersedia (Ready)</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleProductAvailable(prod.id)}
                                className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                <span>Habis (Sold Out)</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
