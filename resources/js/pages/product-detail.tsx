/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Star,
    Phone,
    CheckCircle2,
    ShoppingCart,
    MessageSquare,
    Send,
    MapPin,
    ChevronRight,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import type { AppSettings, Category, Product, Shop, Review } from '@/types';
import { formatIDR, getWhatsAppLink } from '@/utils';

interface ProductDetailProps {
    settings: AppSettings;
    categories: Category[];
    product: Product;
    shop: Shop;
    reviews?: Review[];
    allProducts?: Product[];
}

export default function ProductDetail({
    settings,
    categories,
    product,
    shop,
    reviews = [],
    allProducts = [],
}: ProductDetailProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const category = categories.find((c) => c.id === product.categoryId);

    const productReviews =
        reviews.length > 0 ? reviews : (product as any).reviews || [];

    // Review form submission setup
    const { data, setData, post, processing, errors, reset } = useForm({
        userName: user?.name || '',
        rating: 5,
        comment: '',
    });

    const handleContactWhatsApp = () => {
        if (!shop.phone) {
            return;
        }

        const message = `Halo ${shop.ownerName} dari ${shop.name}, saya melihat produk digital Anda "${product.name}" di platform SERASA Desa Samirono dan tertarik untuk membeli.`;
        const url = getWhatsAppLink(shop.phone, message);

        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/products/${product.id}/reviews`, {
            onSuccess: () => {
                toast.success('Ulasan Anda berhasil dikirim dan diterbitkan!');
                reset('comment');
            },
            onError: () => {
                toast.error(
                    'Gagal mengirim ulasan. Periksa kembali isian formulir.',
                );
            },
        });
    };

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={allProducts}
            activeTab="katalog"
        >
            <SEOHead
                title={`${product.name} - ${shop.name} Samirono`}
                description={`Spesifikasi dan ulasan untuk ${product.name} seharga Rp${product.price.toLocaleString('id-ID')} dari ${shop.name} Desa Samirono.`}
                keywords={`${product.name}, ${product.name} Samirono, Produk ${shop.name}, Beli ${product.name}, Harga ${product.name}`}
                image={product.image}
                url={`https://serasa.levitation.web.id/products/${product.id}`}
                type="product"
                siteName={settings.appName}
            />

            <div className="mx-auto max-w-7xl animate-fade-in space-y-8 px-4 py-8 font-sans text-navy-900 sm:px-6 lg:px-8">
                {/* Breadcrumb Nav */}
                <nav
                    aria-label="Breadcrumb"
                    className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 text-xs font-medium text-navy-500"
                >
                    <Link
                        href="/"
                        className="shrink-0 font-bold transition-colors hover:text-pastel-teal"
                    >
                        Beranda
                    </Link>
                    <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-navy-300"
                        aria-hidden="true"
                    />
                    <Link
                        href="/shops"
                        className="shrink-0 font-bold transition-colors hover:text-pastel-teal"
                    >
                        Daftar UMKM
                    </Link>
                    <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-navy-300"
                        aria-hidden="true"
                    />
                    <Link
                        href={`/shops/${shop.id}`}
                        className="max-w-45 shrink-0 truncate font-bold transition-colors hover:text-pastel-teal"
                    >
                        {shop.name}
                    </Link>
                    <ChevronRight
                        className="h-3.5 w-3.5 shrink-0 text-navy-300"
                        aria-hidden="true"
                    />
                    <span className="max-w-50 shrink-0 truncate font-bold text-navy-800">
                        {product.name}
                    </span>
                </nav>

                {/* Master Product Specifications Box */}
                <article className="shadow-3xs grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8 md:grid-cols-12">
                    {/* Left Column: Product Image (Column span 5) */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-navy-200/60 bg-navy-50 md:col-span-5">
                        <img
                            src={product.image}
                            alt={product.name}
                            width={500}
                            height={500}
                            loading="eager"
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        {!product.isAvailable && (
                            <div className="backdrop-blur-3xs absolute inset-0 flex items-center justify-center bg-navy-900/80">
                                <span className="rounded-full border border-pastel-coral/80 bg-pastel-coral px-5 py-2 text-xs font-extrabold tracking-widest text-white uppercase">
                                    Stok Habis
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Specs & Actions (Column span 7) */}
                    <div className="flex flex-col justify-between space-y-6 md:col-span-7">
                        {/* Title / Badges */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {category && (
                                    <span className="rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-3 py-1 text-xs font-black tracking-wider text-pastel-teal uppercase">
                                        {category.name}
                                    </span>
                                )}
                                <span className="flex items-center gap-1 rounded-lg border border-navy-200/60 bg-navy-100 px-3 py-1 text-xs font-bold tracking-wider text-navy-700 uppercase">
                                    <MapPin className="h-3.5 w-3.5 text-pastel-peach" />
                                    <span>{shop.dusun}</span>
                                </span>
                                {shop.nib && (
                                    <span className="rounded-lg border border-pastel-lavender/20 bg-pastel-lavender-light px-2.5 py-1 text-xs font-black text-pastel-lavender uppercase">
                                        Izin NIB
                                    </span>
                                )}
                                {shop.halal && (
                                    <span className="rounded-lg border border-pastel-teal/20 bg-pastel-teal-light px-2.5 py-1 text-xs font-black text-pastel-teal uppercase">
                                        Sertifikat Halal
                                    </span>
                                )}
                                {shop.pirt && (
                                    <span className="rounded-lg border border-pastel-peach/20 bg-pastel-peach-light px-2.5 py-1 text-xs font-black text-pastel-peach uppercase">
                                        Izin P-IRT
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl leading-tight font-black tracking-tight text-navy-900 sm:text-2xl">
                                {product.name}
                            </h1>

                            {/* Shop Badge Link */}
                            <div className="flex items-center gap-2 pt-0.5">
                                <img
                                    src={shop.logo}
                                    alt={shop.name}
                                    width={20}
                                    height={20}
                                    loading="eager"
                                    className="h-5 w-5 rounded-full border border-navy-200 object-cover"
                                    referrerPolicy="no-referrer"
                                />
                                <Link
                                    href={`/shops/${shop.id}`}
                                    className="flex cursor-pointer items-center gap-1 text-xs font-bold text-navy-600 hover:text-pastel-teal hover:underline"
                                >
                                    <span>{shop.name}</span>
                                    {shop.isVerified && (
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-pastel-teal-light text-pastel-teal" />
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Price Segment */}
                        <div className="rounded-2xl border border-navy-200/60 bg-navy-50 p-4">
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                Harga Terdaftar
                            </span>
                            <div className="mt-1 flex items-baseline gap-1.5">
                                <data
                                    value={product.price}
                                    className="text-2xl font-black text-navy-900"
                                >
                                    {formatIDR(product.price)}
                                </data>
                                <span className="text-xs font-semibold text-navy-500">
                                    / {product.unit}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1 text-xs">
                            <span className="block text-xs font-extrabold tracking-wider text-navy-400 uppercase">
                                Uraian Produk
                            </span>
                            <p className="text-sm leading-relaxed font-normal text-navy-600">
                                {product.description}
                            </p>
                        </div>

                        {/* Call to Actions */}
                        <div className="grid grid-cols-1 gap-3 border-t border-navy-100 pt-4 sm:grid-cols-2">
                            <button
                                onClick={handleContactWhatsApp}
                                disabled={!product.isAvailable || !shop.phone}
                                className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all ${
                                    product.isAvailable && shop.phone
                                        ? 'cursor-pointer bg-pastel-coral text-white hover:bg-pastel-coral/90'
                                        : 'cursor-not-allowed bg-navy-200 text-navy-400'
                                } disabled:opacity-50`}
                            >
                                <Phone className="h-4 w-4 text-white" />
                                <span>{shop.phone ? 'Order via WhatsApp' : 'WA Belum Tersedia'}</span>
                            </button>

                            <Link
                                href={`/shops/${shop.id}`}
                                className="shadow-3xs flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white py-3 text-xs font-bold tracking-wider text-navy-700 uppercase transition-all hover:border-pastel-teal hover:text-pastel-teal"
                            >
                                <ShoppingCart className="h-4 w-4 text-pastel-teal" />
                                <span>Lihat Semua Produk Toko</span>
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Dynamic Reviews and Write a Review Segment */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left Column: Reviews List (Col span 7) */}
                    <section
                        className="shadow-3xs space-y-6 rounded-3xl border border-navy-200/60 bg-white p-6 lg:col-span-7"
                        aria-label="Ulasan Pembeli"
                    >
                        <div className="flex items-center justify-between border-b border-navy-100 pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-navy-900 uppercase">
                                    <MessageSquare
                                        className="h-4 w-4 text-pastel-teal"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        Ulasan Pembeli ({productReviews.length})
                                    </span>
                                </h2>
                            </div>
                            <div
                                className="flex items-center gap-1 text-xs font-bold text-navy-700"
                                aria-label={`Rating ${product.rating} dari 5`}
                            >
                                <Star
                                    className="h-4 w-4 fill-pastel-peach text-pastel-peach"
                                    aria-hidden="true"
                                />
                                <span>{product.rating} / 5.0</span>
                            </div>
                        </div>

                        {productReviews.length === 0 ? (
                            <div className="py-12 text-center text-xs text-navy-400 italic">
                                Belum ada ulasan untuk produk ini. Jadilah yang
                                pertama memberikan penilaian!
                            </div>
                        ) : (
                            <ol className="max-h-100 list-none divide-y divide-navy-100 overflow-y-auto p-0 pr-1">
                                {productReviews.map((rev: Review) => (
                                    <li
                                        key={rev.id}
                                        className="space-y-1.5 py-4 text-xs"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="text-sm font-bold text-navy-800">
                                                    {rev.userName}
                                                </span>
                                                <time
                                                    className="block text-xs font-medium text-navy-400"
                                                    dateTime={rev.createdAt}
                                                >
                                                    {rev.date || 'Baru Saja'}
                                                </time>
                                            </div>
                                            <div
                                                className="flex items-center gap-0.5 rounded border border-pastel-peach/20 bg-pastel-peach-light px-2 py-0.5 text-xs font-bold text-navy-800"
                                                aria-label={`Rating ${rev.rating} bintang`}
                                            >
                                                <Star
                                                    className="h-3.5 w-3.5 shrink-0 fill-pastel-peach text-pastel-peach"
                                                    aria-hidden="true"
                                                />
                                                <span>{rev.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed font-normal text-navy-600">
                                            {rev.comment}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>

                    {/* Right Column: Write a Review Form (Col span 5) */}
                    <div className="shadow-3xs space-y-4 self-start rounded-3xl border border-navy-200/60 bg-white p-6 lg:col-span-5">
                        <div>
                            <h3 className="text-sm font-bold tracking-wider text-navy-900 uppercase">
                                Tulis Ulasan Baru
                            </h3>
                            <p className="text-xs text-navy-400">
                                Berikan masukan atau kritik membangun bagi
                                produk kreatif Samirono.
                            </p>
                        </div>

                        {!user ? (
                            <div className="space-y-3 rounded-2xl border border-navy-200/60 bg-navy-50/60 p-5 text-center">
                                <MessageSquare className="mx-auto h-8 w-8 text-navy-300" />
                                <p className="text-sm font-medium text-navy-600">
                                    Masuk ke akun Anda untuk menulis ulasan produk ini.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-pastel-teal px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-xs transition-all hover:bg-pastel-teal/90"
                                >
                                    Masuk Sekarang
                                </Link>
                            </div>
                        ) : (
                        <form
                            onSubmit={handleReviewSubmit}
                            className="space-y-4 text-xs"
                        >
                            <input type="hidden" value={data.userName} />

                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-600 uppercase">
                                    Rating Bintang
                                </Label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            onMouseEnter={(e) => {
                                                const parent = e.currentTarget.parentElement;

                                                if (!parent) {
                                                    return;
                                                }

                                                parent.querySelectorAll('[data-star]').forEach((el) => {
                                                    const val = Number(el.getAttribute('data-star'));

                                                    el.classList.toggle('text-pastel-peach', val <= star);
                                                    el.classList.toggle('fill-pastel-peach', val <= star);
                                                    el.classList.toggle('text-navy-200', val > star);
                                                    el.classList.toggle('fill-navy-200', val > star);
                                                });
                                            }}
                                            onMouseLeave={(e) => {
                                                const parent = e.currentTarget.parentElement;

                                                if (!parent) {
                                                    return;
                                                }

                                                parent.querySelectorAll('[data-star]').forEach((el) => {
                                                    const val = Number(el.getAttribute('data-star'));

                                                    el.classList.toggle('text-pastel-peach', val <= data.rating);
                                                    el.classList.toggle('fill-pastel-peach', val <= data.rating);
                                                    el.classList.toggle('text-navy-200', val > data.rating);
                                                    el.classList.toggle('fill-navy-200', val > data.rating);
                                                });
                                            }}
                                            className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                                            aria-label={`${star} bintang`}
                                        >
                                            <Star
                                                data-star={star}
                                                className={`h-7 w-7 transition-colors ${
                                                    star <= data.rating
                                                        ? 'fill-pastel-peach text-pastel-peach'
                                                        : 'fill-navy-200 text-navy-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-xs font-bold text-navy-500">
                                        {data.rating === 5 && 'Sangat Puas'}
                                        {data.rating === 4 && 'Puas'}
                                        {data.rating === 3 && 'Biasa Saja'}
                                        {data.rating === 2 && 'Kurang'}
                                        {data.rating === 1 && 'Kecewa'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="block text-xs font-bold tracking-wider text-navy-600 uppercase">
                                    Tanggapan / Komentar
                                </Label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Ceritakan cita rasa keju, atau keawetan tas anyaman ini..."
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData('comment', e.target.value)
                                    }
                                    className="shadow-3xs w-full resize-none rounded-xl border border-navy-200/60 bg-white px-4 py-2 text-sm font-medium text-navy-800 transition-all outline-none focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                                />
                                {errors.comment && (
                                    <span className="font-semibold text-pastel-coral">
                                        {errors.comment}
                                    </span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-pastel-teal py-3 text-xs font-bold tracking-wider text-white uppercase shadow-xs hover:bg-pastel-teal/90 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4 text-white" />
                                <span>
                                    {processing
                                        ? 'Mengirim...'
                                        : 'Kirim Ulasan Sekarang'}
                                </span>
                            </Button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
