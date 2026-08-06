/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, router } from '@inertiajs/react';
import {
    Search,
    CheckCircle2,
    AlertCircle,
    Trash2,
    ShoppingBag,
    Download,
    Plus,
    Pencil,
    X,
    Package,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
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
import type { Product, Category, Shop } from '@/types';
import { formatIDR } from '@/utils';

interface ProductsTabProps {
    products: Product[];
    categories: Category[];
    shops: Shop[];
}

export default function ProductsTab({
    products,
    categories,
    shops,
}: ProductsTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [productToDelete, setProductToDelete] = useState<{
        id: string;
        name: string;
    } | null>(null);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const DEFAULT_PRODUCT_FORM = {
        shop_id: shops.length > 0 ? shops[0].id : '',
        category_id: categories.length > 0 ? categories[0].id : '',
        name: '',
        price: 15000,
        unit: 'bungkus',
        description: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        is_available: true,
    };

    const [productForm, setProductForm] = useState(DEFAULT_PRODUCT_FORM);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.description &&
                    p.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()));
            const matchesCategory =
                categoryFilter === 'all' || p.categoryId === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);

    const handleOpenCreateModal = () => {
        setEditingProductId(null);
        setProductForm({
            shop_id: shops.length > 0 ? shops[0].id : '',
            category_id: categories.length > 0 ? categories[0].id : '',
            name: '',
            price: 15000,
            unit: 'bungkus',
            description: '',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            is_available: true,
        });
        setIsProductModalOpen(true);
    };

    const handleOpenEditModal = (p: Product) => {
        setEditingProductId(p.id);
        setProductForm({
            shop_id: p.shopId,
            category_id: p.categoryId,
            name: p.name,
            price: p.price,
            unit: p.unit,
            description: p.description || '',
            image: p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
            is_available: Boolean(p.isAvailable),
        });
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();

        if (!productForm.name.trim() || !productForm.shop_id || !productForm.category_id) {
            toast.error('Nama Produk, Toko Pemilik, dan Kategori Sektor harus diisi!');
            return;
        }

        if (editingProductId) {
            router.put(`/admin/products/${editingProductId}`, productForm, {
                onSuccess: () => {
                    toast.success(`Data produk "${productForm.name}" berhasil diperbarui!`);
                    setIsProductModalOpen(false);
                },
                onError: () => toast.error('Gagal memperbarui data produk!'),
            });
        } else {
            router.post('/admin/products', productForm, {
                onSuccess: () => {
                    toast.success(`Produk "${productForm.name}" berhasil ditambahkan!`);
                    setIsProductModalOpen(false);
                },
                onError: () => toast.error('Gagal menambahkan produk baru!'),
            });
        }
    };

    const handleToggleProduct = (productId: string, isAvailable: boolean) => {
        router.post(
            `/admin/products/${productId}/toggle`,
            {},
            {
                onSuccess: () => {
                    toast.success(
                        isAvailable
                            ? 'Status stok diubah menjadi Habis.'
                            : 'Status stok diubah menjadi Tersedia!',
                    );
                },
            },
        );
    };

    const confirmDeleteProduct = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(`/admin/products/${productToDelete.id}`, {
            onSuccess: () => {
                toast.success(
                    `Produk "${productToDelete.name}" berhasil dihapus.`,
                );
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
                'Nama Produk': product.name,
                'Toko Pemilik': shop ? shop.name : '-',
                'Pemilik Toko': shop ? shop.ownerName : '-',
                'Sektor Kategori': cat ? cat.name : '-',
                Harga: product.price,
                Satuan: product.unit,
                Rating: product.rating,
                'Status Stok': product.isAvailable ? 'Tersedia' : 'Stok Habis',
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan_Produk_Desa');
        const fileName = `Laporan_Katalog_Produk_Samirono_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, fileName);
        toast.success(`Laporan Excel produk "${fileName}" berhasil diunduh!`);
    };

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900 dark:text-navy-100"
            id="admin-products-tab"
        >
            {/* Header Bar */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 dark:border-navy-800 dark:bg-navy-900 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h3 className="text-lg font-extrabold tracking-wider text-navy-900 uppercase dark:text-white">
                        Moderasi & Kelola Produk Etalase Warga
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400 sm:text-sm">
                        Kelola seluruh komoditas produk, tambah produk baru ke toko mana saja, atau ekspor laporan.
                    </p>
                </div>

                <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
                    <Button
                        onClick={handleOpenCreateModal}
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-4 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:flex-none sm:text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tambah Produk</span>
                    </Button>

                    <Button
                        onClick={handleExportExcel}
                        variant="outline"
                        className="shadow-3xs flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-navy-200 px-4 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800 sm:flex-none sm:text-sm"
                    >
                        <Download className="h-4 w-4 text-pastel-teal" />
                        <span>Ekspor Excel</span>
                    </Button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <Input
                        type="text"
                        placeholder="Cari nama produk atau deskripsi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-navy-200/60 bg-white py-2.5 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-800 dark:bg-navy-900 sm:text-sm"
                    />
                </div>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none dark:border-navy-800 dark:bg-navy-900 dark:text-navy-200 sm:text-sm"
                >
                    <option value="all">
                        Semua Sektor ({products.length})
                    </option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase dark:border-navy-800 dark:bg-navy-950 dark:text-navy-400 hover:bg-navy-50/50">
                                <TableHead className="p-4">
                                    Produk Kreatif
                                </TableHead>
                                <TableHead className="p-4">
                                    Toko Pemilik
                                </TableHead>
                                <TableHead className="p-4">
                                    Harga Terdaftar
                                </TableHead>
                                <TableHead className="p-4">
                                    Status Stok
                                </TableHead>
                                <TableHead className="p-4 text-right">
                                    Moderasi Admin
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="p-8 text-center text-xs text-navy-400 italic sm:text-sm"
                                    >
                                        Belum ada produk yang cocok dengan
                                        filter pencarian.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => {
                                    const shop = shops.find(
                                        (s) => s.id === product.shopId,
                                    );

                                    return (
                                        <TableRow
                                            key={product.id}
                                            className="border-b border-navy-100 transition-colors hover:bg-navy-50/30 dark:border-navy-800 dark:hover:bg-navy-950/50"
                                        >
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover dark:border-navy-700"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/products/${product.id}`}
                                                            className="block truncate text-xs font-bold text-navy-900 hover:text-pastel-teal dark:text-white sm:text-sm"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        <span className="line-clamp-1 block text-xs font-normal text-navy-500 dark:text-navy-400">
                                                            {
                                                                product.description
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="p-4 text-xs font-bold text-navy-800 dark:text-navy-200 sm:text-sm">
                                                {shop ? (
                                                    <Link
                                                        href={`/shops/${shop.id}`}
                                                        className="flex items-center gap-1.5 hover:text-pastel-teal"
                                                    >
                                                        <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-pastel-teal" />
                                                        <span>{shop.name}</span>
                                                    </Link>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>

                                            <TableCell className="p-4 text-xs font-black text-navy-900 dark:text-white sm:text-sm">
                                                {formatIDR(product.price)}{' '}
                                                <span className="text-xs font-normal text-navy-400">
                                                    / {product.unit}
                                                </span>
                                            </TableCell>

                                            <TableCell className="p-4">
                                                <button
                                                    onClick={() =>
                                                        handleToggleProduct(
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
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenEditModal(product)}
                                                        className="cursor-pointer rounded-xl p-2 text-navy-600 transition-colors hover:bg-navy-100 hover:text-pastel-teal dark:text-navy-300 dark:hover:bg-navy-800"
                                                        title="Edit Produk"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            setProductToDelete({
                                                                id: product.id,
                                                                name: product.name,
                                                            })
                                                        }
                                                        className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral"
                                                        title="Hapus Produk"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* CREATE / EDIT PRODUCT MODAL DIALOG PORTAL */}
            {isProductModalOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-xs animate-fade-in font-sans text-navy-900 dark:text-navy-100 overflow-y-auto">
                    <div className="relative my-8 w-full max-w-md rounded-3xl border border-navy-200/80 bg-white p-6 shadow-2xl dark:border-navy-800 dark:bg-navy-900">
                        <div className="flex items-center justify-between border-b border-navy-100 pb-3 dark:border-navy-800">
                            <h3 className="flex items-center gap-2 text-sm font-black text-navy-900 uppercase dark:text-white">
                                <Package className="h-4 w-4 text-pastel-teal" />
                                <span>{editingProductId ? 'Edit Data Produk UMKM' : 'Tambah Produk Baru'}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsProductModalOpen(false)}
                                className="rounded-xl p-1 text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Toko Pemilik *
                                </label>
                                <select
                                    value={productForm.shop_id}
                                    onChange={(e) => setProductForm({ ...productForm, shop_id: e.target.value })}
                                    required
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-bold text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                >
                                    <option value="" disabled>-- Pilih Toko Pemilik --</option>
                                    {shops.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            🏪 {s.name} ({s.ownerName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Kategori Sektor *
                                </label>
                                <select
                                    value={productForm.category_id}
                                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                                    required
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs font-bold text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                >
                                    <option value="" disabled>-- Pilih Sektor --</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            🏷️ {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Keripik Singkong Gurih..."
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    required
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Harga (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="15000"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                        required
                                        min={0}
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                        Satuan / Kemasan *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="porsi / bungkus / kg..."
                                        value={productForm.unit}
                                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                                        required
                                        className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Penjelasan varian rasa, komposisi, atau cara pesan..."
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-navy-700 uppercase dark:text-navy-300">
                                    URL Gambar Produk
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    value={productForm.image}
                                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-navy-200 bg-navy-50/50 p-2.5 text-xs text-navy-900 focus:border-pastel-teal focus:outline-none dark:border-navy-700 dark:bg-navy-950 dark:text-navy-100"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs font-bold text-navy-800 dark:text-navy-200">
                                <input
                                    type="checkbox"
                                    checked={productForm.is_available}
                                    onChange={(e) => setProductForm({ ...productForm, is_available: e.target.checked })}
                                    className="h-4 w-4 rounded-md border-navy-300 text-pastel-teal focus:ring-pastel-teal"
                                />
                                <span>Stok Tersedia untuk Dijual</span>
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="rounded-xl border border-navy-200 px-4 py-2 text-xs font-bold text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-pastel-teal px-5 py-2 text-xs font-black text-white shadow-xs hover:bg-pastel-teal/90"
                                >
                                    {editingProductId ? 'Simpan Perubahan' : 'Tambah Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

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
