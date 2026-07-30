/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, router } from '@inertiajs/react';
import { Search, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { Product, Category } from '@/types';
import { formatIDR } from '@/utils';

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
    const [productToDelete, setProductToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const filteredCatalogProducts = useMemo(() => {
        return myProducts.filter((p) => {
            const matchesSearch =
                p.name
                    .toLowerCase()
                    .includes(searchCatalogQuery.toLowerCase()) ||
                (p.description &&
                    p.description
                        .toLowerCase()
                        .includes(searchCatalogQuery.toLowerCase()));

            const matchesCategory =
                selectedCatalogCategory === 'all' ||
                p.categoryId === selectedCatalogCategory;

            return matchesSearch && matchesCategory;
        });
    }, [myProducts, searchCatalogQuery, selectedCatalogCategory]);

    const handleToggleProductAvailable = (
        productId: string,
        isAvailable: boolean,
    ) => {
        router.put(
            `/merchant/products/${productId}/toggle`,
            {},
            {
                onSuccess: () => {
                    toast.success(
                        isAvailable
                            ? 'Stok produk diubah menjadi Habis.'
                            : 'Stok produk diubah menjadi Tersedia!',
                    );
                },
            },
        );
    };

    const confirmDeleteProduct = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(`/merchant/products/${productToDelete.id}`, {
            onSuccess: () => {
                toast.success(
                    `Produk "${productToDelete.name}" berhasil dihapus.`,
                );
                setProductToDelete(null);
            },
        });
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900"
            id="owner-edit-catalog"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h3 className="text-lg font-extrabold tracking-wider text-navy-900 uppercase">
                        Katalog Produk Kreatif Toko
                    </h3>
                    <p className="mt-0.5 text-xs font-normal text-navy-500 sm:text-sm">
                        Tambahkan produk baru dan kelola ketersediaan stok
                        produk warga secara instan.
                    </p>
                </div>

                <Button
                    onClick={onOpenAddModal}
                    className="shadow-3xs flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:w-auto sm:text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    <span>Tambah Produk Baru</span>
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <Input
                        type="text"
                        placeholder="Cari produk toko..."
                        value={searchCatalogQuery}
                        onChange={(e) => setSearchCatalogQuery(e.target.value)}
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                    />
                </div>

                <select
                    value={selectedCatalogCategory}
                    onChange={(e) => setSelectedCatalogCategory(e.target.value)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                >
                    <option value="all">
                        Semua Sektor Kategori ({myProducts.length})
                    </option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Identitas Produk
                                </TableHead>
                                <TableHead className="p-4">
                                    Harga Terdaftar
                                </TableHead>
                                <TableHead className="p-4">
                                    Status Ketersediaan
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Tindakan
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCatalogProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Belum ada produk terdaftar dalam katalog
                                        toko ini.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCatalogProducts.map((product) => (
                                    <TableRow
                                        key={product.id}
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30"
                                    >
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/products/${product.id}`}
                                                        className="block truncate text-xs font-bold text-navy-900 hover:text-pastel-teal sm:text-sm"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <span className="line-clamp-1 block text-xs font-normal text-navy-500">
                                                        {product.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="p-4 text-xs font-black text-navy-900 sm:text-sm">
                                            {formatIDR(product.price)}{' '}
                                            <span className="text-xs font-normal text-navy-400">
                                                / {product.unit}
                                            </span>
                                        </TableCell>

                                        <TableCell className="p-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggleProductAvailable(
                                                        product.id,
                                                        product.isAvailable,
                                                    )
                                                }
                                                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-black uppercase transition-all ${
                                                    product.isAvailable
                                                        ? 'border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal hover:bg-pastel-teal/20'
                                                        : 'border-pastel-coral/20 bg-pastel-coral-light text-pastel-coral hover:bg-pastel-coral/20'
                                                }`}
                                            >
                                                {product.isAvailable ? (
                                                    <>
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Tersedia
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        Stok Habis
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>

                                        <TableCell className="p-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setProductToDelete({
                                                        id: product.id,
                                                        name: product.name,
                                                    })
                                                }
                                                className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
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
