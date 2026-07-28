/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router } from "@inertiajs/react";
import { CheckCircle2, AlertCircle } from "lucide-react";
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
    <div className="max-w-7xl mx-auto py-2 space-y-8 animate-fade-in font-sans text-navy-900" id="owner-workspace">
      {/* Vercel-Style Premium Header Section */}
      <div className="bg-white border-b border-navy-200/60 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-navy-50 border border-navy-200/60 overflow-hidden shadow-3xs shrink-0 p-0.5">
              <img
                src={myShop.logo}
                alt={myShop.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black uppercase tracking-tight text-navy-900 leading-none">{myShop.name}</h2>
                {myShop.isVerified ? (
                  <Badge variant="outline" className="bg-pastel-mint-light border-pastel-mint/20 text-pastel-mint font-black uppercase text-[8px] tracking-wider py-0.5 px-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pastel-mint fill-pastel-mint-light animate-pulse" />
                    <span>Terverifikasi</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-pastel-peach-light border-pastel-peach/20 text-pastel-peach font-black uppercase text-[8px] tracking-wider py-0.5 px-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-pastel-peach" />
                    <span>Dalam Review</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs text-navy-500 font-normal">
                Pemilik: <span className="font-bold text-navy-700">{myShop.ownerName}</span> | Dusun: <span className="font-bold text-navy-700">{myShop.dusun}</span> | Jam Operasional: <span className="font-bold text-navy-700">{myShop.jamKerja || "-"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Flat Underlined Tab Switcher */}
        <div className="flex space-x-6 border-b border-navy-200 pt-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("catalog");
              setIsAddingProduct(false);
            }}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "catalog"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
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
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            Profil Toko
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
