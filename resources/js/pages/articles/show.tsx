/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Share2,
    Check,
    Newspaper,
    ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Article } from '@/types';

interface ArticleShowProps {
    article: Article;
    recentArticles?: Article[];
    settings?: AppSettings;
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

export default function ArticleShow({
    article,
    recentArticles = [],
    settings,
}: ArticleShowProps) {
    const [copied, setCopied] = useState(false);

    const readTime = getReadTime(article.content);
    const categoryStyle = CATEGORY_COLORS[article.category] || {
        bg: 'bg-navy-100',
        text: 'text-navy-800',
        darkBg: 'dark:bg-navy-800',
        darkText: 'dark:text-navy-200',
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            });
        }
    };

    return (
        <MarketplaceLayout settings={settings} categories={[]} activeTab="detail">
            <SEOHead
                title={`${article.title} - Kabar Desa Samirono`}
                description={
                    article.excerpt ||
                    article.content.replace(/<[^>]+>/g, '').slice(0, 155)
                }
                image={article.cover_image || DEFAULT_COVER}
                siteName={settings?.appName || 'Samirono Etalase'}
            />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* BACK NAVIGATION LINK */}
                <div className="mb-6">
                    <Link
                        href="/articles"
                        className="inline-flex items-center gap-2 text-xs font-extrabold text-navy-600 transition-colors hover:text-pastel-teal dark:text-navy-300 dark:hover:text-pastel-teal"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali ke Kabar Desa</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* MAIN ARTICLE CONTENT */}
                    <article className="space-y-8 lg:col-span-8">
                        {/* HEADER SECTION */}
                        <header className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className={`inline-flex items-center rounded-xl px-3.5 py-1 text-xs font-extrabold tracking-wide uppercase ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.darkBg} ${categoryStyle.darkText}`}
                                >
                                    {article.category}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-navy-500 dark:text-navy-400">
                                    <Clock className="h-3.5 w-3.5 text-pastel-teal" />
                                    {readTime} min baca
                                </span>
                            </div>

                            <h1 className="text-2xl font-black tracking-tight text-navy-900 dark:text-navy-100 sm:text-3xl lg:text-4xl">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-navy-100 py-3.5 dark:border-navy-800">
                                <div className="flex items-center gap-4 text-xs text-navy-600 dark:text-navy-300">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pastel-teal/15 text-pastel-teal font-bold">
                                            <User className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-navy-900 dark:text-navy-100">
                                                {article.author?.name || 'Redaksi Desa Samirono'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-navy-300 dark:text-navy-700">•</span>
                                    <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400">
                                        <Calendar className="h-3.5 w-3.5 text-pastel-teal" />
                                        <span>{formatDate(article.published_at || article.created_at)}</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 py-1.5 text-xs font-bold text-navy-700 shadow-2xs transition-all hover:bg-navy-50 dark:border-navy-700 dark:bg-navy-900 dark:text-navy-200 dark:hover:bg-navy-800"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-emerald-600 dark:text-emerald-400">Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-3.5 w-3.5 text-pastel-teal" />
                                            <span>Bagikan</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </header>

                        {/* COVER IMAGE BANNER */}
                        <div className="overflow-hidden rounded-3xl border border-navy-200/80 bg-navy-100 shadow-sm dark:border-navy-800 dark:bg-navy-900">
                            <img
                                src={article.cover_image || DEFAULT_COVER}
                                alt={article.title}
                                className="max-h-[460px] w-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_COVER;
                                }}
                            />
                        </div>

                        {/* EXCERPT CALLOUT (if present) */}
                        {article.excerpt && (
                            <div className="rounded-2xl border-l-4 border-pastel-teal bg-pastel-teal/10 p-4.5 text-sm font-medium italic leading-relaxed text-navy-800 dark:bg-navy-900 dark:text-navy-200">
                                "{article.excerpt}"
                            </div>
                        )}

                        {/* ARTICLE BODY CONTENT */}
                        <div
                            className="prose prose-navy max-w-none text-navy-800 leading-relaxed dark:prose-invert dark:text-navy-200 prose-headings:font-bold prose-headings:text-navy-900 dark:prose-headings:text-navy-100 prose-a:text-pastel-teal hover:prose-a:underline prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </article>

                    {/* SIDEBAR: RECENT ARTICLES */}
                    <aside className="space-y-6 lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="rounded-3xl border border-navy-200/80 bg-white p-6 shadow-xs dark:border-navy-800 dark:bg-navy-900">
                                <div className="flex items-center gap-2 border-b border-navy-100 pb-4 dark:border-navy-800">
                                    <Newspaper className="h-5 w-5 text-pastel-teal" />
                                    <h3 className="text-base font-bold text-navy-900 dark:text-navy-100">
                                        Artikel Terbaru Lainnya
                                    </h3>
                                </div>

                                {recentArticles.length > 0 ? (
                                    <div className="mt-4 divide-y divide-navy-100 dark:divide-navy-800">
                                        {recentArticles.map((recent) => (
                                            <Link
                                                key={recent.id}
                                                href={`/articles/${recent.slug}`}
                                                className="group flex items-start gap-3.5 py-3.5 transition-all"
                                            >
                                                <img
                                                    src={recent.cover_image || DEFAULT_COVER}
                                                    alt={recent.title}
                                                    className="h-16 w-16 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = DEFAULT_COVER;
                                                    }}
                                                />
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-pastel-teal uppercase">
                                                        {recent.category}
                                                    </span>
                                                    <h4 className="line-clamp-2 text-xs font-bold text-navy-900 transition-colors group-hover:text-pastel-teal dark:text-navy-100">
                                                        {recent.title}
                                                    </h4>
                                                    <span className="text-[10px] text-navy-400">
                                                        {formatDate(recent.published_at || recent.created_at)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-4 text-xs text-navy-500 dark:text-navy-400">
                                        Belum ada artikel terbaru lainnya.
                                    </p>
                                )}

                                <div className="mt-6 pt-4 border-t border-navy-100 dark:border-navy-800">
                                    <Link
                                        href="/articles"
                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-pastel-teal/30 bg-pastel-teal/10 py-2.5 text-xs font-extrabold text-pastel-teal transition-all hover:bg-pastel-teal/20"
                                    >
                                        <span>Lihat Semua Artikel</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </MarketplaceLayout>
    );
}
