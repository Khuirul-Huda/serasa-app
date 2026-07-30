/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, CheckCircle2, AlertCircle, Plus, Trash2, Package } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
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

interface CatalogTabProps {
  myProducts: Product[];
  categories: Category[];
  searchCatalogQuery: string;
  setSearchCatalogQuery: (query: string) => void;
  selectedCatalogCategory: string;
  setSelectedCatalogCategory: (category: string) => void;
  onOpenAddModal: () => void;
}

export default function CatalogTab({
  myProducts,
  categories,
  searchCatalogQuery,
  setSearchCatalogQuery,
  selectedCatalogCategory,
  setSelectedCatalogCategory,
  onOpenAddModal,
}: CatalogTabProps) {
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredCatalogProducts = useMemo(() => {
    return myProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchCatalogQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchCatalogQuery.toLowerCase()));

      const matchesCategory =
        selectedCatalogCategory === "all" || p.categoryId === selectedCatalogCategory;

      return matchesSearch && matchesCategory;
    });
  }, [myProducts, searchCatalogQuery, selectedCatalogCategory]);

  const handleToggleProductAvailable = (productId: string, isAvailable: boolean) => {
    router.put(`/merchant/products/${productId}/toggle`, {}, {
      onSuccess: () => {
        toast.success(isAvailable ? "Stok produk diubah menjadi Habis." : "Stok produk diubah menjadi Tersedia!");
      },
    });
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    router.delete(`/merchant/products/${productToDelete.id}`, {
      onSuccess: () => {
        toast.success(`Produk "${productToDelete.name}" berhasil dihapus.`);
        setProductToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="owner-edit-catalog">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider">Katalog Produk Kreatif Toko</h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-0.5 font-normal">Tambahkan produk baru dan kelola ketersediaan stok produk warga secara instan.</p>
        </div>

        <Button
          onClick={onOpenAddModal}
          className="px-5 h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tambah Produk Baru</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari produk toko..."
            value={searchCatalogQuery}
            onChange={(e) => setSearchCatalogQuery(e.target.value)}
            className="pl-10 py-2.5 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={selectedCatalogCategory}
          onChange={(e) => setSelectedCatalogCategory(e.target.value)}
          className="px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
        >
          <option value="all">Semua Sektor Kategori ({myProducts.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50 text-xs font-extrabold uppercase text-navy-600 tracking-wider">
                <TableHead className="p-4">Identitas Produk</TableHead>
                <TableHead className="p-4">Harga Terdaftar</TableHead>
                <TableHead className="p-4">Status Ketersediaan</TableHead>
                <TableHead className="p-4 text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCatalogProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-8 text-center text-xs sm:text-sm text-navy-400 italic">
                    Belum ada produk terdaftar dalam katalog toko ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCatalogProducts.map((product) => (
                  <TableRow key={product.id} className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-navy-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/products/${product.id}`}
                            className="font-bold text-navy-900 text-xs sm:text-sm hover:text-pastel-teal truncate block"
                          >
                            {product.name}
                          </Link>
                          <span className="text-xs text-navy-500 block line-clamp-1 font-normal">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="p-4 text-xs sm:text-sm font-black text-navy-900">
                      {formatIDR(product.price)} <span className="text-xs text-navy-400 font-normal">/ {product.unit}</span>
                    </TableCell>

                    <TableCell className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleProductAvailable(product.id, product.isAvailable)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase rounded-lg border transition-all cursor-pointer ${
                          product.isAvailable
                            ? "bg-pastel-teal-light text-pastel-teal border-pastel-teal/20 hover:bg-pastel-teal/20"
                            : "bg-pastel-coral-light text-pastel-coral border-pastel-coral/20 hover:bg-pastel-coral/20"
                        }`}
                      >
                        {product.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Tersedia
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
                        type="button"
                        onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                        className="p-2 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                        title="Hapus Produk"
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

      {/* Confirm Modal */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Konfirmasi Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}" dari etalase toko Anda?`}
        confirmLabel="Ya, Hapus Produk"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
