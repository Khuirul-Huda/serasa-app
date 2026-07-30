/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Head, usePage } from '@inertiajs/react';
import React from 'react';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'product';
    siteName?: string;
}

export default function SEOHead({
    title,
    description,
    keywords = 'UMKM Desa Samirono, Susu Sapi Murni Samirono, Kerajinan Anyaman Bambu, Sentra Industri Kreatif, Kuliner Lokal Getasan, Kabupaten Semarang, Produk Ekonomi Warga',
    image,
    url,
    type = 'website',
    siteName,
}: SEOHeadProps) {
    const { settings } = usePage().props as any;
    const resolvedSiteName =
        siteName || settings?.appName || 'Etalase UMKM Digital';
    const canonicalUrl =
        url ||
        (typeof window !== 'undefined'
            ? window.location.origin + window.location.pathname
            : 'https://serasa.levitation.web.id/');

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={canonicalUrl} />

            {/* OpenGraph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={resolvedSiteName} />
            <meta property="og:type" content={type} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Head>
    );
}
