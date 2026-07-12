/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Head } from "@inertiajs/react";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import ShopMap from "@/components/ShopMap";
import { AppSettings, Category, Product, Shop } from "@/types";

interface MapPageProps {
  settings: AppSettings;
  categories: Category[];
  shops: Shop[];
  products: Product[];
}

export default function MapPage({
  settings,
  categories,
  shops,
  products,
}: MapPageProps) {
  return (
    <MarketplaceLayout
      settings={settings}
      categories={categories}
      products={products}
      activeTab="map"
    >
      <Head title={`Peta Geografis UMKM - ${settings.appName}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ShopMap shops={shops} />
      </div>
    </MarketplaceLayout>
  );
}
