/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Head } from "@inertiajs/react";
import MarketplaceLayout from "@/layouts/marketplace-layout";
import AdminPanel from "@/components/AdminPanel";
import { AppSettings, Category, Product, Shop } from "@/types";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface AdminDashboardProps {
  settings: AppSettings;
  shops: Shop[];
  products: Product[];
  categories: Category[];
  reviews?: AdminReview[];
  users?: AdminUser[];
}

export default function AdminDashboard({
  settings,
  shops,
  products,
  categories,
  reviews = [],
  users = [],
}: AdminDashboardProps) {
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
          reviews={reviews}
          users={users}
        />
      </div>
    </MarketplaceLayout>
  );
}
