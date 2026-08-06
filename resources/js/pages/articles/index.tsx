/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, router } from '@inertiajs/react';
import { Newspaper, Search, Calendar, Clock, ChevronRight, Filter } from 'lucide-react';
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Article } from '@/types';

interface PaginatedArticles {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ArticlesIndexProps {
    articles: PaginatedArticles;
    settings?: AppSettings;
    categories?: string[];
    filters?: {
        category?: string;
        search?: string;
    };
}

const DEFAULT_COVER =
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    Berita: { bg: 'bg-blue-50', text: 'text-blue-700', darkBg: 'dark:bg-blue-950/60', darkText: 'dark:text-blue-300' },
    Pengumuman: { bg: 'bg-amber-50', text: 'text-amber-700', darkBg: 'dark:bg-amber-950/60', darkText: 'dark:text-amber-300' },
    Inovasi: { bg: 'bg-emerald-50', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-950/60', darkText: 'dark:text-emerald-300' },
    Edukasi: { bg: 'bg-purple-50', text: 'text-purple-700', darkBg: 'dark:bg-purple-950/60', darkText: 'dark:text-purple-300' },
};

function getReadTime(content: string = ''): number {
    const plainText = content.replace(/<[^>]+>/g, '');
    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateString?: string | null): string {
    if (!dateString) return 'Baru saja';
    try {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
}

export default function ArticlesIndex({
    articles,
    settings,
    categories = [],
    filters = {},
}: ArticlesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const selectedCategory = filters.category || 'all';

    const categoryList = Array.from(
        new Set(['Berita', 'Pengumuman', 'Inovasi', 'Edukasi', ...(categories || [])])
    );

    const handleCategorySelect = (category: string) => {
        router.get(
            '/articles',
            {
                category: category === 'all' ? undefined : category,
                search: searchQuery || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/articles',
            {
                category: selectedCategory === 'all' ? undefined : selectedCategory,
                search: searchQuery || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    return (
        <MarketplaceLayout settings={settings} categories={[]} activeTab="articles">
            <SEOHead
                title="Kabar & Artikel Desa - Samirono Etalase"
                description="Informasi, berita warga, dan artikel inovasi produk desa Samirono"
            />

            {/* HERO HEADER SECTION */}
            <section className="relative overflow-hidden border-b border-navy-200/70 bg-gradient-to-b from-pastel-teal/10 via-white to-navy-50/50 py-12 dark:border-navy-800 dark:from-navy-900 dark:via-navy-950 dark:to-navy-900 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-pastel-teal/25 bg-pastel-teal/10 px-4 py-1.5 text-xs font-black tracking-wider text-pastel-teal uppercase dark:border-pastel-teal/30 dark:bg-pastel-teal/20">
                            <Newspaper className="h-4 w-4" />
                            <span>Warta & Inovasi Samirono</span>
                        </div>

                        <h1 className="mt-4 text-3xl font-black tracking-tight text-navy-900 dark:text-navy-100 sm:text-4xl lg:text-5xl">
                            Kabar & Artikel Desa
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy-600 dark:text-navy-300 sm:text-base">
                            Informasi terbaru, warta kegiatan warga, panduan usaha UMKM, dan artikel inovasi produk Desa Samirono.
                        </p>

                        {/* SEARCH & FILTER BAR */}
                        <div className="mt-8 w-full max-w-2xl space-y-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari judul artikel, topik, atau inovasi desa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border border-navy-200 bg-white py-3.5 pr-28 pl-11 text-sm font-medium text-navy-900 shadow-sm placeholder-navy-400 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none dark:border-navy-700 dark:bg-navy-900 dark:text-navy-100 dark:placeholder-navy-500"
                                />
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-400 dark:text-navy-500" />
                                <button
                                    type="submit"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-xl bg-pastel-teal px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-pastel-teal/90"
                                >
                                    Cari
                                </button>
                            </form>

                            {/* CATEGORY CHIPS FILTER */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleCategorySelect('all')}
                                    className={`cursor-pointer rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                                        selectedCategory === 'all'
                                            ? 'bg-navy-900 text-white shadow-xs dark:bg-pastel-teal dark:text-navy-950'
                                            : 'border border-navy-200 bg-white text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-300 dark:hover:bg-navy-800'
                                    }`}
                                >
                                    Semua Kategori
                                </button>

                                {categoryList.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleCategorySelect(cat)}
                                        className={`cursor-pointer rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-navy-900 text-white shadow-xs dark:bg-pastel-teal dark:text-navy-950'
                                                : 'border border-navy-200 bg-white text-navy-600 hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-300 dark:hover:bg-navy-800'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTICLES GRID SECTION */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {articles.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.data.map((article) => {
                                const categoryStyle = CATEGORY_COLORS[article.category] || {
                                    bg: 'bg-navy-100',
                                    text: 'text-navy-800',
                                    darkBg: 'dark:bg-navy-800',
                                    darkText: 'dark:text-navy-200',
                                };
                                const readTime = getReadTime(article.content);

                                return (
                                    <article
                                        key={article.id}
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-navy-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-navy-800 dark:bg-navy-900"
                                    >
                                        {/* Cover Image */}
                                        <div className="relative aspect-video w-full overflow-hidden bg-navy-100 dark:bg-navy-800">
                                            <img
                                                src={article.cover_image || DEFAULT_COVER}
                                                alt={article.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = DEFAULT_COVER;
                                                }}
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span
                                                    className={`inline-flex items-center rounded-xl px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase shadow-xs ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.darkBg} ${categoryStyle.darkText}`}
                                                >
                                                    {article.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col justify-between p-6">
                                            <div className="space-y-3">
                                                {/* Meta Info */}
                                                <div className="flex items-center gap-4 text-xs text-navy-500 dark:text-navy-400">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 text-pastel-teal" />
                                                        {formatDate(article.published_at || article.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5 text-pastel-teal" />
                                                        {readTime} min baca
                                                    </span>
                                                </div>

                                                {/* Title */}
                                                <h2 className="text-lg font-bold text-navy-900 transition-colors group-hover:text-pastel-teal dark:text-navy-100">
                                                    <Link href={`/articles/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h2>

                                                {/* Excerpt */}
                                                <p className="line-clamp-3 text-xs leading-relaxed text-navy-600 dark:text-navy-300">
                                                    {article.excerpt ||
                                                        article.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...'}
                                                </p>
                                            </div>

                                            {/* Action Link */}
                                            <div className="mt-6 pt-4 border-t border-navy-100 dark:border-navy-800">
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-pastel-teal transition-all group-hover:gap-2"
                                                >
                                                    <span>Baca Selengkapnya</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* PAGINATION CONTROLS */}
                        {articles.last_page > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-2">
                                {articles.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="rounded-xl border border-navy-200 bg-navy-50 px-3.5 py-2 text-xs font-semibold text-navy-400 opacity-60 dark:border-navy-800 dark:bg-navy-900 dark:text-navy-600"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                                link.active
                                                    ? 'bg-pastel-teal text-white shadow-xs'
                                                    : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div className="mx-auto max-w-md rounded-3xl border border-navy-200/80 bg-white p-10 text-center shadow-xs dark:border-navy-800 dark:bg-navy-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pastel-teal/10 text-pastel-teal dark:bg-pastel-teal/20">
                            <Filter className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-navy-900 dark:text-navy-100">
                            Belum Ada Artikel Ditemukan
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-navy-600 dark:text-navy-300">
                            {searchQuery || selectedCategory !== 'all'
                                ? `Tidak ada artikel yang cocok dengan pencarian "${searchQuery}" atau kategori yang dipilih.`
                                : 'Belum ada artikel atau kabar desa yang dipublikasikan.'}
                        </p>
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    handleCategorySelect('all');
                                }}
                                className="mt-6 cursor-pointer rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-pastel-teal/90"
                            >
                                Reset Filter & Pencarian
                            </button>
                        )}
                    </div>
                )}
            </section>
        </MarketplaceLayout>
    );
}
