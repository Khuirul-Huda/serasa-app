/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, router } from '@inertiajs/react';
import {
    Newspaper,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    FileText,
    Search,
    Eye,
    EyeOff,
    ExternalLink,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
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
import type { ArticleItem } from '@/types';

interface ArticlesTabProps {
    articles: ArticleItem[];
}

const DEFAULT_CATEGORIES = ['Berita', 'Pengumuman', 'Inovasi', 'Edukasi'];

export default function ArticlesTab({ articles }: ArticlesTabProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [articleToDelete, setArticleToDelete] = useState<ArticleItem | null>(null);

    const handleTogglePublish = (article: ArticleItem) => {
        router.post(
            `/admin/articles/${article.id}/toggle-publish`,
            {},
            {
                onSuccess: () => {
                    toast.success(`Status artikel "${article.title}" berhasil diubah.`);
                },
            },
        );
    };

    const confirmDeleteArticle = () => {
        if (!articleToDelete) return;

        router.delete(`/admin/articles/${articleToDelete.id}`, {
            onSuccess: () => {
                toast.success(`Artikel "${articleToDelete.title}" berhasil dihapus.`);
                setArticleToDelete(null);
            },
            onError: () => {
                toast.error('Gagal menghapus artikel.');
            },
        });
    };

    // Calculate stats
    const totalArticles = articles.length;
    const publishedArticles = articles.filter((a) => a.isPublished).length;
    const draftArticles = totalArticles - publishedArticles;

    // Filter articles
    const filteredArticles = articles.filter((article) => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.excerpt &&
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategoryFilter === 'all' || article.category === selectedCategoryFilter;

        return matchesSearch && matchesCategory;
    });

    return (
        <div
            className="animate-fade-in space-y-6 font-sans text-navy-900 dark:text-navy-100"
            id="admin-articles-tab"
        >
            {/* Header & Main Actions */}
            <div className="shadow-3xs flex flex-col items-start justify-between gap-4 rounded-3xl border border-navy-200/60 bg-white p-5 dark:border-navy-800 dark:bg-navy-900 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-wider text-navy-900 uppercase dark:text-white">
                        <Newspaper className="h-5 w-5 text-pastel-teal" />
                        <span>Kabar Desa & Publikasi Artikel</span>
                    </h3>
                    <p className="mt-1 text-xs font-normal text-navy-500 dark:text-navy-400 sm:text-sm">
                        Kelola warta desa, panduan edukasi, pengumuman, dan artikel inovasi masyarakat.
                    </p>
                </div>

                <Link
                    href="/admin/articles/create"
                    className="shadow-3xs flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-pastel-teal px-5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:w-auto sm:text-sm"
                >
                    <Plus className="h-4 w-4 text-white" />
                    <span>Tulis Artikel Baru</span>
                </Link>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-2xl border border-navy-200/60 bg-white p-4 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                    <div>
                        <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-400">
                            Total Artikel
                        </span>
                        <span className="mt-0.5 block text-2xl font-black text-navy-900 dark:text-white">
                            {totalArticles} Artikel
                        </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pastel-lavender/30 bg-pastel-lavender-light text-pastel-lavender dark:bg-pastel-lavender/10">
                        <FileText className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-navy-200/60 bg-white p-4 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                    <div>
                        <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-400">
                            Artikel Terbit
                        </span>
                        <span className="mt-0.5 block text-2xl font-black text-pastel-teal">
                            {publishedArticles} Artikel
                        </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal dark:bg-pastel-teal/10">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-navy-200/60 bg-white p-4 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                    <div>
                        <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase dark:text-navy-400">
                            Draft Artikel
                        </span>
                        <span className="mt-0.5 block text-2xl font-black text-pastel-peach">
                            {draftArticles} Draft
                        </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-pastel-peach/30 bg-pastel-peach-light text-pastel-peach dark:bg-pastel-peach/10">
                        <EyeOff className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
                    <Input
                        type="text"
                        placeholder="Cari judul artikel, ringkasan, atau kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl border-navy-200/60 pl-10 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white sm:text-sm"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-navy-500 uppercase dark:text-navy-400">
                        Kategori:
                    </span>
                    <button
                        type="button"
                        onClick={() => setSelectedCategoryFilter('all')}
                        className={`rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase transition-all ${
                            selectedCategoryFilter === 'all'
                                ? 'bg-pastel-teal text-white'
                                : 'bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300'
                        }`}
                    >
                        Semua
                    </button>
                    {DEFAULT_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategoryFilter(cat)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase transition-all ${
                                selectedCategoryFilter === cat
                                    ? 'bg-pastel-teal text-white'
                                    : 'bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Table */}
            <div className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white dark:border-navy-800 dark:bg-navy-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase hover:bg-navy-50/50 dark:border-navy-800 dark:bg-navy-950 dark:text-navy-300">
                                <TableHead className="p-4">Artikel</TableHead>
                                <TableHead className="p-4">Kategori</TableHead>
                                <TableHead className="p-4">Status Publikasi</TableHead>
                                <TableHead className="p-4">Tanggal Buat</TableHead>
                                <TableHead className="p-4 text-right">Tindakan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="p-8 text-center text-xs text-navy-400 dark:text-navy-500 sm:text-sm"
                                    >
                                        Belum ada artikel yang sesuai kriteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredArticles.map((article) => (
                                    <TableRow
                                        key={article.id}
                                        className="border-b border-navy-100 transition-colors hover:bg-navy-50/30 dark:border-navy-800 dark:hover:bg-navy-800/40"
                                    >
                                        {/* Title & Cover */}
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-3">
                                                {article.coverImage ? (
                                                    <img
                                                        src={article.coverImage}
                                                        alt={article.title}
                                                        className="h-12 w-16 shrink-0 rounded-lg object-cover border border-navy-200/60 dark:border-navy-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-400 dark:bg-navy-800">
                                                        <Newspaper className="h-6 w-6" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <a
                                                        href={`/articles/${article.slug}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-1 font-bold text-navy-900 hover:text-pastel-teal dark:text-white dark:hover:text-pastel-teal sm:text-sm"
                                                    >
                                                        <span className="truncate">{article.title}</span>
                                                        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                                    </a>
                                                    <p className="line-clamp-1 text-xs text-navy-500 dark:text-navy-400">
                                                        {article.excerpt || 'Tanpa ringkasan'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell className="p-4">
                                            <span className="inline-block rounded-md border border-pastel-lavender/30 bg-pastel-lavender-light px-2.5 py-1 text-xs font-bold text-navy-800 dark:border-navy-700 dark:bg-navy-800 dark:text-pastel-lavender">
                                                {article.category}
                                            </span>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="p-4">
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePublish(article)}
                                                className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold tracking-wider uppercase transition-all ${
                                                    article.isPublished
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300'
                                                }`}
                                                title="Klik untuk ubah status publikasi"
                                            >
                                                {article.isPublished ? (
                                                    <>
                                                        <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        <span>Terbit</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                                        <span>Draft</span>
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>

                                        {/* Created Date */}
                                        <TableCell className="p-4 text-xs text-navy-600 dark:text-navy-300">
                                            {article.publishedAt || article.createdAt || '-'}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/articles/${article.id}/edit`}
                                                    className="cursor-pointer rounded-xl p-2 text-navy-500 transition-colors hover:bg-navy-100 hover:text-pastel-teal dark:text-navy-400 dark:hover:bg-navy-800"
                                                    title="Edit Artikel"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => setArticleToDelete(article)}
                                                    className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-pastel-coral-light hover:text-pastel-coral dark:hover:bg-pastel-coral/20"
                                                    title="Hapus Artikel"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={!!articleToDelete}
                title="Konfirmasi Hapus Artikel"
                description={`Apakah Anda yakin ingin menghapus artikel "${articleToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus Artikel"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={confirmDeleteArticle}
                onCancel={() => setArticleToDelete(null)}
            />
        </div>
    );
}
