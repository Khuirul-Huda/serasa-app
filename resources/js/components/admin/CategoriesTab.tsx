/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router } from '@inertiajs/react';
import { Plus, Trash2, Layers } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { Category } from '@/types';

interface CategoriesTabProps {
    categories: Category[];
}

export default function CategoriesTab({ categories }: CategoriesTabProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
        color: 'teal',
    });

    const handleAddCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            onSuccess: () => {
                toast.success(
                    `Kategori sektor "${data.name}" berhasil ditambahkan!`,
                );
                reset();
                setIsAdding(false);
            },
        });
    };

    const confirmDeleteCategory = () => {
        if (!categoryToDelete) {
            return;
        }

        router.delete(`/admin/categories/${categoryToDelete.id}`, {
            onSuccess: () => {
                toast.success(
                    `Kategori "${categoryToDelete.name}" berhasil dihapus.`,
                );
                setCategoryToDelete(null);
            },
        });
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="admin-categories-tab"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                        <Layers className="h-5 w-5 text-pastel-teal" />
                        <span>Kategori Sektor Komoditas UMKM</span>
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 sm:text-sm">
                        Kelola pengelompokan sektor usaha desa (Kuliner,
                        Kerajinan, Pertanian, dll).
                    </p>
                </div>

                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="shadow-3xs flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:w-auto sm:text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    <span>{isAdding ? 'Batal' : 'Tambah Kategori Baru'}</span>
                </Button>
            </div>

            {/* Add Category Form */}
            {isAdding && (
                <div className="shadow-3xs max-w-2xl space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6">
                    <h4 className="text-base font-extrabold tracking-wider text-navy-900 uppercase">
                        Form Kategori Sektor Baru
                    </h4>

                    <form
                        onSubmit={handleAddCategorySubmit}
                        className="space-y-4 text-xs sm:text-sm"
                    >
                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Nama Kategori Sektor
                            </Label>
                            <Input
                                type="text"
                                required
                                placeholder="Contoh: Kriya & Anyaman Bambu"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                                Uraian Kategori
                            </Label>
                            <Input
                                type="text"
                                placeholder="Penjelasan singkat sektor..."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                            />
                        </div>

                        <div className="flex justify-end gap-2 border-t border-navy-100 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAdding(false)}
                                className="cursor-pointer rounded-xl text-xs text-navy-600 sm:text-sm"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer rounded-xl bg-pastel-teal text-xs font-extrabold tracking-wider text-white uppercase hover:bg-pastel-teal/90 sm:text-sm"
                            >
                                Simpan Kategori
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Nama Sektor Komoditas
                                </TableHead>
                                <TableHead className="p-4">
                                    Uraian Sektor
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Tindakan
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow
                                    key={cat.id}
                                    className="border-b border-navy-100 transition-colors hover:bg-navy-50/30"
                                >
                                    <TableCell className="p-4 text-xs font-black text-navy-900 sm:text-sm">
                                        {cat.name}
                                    </TableCell>

                                    <TableCell className="p-4 text-xs font-normal text-navy-600 sm:text-sm">
                                        {cat.description || '-'}
                                    </TableCell>

                                    <TableCell className="p-4 text-right">
                                        <button
                                            onClick={() =>
                                                setCategoryToDelete({
                                                    id: cat.id,
                                                    name: cat.name,
                                                })
                                            }
                                            className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral"
                                            title="Hapus Kategori"
                                        >
                                            <Trash2 className="h-4.5 w-4.5" />
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
