/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, Link } from "@inertiajs/react";
import { CheckCircle2, AlertCircle, ShoppingBag, Settings, ExternalLink, Store, Award } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import type { Shop, Product, Category } from "@/types";
import OnboardingPanel from "./owner/OnboardingPanel";
import ShopProfileTab from "./owner/ShopProfileTab";
import CatalogTab from "./owner/CatalogTab";

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
    _method: "PUT",
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
  }, [myShop, activeTab]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerForm.post("/merchant/shop", {
      forceFormData: true,
    });
  };

  const handleEditShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editShopForm.post("/merchant/shop", {
      forceFormData: true,
      onSuccess: () => {
        setEditSuccess(true);
        setTimeout(() => setEditSuccess(false), 3000);
      },
    });
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductForm.post("/merchant/products", {
      forceFormData: true,
      onSuccess: () => {
        addProductForm.reset();
        setIsAddingProduct(false);
      },
    });
  };

  // Onboarding View (If shop does not exist)
  if (!myShop) {
    return (
      <OnboardingPanel
        categories={categories}
        form={registerForm}
        onSubmit={handleRegisterSubmit}
      />
    );
  }

  // Dashboard Workspace Panel View
  return (
    <div className="max-w-7xl mx-auto py-2 space-y-6 animate-fade-in font-sans text-navy-900" id="owner-workspace">
      
      {/* Merchant Header Banner & Overview Cards */}
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 shadow-3xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-navy-50 border border-navy-200/60 overflow-hidden shadow-3xs shrink-0 p-0.5">
              <img
                src={myShop.logo}
                alt={myShop.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-navy-900 leading-none">{myShop.name}</h1>
                {myShop.isVerified ? (
                  <Badge variant="outline" className="bg-pastel-teal-light border-pastel-teal/20 text-pastel-teal font-black uppercase text-xs tracking-wider py-1 px-2.5 flex items-center gap-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-pastel-teal fill-pastel-teal-light animate-pulse" />
                    <span>Terverifikasi</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-pastel-peach-light border-pastel-peach/20 text-pastel-peach font-black uppercase text-xs tracking-wider py-1 px-2.5 flex items-center gap-1.5 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-pastel-peach" />
                    <span>Dalam Review</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-navy-500 font-normal">
                Pemilik: <span className="font-bold text-navy-800">{myShop.ownerName}</span> | Dusun: <span className="font-bold text-navy-800">{myShop.dusun}</span> | Sektor: <span className="font-bold text-pastel-teal">{myShop.category}</span>
              </p>
            </div>
          </div>

          {/* Direct Live Store View Action Button */}
          <Link
            href={`/shops/${myShop.id}`}
            target="_blank"
            className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl transition-all shadow-3xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Lihat Toko Publik (Live)</span>
            <ExternalLink className="w-4 h-4 text-pastel-teal" />
          </Link>
        </div>

        {/* Quick Merchant Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-navy-100">
          <div className="bg-navy-50/60 rounded-2xl border border-navy-200/50 p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400 block">Total Produk Etalase</span>
              <span className="text-xl font-black text-navy-900 mt-0.5 block">{myProducts.length} Produk</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center border border-pastel-teal/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-navy-50/60 rounded-2xl border border-navy-200/50 p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400 block">Status Operasional</span>
              <span className="text-sm font-black text-navy-900 mt-0.5 block">{myShop.jamKerja || "08:00 - 17:00"}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pastel-peach-light text-navy-800 flex items-center justify-center border border-pastel-peach/30">
              <Store className="w-5 h-5 text-pastel-peach" />
            </div>
          </div>

          <div className="bg-navy-50/60 rounded-2xl border border-navy-200/50 p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-navy-400 block">Legalitas Toko</span>
              <div className="flex gap-1 mt-1 flex-wrap">
                {myShop.nib ? <span className="px-1.5 py-0.5 bg-pastel-lavender-light text-pastel-lavender font-black text-[9px] uppercase rounded">NIB</span> : null}
                {myShop.halal ? <span className="px-1.5 py-0.5 bg-pastel-teal-light text-pastel-teal font-black text-[9px] uppercase rounded">HALAL</span> : null}
                {myShop.pirt ? <span className="px-1.5 py-0.5 bg-pastel-peach-light text-pastel-peach font-black text-[9px] uppercase rounded">P-IRT</span> : null}
                {!myShop.nib && !myShop.halal && !myShop.pirt && <span className="text-xs text-navy-400 font-medium">Belum Ada</span>}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pastel-lavender-light text-pastel-lavender flex items-center justify-center border border-pastel-lavender/30">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Flat Underlined Tab Switcher with Icons */}
        <div className="flex space-x-6 border-b border-navy-200 pt-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("catalog");
              setIsAddingProduct(false);
            }}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "catalog"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Etalase Produk ({myProducts.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("shop-profile");
              setIsAddingProduct(false);
            }}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "shop-profile"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profil Toko</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "shop-profile" && (
        <ShopProfileTab
          form={editShopForm}
          onSubmit={handleEditShopSubmit}
          editSuccess={editSuccess}
        />
      )}

      {activeTab === "catalog" && (
        <CatalogTab
          myProducts={myProducts}
          categories={categories}
          addProductForm={addProductForm}
          handleAddProductSubmit={handleAddProductSubmit}
          isAddingProduct={isAddingProduct}
          setIsAddingProduct={setIsAddingProduct}
        />
      )}
    </div>
  );
}
