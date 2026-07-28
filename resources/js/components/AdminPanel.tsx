/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useForm, router, Link } from "@inertiajs/react";
import { ShieldCheck, Activity, Store, Settings } from "lucide-react";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import type { AppSettings, Shop, Product, Category } from "@/types";
import StatsTab from "./admin/StatsTab";
import ShopsTab from "./admin/ShopsTab";
import ConfigTab from "./admin/ConfigTab";
import ImportModal, { ParsedImportRow } from "./admin/ImportModal";

interface AdminPanelProps {
  settings: AppSettings;
  shops: Shop[];
  products: Product[];
  categories: Category[];
}

export default function AdminPanel({
  settings,
  shops,
  products,
  categories,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "shops" | "config">("stats");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchShopQuery, setSearchShopQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending">("all");

  // Excel Import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importRows, setImportRows] = useState<ParsedImportRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmittingImport, setIsSubmittingImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inertia Form for app settings
  const { data, setData, post, processing } = useForm({
    appName: settings.appName,
    tagline: settings.tagline,
    villageName: settings.villageName,
    description: settings.description,
    adminPhone: settings.adminPhone,
    heroBanner: settings.heroBanner,
  });

  const totalShops = shops.length;
  const verifiedShops = shops.filter((s) => s.isVerified).length;
  const pendingShops = totalShops - verifiedShops;

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/settings", {
      onSuccess: () => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      },
    });
  };

  // Excel Parsing logic
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (rawData.length < 2) {
          alert("File Excel kosong atau tidak sesuai format.");
          setIsParsing(false);
          return;
        }

        const parsed: ParsedImportRow[] = [];

        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0 || !row[0]) continue;

          const ownerName = String(row[0] || "").trim();
          const address = String(row[1] || "").trim();
          const dusunRaw = String(row[2] || "").trim();
          const phoneRaw = String(row[3] || "").trim();
          const shopName = String(row[4] || "").trim();
          const categoryRaw = String(row[5] || "").trim();
          const nib = String(row[6] || "").toLowerCase() === "v" || String(row[6] || "").toLowerCase() === "ya";
          const halal = String(row[7] || "").toLowerCase() === "v" || String(row[7] || "").toLowerCase() === "ya";
          const pirt = String(row[8] || "").toLowerCase() === "v" || String(row[8] || "").toLowerCase() === "ya";

          if (!shopName || !ownerName) continue;

          let dusun = "Dusun Samirono";
          if (dusunRaw.toLowerCase().includes("bentar")) dusun = "Dusun Bentar";
          else if (dusunRaw.toLowerCase().includes("surowono")) dusun = "Dusun Surowono";
          else if (dusunRaw.toLowerCase().includes("tawang")) dusun = "Dusun Tawang";

          let phone = phoneRaw.replace(/[^0-9]/g, "");
          if (phone.startsWith("0")) phone = "62" + phone.slice(1);
          if (!phone) phone = "6285725900000";

          let category = "Kuliner & Olahan";
          if (categoryRaw.toLowerCase().includes("susu")) category = "Kuliner & Olahan";
          else if (categoryRaw.toLowerCase().includes("kerajinan") || categoryRaw.toLowerCase().includes("kriya")) category = "Kerajinan & Kriya";
          else if (categoryRaw.toLowerCase().includes("tani") || categoryRaw.toLowerCase().includes("segar")) category = "Hasil Tani Segar";

          const conflictShop = shops.find(
            (s) =>
              s.name.toLowerCase().includes(shopName.toLowerCase()) ||
              shopName.toLowerCase().includes(s.name.toLowerCase()) ||
              (s.ownerName.toLowerCase() === ownerName.toLowerCase() && ownerName !== "")
          );

          parsed.push({
            rowNum: i + 1,
            ownerName,
            address: address || `Dusun ${dusun}`,
            dusun,
            phone,
            name: shopName,
            category,
            nib,
            halal,
            pirt,
            isConflict: !!conflictShop,
            conflictShopName: conflictShop?.name,
            action: conflictShop ? "skip" : "import",
          });
        }

        setImportRows(parsed);
      } catch (err) {
        console.error("Gagal membaca Excel:", err);
        alert("Terjadi kesalahan membaca file Excel. Pastikan format valid.");
      } finally {
        setIsParsing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleToggleRowAction = (rowNum: number) => {
    setImportRows((prev) =>
      prev.map((r) =>
        r.rowNum === rowNum
          ? { ...r, action: r.action === "import" ? "skip" : "import" }
          : r
      )
    );
  };

  const handleSubmitImport = () => {
    const toImport = importRows.filter((r) => r.action === "import");

    if (toImport.length === 0) {
      alert("Pilih setidaknya 1 baris toko untuk diimpor.");
      return;
    }

    setIsSubmittingImport(true);

    router.post(
      "/admin/shops/import",
      { shops: toImport },
      {
        onSuccess: () => {
          setIsSubmittingImport(false);
          setIsImportModalOpen(false);
          setImportRows([]);
          alert(`Berhasil mengimpor data UMKM!`);
        },
        onError: () => {
          setIsSubmittingImport(false);
          alert("Gagal mengimpor data toko. Periksa kembali format data.");
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-8 animate-fade-in font-sans text-navy-900" id="admin-workspace">
      {/* Vercel-Style Premium Header Section */}
      <div className="bg-white border-b border-navy-200/60 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-pastel-peach-light border border-pastel-peach/20 flex items-center justify-center text-pastel-peach shrink-0 shadow-3xs">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black uppercase tracking-tight text-navy-900 leading-none">
                  Panel Administrator Desa
                </h2>
                <span className="px-2.5 py-0.5 bg-pastel-teal-light text-pastel-teal border border-pastel-teal/20 font-black uppercase text-[8px] tracking-wider rounded-md">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-navy-500 font-normal">
                Pusat kendali verifikasi toko warga, statistik ekonomi, dan konfigurasi platform {settings.appName}.
              </p>
            </div>
          </div>
        </div>

        {/* Flat Underlined Tab Switcher */}
        <div className="flex space-x-6 border-b border-navy-200 pt-2 shrink-0">
          <button
            onClick={() => setActiveSubTab("stats")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "stats"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Statistik Ekonomi</span>
          </button>
          <button
            onClick={() => setActiveSubTab("shops")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "shops"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kelola UMKM ({totalShops})</span>
            {pendingShops > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-pastel-peach text-navy-900 text-[8px] font-black rounded-full">
                {pendingShops}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab("config")}
            className={`pb-3 px-1 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "config"
                ? "border-pastel-teal text-pastel-teal"
                : "border-transparent text-navy-400 hover:text-navy-700 hover:border-navy-300"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Konfigurasi Platform</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeSubTab === "stats" && (
        <StatsTab
          shops={shops}
          products={products}
          categories={categories}
        />
      )}

      {activeSubTab === "shops" && (
        <ShopsTab
          shops={shops}
          searchQuery={searchShopQuery}
          setSearchQuery={setSearchShopQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onOpenImportModal={() => setIsImportModalOpen(true)}
        />
      )}

      {activeSubTab === "config" && (
        <ConfigTab
          settings={settings}
          data={data}
          setData={setData}
          onSubmit={handleConfigSubmit}
          processing={processing}
          saveSuccess={saveSuccess}
        />
      )}

      {/* Excel Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportRows([]);
        }}
        importRows={importRows}
        isParsing={isParsing}
        isSubmittingImport={isSubmittingImport}
        fileInputRef={fileInputRef}
        onFileUpload={handleFileUpload}
        onToggleAction={handleToggleRowAction}
        onSubmitImport={handleSubmitImport}
      />
    </div>
  );
}
