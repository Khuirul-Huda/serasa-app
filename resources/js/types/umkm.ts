/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
    id: string;
    shopId: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    image: string;
    images?: string[];
    categoryId: string;
    rating: number;
    reviewsCount: number;
    isAvailable: boolean;
    createdAt?: string;
}

export interface Shop {
    id: string;
    name: string;
    ownerName: string;
    description: string;
    category: string;
    phone: string | null;
    address: string;
    dusun: string;
    image: string;
    logo: string;
    isVerified: boolean;
    lat: number | null;
    lng: number | null;
    jamKerja?: string;
    userId?: number | null;
    nib?: boolean;
    halal?: boolean;
    pirt?: boolean;
}

export interface Category {
    id: string;
    name: string;
    iconName: string;
    description: string;
    color: string;
}

export interface HotSearchItem {
    label: string;
    query: string;
}

export interface PromoSlideItem {
    id: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    badge: string;
    btnQuery: string;
}

export interface AppSettings {
    appName: string;
    tagline: string;
    villageName: string;
    description: string;
    adminPhone: string;
    heroBanner: string;
    hotSearches?: HotSearchItem[];
    promoSlides?: PromoSlideItem[];
}

export interface Review {
    id: string;
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    date?: string;
    createdAt?: string;
}

export type UserRole = 'guest' | 'owner' | 'admin';
