/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Head } from "@inertiajs/react";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import AdminPanel from "@/components/AdminPanel";
import { AppSettings, Category, Product, Shop } from "@/types";

interface AdminDashboardProps {
  settings: AppSettings;
  shops: Shop[];
  products: Product[];
  categories: Category[];
}

export default function AdminDashboard({
  settings,
  shops,
  products,
  categories,
}: AdminDashboardProps) {
  // Use products as allProducts to satisfy layout navbar parameters
  return (
    <MarketplaceLayout
      settings={settings}
      categories={categories}
      products={products}
      activeTab="admin"
    >
      <Head title={`Panel Admin Desa - ${settings.appName}`} />
      
      <div className="max-w-7xl mx-auto py-4">
        <AdminPanel
          settings={settings}
          shops={shops}
          products={products}
          categories={categories}
        />
      </div>
    </MarketplaceLayout>
  );
}
