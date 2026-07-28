/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlusCircle, Search, Eye, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
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
import type { Product, Category } from "@/types";
import { formatIDR } from "@/utils";
import AddProductForm from "./AddProductForm";
import ProductPreview from "./ProductPreview";

interface CatalogTabProps {
  myProducts: Product[];
  categories: Category[];
  addProductForm: any;
  handleAddProductSubmit: (e: React.FormEvent) => void;
  isAddingProduct: boolean;
  setIsAddingProduct: (val: boolean) => void;
}

export default function CatalogTab({
  myProducts,
  categories,
  addProductForm,
  handleAddProductSubmit,
  isAddingProduct,
  setIsAddingProduct,
}: CatalogTabProps) {
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    return myProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchCatalogQuery.toLowerCase()));

      const matchesCategory =
        selectedCatalogCategory === "all" || p.categoryId === selectedCatalogCategory;

      return matchesSearch && matchesCategory;
    });
  }, [myProducts, searchCatalogQuery, selectedCatalogCategory]);

  const handleToggleProductAvailable = (productId: string) => {
    router.put(`/merchant/products/${productId}/toggle`);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Hapus produk ini dari katalog etalase Anda?")) {
      router.delete(`/merchant/products/${productId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="owner-edit-catalog">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-navy-200/60 p-5 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">Katalog Produk Kreatif Toko</h3>
          <p className="text-xs text-navy-400 mt-0.5">Tambahkan produk baru, atur ketersediaan stok produk warga secara instan.</p>
        </div>

        <Button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="px-5 h-9 bg-pastel-teal hover:bg-pastel-teal/90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>{isAddingProduct ? "Batal Tambah" : "Tambah Produk Baru"}</span>
        </Button>
      </div>

      {/* Add Product Form + Live Preview Panel */}
      {isAddingProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="owner-add-product-form">
          <div className="lg:col-span-7">
            <AddProductForm
              form={addProductForm}
              categories={categories}
              onSubmit={handleAddProductSubmit}
              onCancel={() => setIsAddingProduct(false)}
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-1.5 text-navy-400 pl-1">
              <Eye className="w-4 h-4 text-pastel-teal" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Pratinjau Produk (Preview)</span>
            </div>

            <ProductPreview form={addProductForm} categories={categories} />
          </div>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari produk Anda..."
            value={searchCatalogQuery}
            onChange={(e) => setSearchCatalogQuery(e.target.value)}
            className="pl-9 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white"
          />
        </div>
        <select
          value={selectedCatalogCategory}
          onChange={(e) => setSelectedCatalogCategory(e.target.value)}
          className="px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
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
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50">
                <TableHead className="p-4">Nama Produk Kreatif</TableHead>
                <TableHead className="p-4">Harga Terdaftar</TableHead>
                <TableHead className="p-4">Sektor Komoditas</TableHead>
                <TableHead className="p-4">Status Ketersediaan</TableHead>
                <TableHead className="p-4 text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-xs text-navy-400 italic">
                    Belum ada produk dalam katalog. Klik tombol "Tambah Produk Baru" di atas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-xl object-cover border border-navy-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-navy-900 text-xs truncate block">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-navy-400 block line-clamp-1">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 text-xs font-bold text-pastel-mint">
                      {formatIDR(product.price)} <span className="text-[9px] text-navy-400 font-normal">/ {product.unit}</span>
                    </TableCell>

                    <TableCell className="p-4 text-xs font-medium text-navy-600">
                      {categories.find((c) => c.id === product.categoryId)?.name || "-"}
                    </TableCell>

                    <TableCell className="p-4">
                      <button
                        onClick={() => handleToggleProductAvailable(product.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                          product.isAvailable
                            ? "bg-pastel-mint-light text-pastel-mint border-pastel-mint/20 hover:bg-pastel-mint/20"
                            : "bg-pastel-coral-light text-pastel-coral border-pastel-coral/20 hover:bg-pastel-coral/20"
                        }`}
                      >
                        {product.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Stok Tersedia
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            Stok Habis
                          </>
                        )}
                      </button>
                    </TableCell>

                    <TableCell className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
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
