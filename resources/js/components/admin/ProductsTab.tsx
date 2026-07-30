/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, CheckCircle2, AlertCircle, Trash2, ShoppingBag, Download } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Product, Category, Shop } from "@/types";
import { formatIDR } from "@/utils";

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  shops: Shop[];
}

export default function ProductsTab({ products, categories, shops }: ProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleToggleProduct = (productId: string, isAvailable: boolean) => {
    router.post(`/admin/products/${productId}/toggle`, {}, {
      onSuccess: () => {
        toast.success(isAvailable ? "Status stok diubah menjadi Habis." : "Status stok diubah menjadi Tersedia!");
      },
    });
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    router.delete(`/admin/products/${productToDelete.id}`, {
      onSuccess: () => {
        toast.success(`Produk "${productToDelete.name}" berhasil dihapus.`);
        setProductToDelete(null);
      },
    });
  };

  const handleExportExcel = () => {
    const exportData = products.map((product, index) => {
      const shop = shops.find((s) => s.id === product.shopId);
      const cat = categories.find((c) => c.id === product.categoryId);
      return {
        No: index + 1,
        "Nama Produk": product.name,
        "Toko Pemilik": shop ? shop.name : "-",
        "Pemilik Toko": shop ? shop.ownerName : "-",
        "Sektor Kategori": cat ? cat.name : "-",
        "Harga": product.price,
        "Satuan": product.unit,
        "Rating": product.rating,
        "Status Stok": product.isAvailable ? "Tersedia" : "Stok Habis",
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan_Produk_Desa");
    const fileName = `Laporan_Katalog_Produk_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    toast.success(`Laporan Excel produk "${fileName}" berhasil diunduh!`);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-products-tab">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider">
            Moderasi Produk Etalase Warga
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Tinjau seluruh komoditas produk yang diunggah oleh pemilik UMKM Desa Samirono.
          </p>
        </div>

        <Button
          onClick={handleExportExcel}
          variant="outline"
          className="px-4 h-10 border-navy-200 text-navy-700 hover:bg-navy-50 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 text-pastel-teal" />
          <span>Ekspor Excel Produk</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
        >
          <option value="all">Semua Sektor ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
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
                <TableHead className="p-4">Produk Kreatif</TableHead>
                <TableHead className="p-4">Toko Pemilik</TableHead>
                <TableHead className="p-4">Harga Terdaftar</TableHead>
                <TableHead className="p-4">Status Stok</TableHead>
                <TableHead className="p-4 text-right">Moderasi Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-xs sm:text-sm text-navy-400 italic">
                    Belum ada produk yang cocok dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const shop = shops.find((s) => s.id === product.shopId);
                  return (
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

                      <TableCell className="p-4 text-xs sm:text-sm font-bold text-navy-800">
                        {shop ? (
                          <Link href={`/shops/${shop.id}`} className="hover:text-pastel-teal flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-pastel-teal shrink-0" />
                            <span>{shop.name}</span>
                          </Link>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="p-4 text-xs sm:text-sm font-black text-navy-900">
                        {formatIDR(product.price)} <span className="text-xs text-navy-400 font-normal">/ {product.unit}</span>
                      </TableCell>

                      <TableCell className="p-4">
                        <button
                          onClick={() => handleToggleProduct(product.id, product.isAvailable)}
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
                          onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                          className="p-2 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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

      {/* Confirm Modal */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Konfirmasi Hapus Produk"
        description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}" dari platform etalase?`}
        confirmLabel="Ya, Hapus Produk"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
