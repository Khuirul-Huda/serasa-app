/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Save, CheckCircle2, Eye, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppSettings } from "@/types";

interface ConfigTabProps {
  settings: AppSettings;
  data: {
    appName: string;
    tagline: string;
    villageName: string;
    description: string;
    adminPhone: string;
    heroBanner: string;
  };
  setData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  processing: boolean;
  saveSuccess: boolean;
}

export default function ConfigTab({
  settings,
  data,
  setData,
  onSubmit,
  processing,
  saveSuccess,
}: ConfigTabProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="admin-config-subtab">
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 shadow-3xs max-w-3xl mx-auto space-y-6">
        <div className="border-b border-navy-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">
              Identitas & Parameter Global Platform
            </h3>
            <p className="text-xs text-navy-500 mt-0.5">
              Atur judul situs, nomor kontak helpline desa, dan deskripsi publik portal etalase.
            </p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 text-xs">
          {saveSuccess && (
            <div className="p-4 bg-pastel-teal-light border border-pastel-teal/20 text-pastel-teal font-bold rounded-xl flex items-center gap-2 animate-fade-in uppercase tracking-wider text-[10px] shadow-3xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-pastel-teal" />
              Konfigurasi Platform Berhasil Diperbarui!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
                Nama Aplikasi Portal
              </Label>
              <Input
                type="text"
                required
                value={data.appName}
                onChange={(e) => setData("appName", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
                Nama Wilayah Desa
              </Label>
              <Input
                type="text"
                required
                value={data.villageName}
                onChange={(e) => setData("villageName", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
                Slogan / Tagline Portal
              </Label>
              <Input
                type="text"
                required
                value={data.tagline}
                onChange={(e) => setData("tagline", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
              />
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
                No. WA Helpline Admin Desa
              </Label>
              <Input
                type="text"
                required
                placeholder="6285725900000"
                value={data.adminPhone}
                onChange={(e) => setData("adminPhone", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
              URL Banner Utama (Hero Banner)
            </Label>
            <Input
              type="text"
              required
              value={data.heroBanner}
              onChange={(e) => setData("heroBanner", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal"
            />
          </div>

          <div className="space-y-1">
            <Label className="font-bold text-navy-400 uppercase tracking-wider text-[9px] block">
              Deskripsi Singkat Portal Desa
            </Label>
            <textarea
              rows={3}
              required
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-medium focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-navy-100">
            <Button
              type="submit"
              disabled={processing}
              className="px-6 h-10 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-widest text-[10px] rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? "Menyimpan..." : "Simpan Perubahan Global"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 shadow-3xs max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-navy-400">
          <Eye className="w-4 h-4 text-pastel-teal" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Pratinjau Hasil Konfigurasi Header
          </span>
        </div>

        <div className="bg-navy-900 rounded-2xl p-6 text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pastel-teal animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-navy-300">
              {data.villageName || "Desa Samirono"}
            </span>
          </div>

          <h4 className="text-xl font-black uppercase tracking-tight text-white">
            {data.appName || "SAMIRONO ETALASE"}
          </h4>

          <p className="text-xs text-pastel-peach font-bold">
            {data.tagline || "Sentra Komoditas Warga"}
          </p>

          <p className="text-[11px] text-navy-300 leading-relaxed font-normal max-w-lg">
            {data.description || "Deskripsi portal..."}
          </p>
        </div>
      </div>
    </div>
  );
}
