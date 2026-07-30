/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Plus, Trash2, Layers } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Category } from "@/types";

interface CategoriesTabProps {
  categories: Category[];
}

export default function CategoriesTab({ categories }: CategoriesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    name: "",
    description: "",
    color: "teal",
  });

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/categories", {
      onSuccess: () => {
        toast.success(`Kategori sektor "${data.name}" berhasil ditambahkan!`);
        reset();
        setIsAdding(false);
      },
    });
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    router.delete(`/admin/categories/${categoryToDelete.id}`, {
      onSuccess: () => {
        toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`);
        setCategoryToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-categories-tab">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs gap-4">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-5 h-5 text-pastel-teal" />
            <span>Kategori Sektor Komoditas UMKM</span>
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Kelola pengelompokan sektor usaha desa (Kuliner, Kerajinan, Pertanian, dll).
          </p>
        </div>

        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-3xs flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{isAdding ? "Batal" : "Tambah Kategori Baru"}</span>
        </Button>
      </div>

      {/* Add Category Form */}
      {isAdding && (
        <div className="bg-white border border-navy-200/60 p-6 rounded-3xl shadow-3xs space-y-4 max-w-2xl">
          <h4 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">Form Kategori Sektor Baru</h4>
          
          <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Nama Kategori Sektor</Label>
              <Input
                type="text"
                required
                placeholder="Contoh: Kriya & Anyaman Bambu"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Uraian Kategori</Label>
              <Input
                type="text"
                placeholder="Penjelasan singkat sektor..."
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-navy-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="rounded-xl text-navy-600 text-xs sm:text-sm cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="bg-pastel-teal hover:bg-pastel-teal/90 text-white rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm cursor-pointer"
              >
                Simpan Kategori
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50 text-xs font-extrabold uppercase text-navy-600 tracking-wider">
                <TableHead className="p-4">Nama Sektor Komoditas</TableHead>
                <TableHead className="p-4">Uraian Sektor</TableHead>
                <TableHead className="p-4 text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors">
                  <TableCell className="p-4 font-black text-navy-900 text-xs sm:text-sm">
                    {cat.name}
                  </TableCell>

                  <TableCell className="p-4 text-xs sm:text-sm text-navy-600 font-normal">
                    {cat.description || "-"}
                  </TableCell>

                  <TableCell className="p-4 text-right">
                    <button
                      onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                      className="p-2 rounded-xl text-navy-400 hover:text-pastel-coral hover:bg-pastel-coral-light transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        title="Konfirmasi Hapus Kategori"
        description={`Hapus kategori "${categoryToDelete?.name}"? Produk yang berada di bawah kategori ini akan dialihkan ke kategori default secara otomatis.`}
        confirmLabel="Ya, Hapus Kategori"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={confirmDeleteCategory}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
