/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Save, CheckCircle2, Eye, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-config-subtab">
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs max-w-4xl mx-auto space-y-6">
        <div className="border-b border-navy-100 pb-4 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider">
              Identitas & Parameter Global Platform
            </h3>
            <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
              Atur judul situs, nomor kontak helpline desa, dan deskripsi publik portal etalase.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center shrink-0 border border-pastel-teal/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 text-xs sm:text-sm">
          {saveSuccess && (
            <div className="p-4 bg-pastel-teal-light border border-pastel-teal/20 text-pastel-teal font-bold rounded-2xl flex items-center gap-2.5 animate-fade-in uppercase tracking-wider text-xs shadow-3xs">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-pastel-teal" />
              <span>Konfigurasi Platform Berhasil Diperbarui Ke Database!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                Nama Aplikasi Portal
              </Label>
              <Input
                type="text"
                required
                value={data.appName}
                onChange={(e) => setData("appName", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                Nama Wilayah Desa
              </Label>
              <Input
                type="text"
                required
                value={data.villageName}
                onChange={(e) => setData("villageName", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                Slogan / Tagline Portal
              </Label>
              <Input
                type="text"
                required
                value={data.tagline}
                onChange={(e) => setData("tagline", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
                No. WA Helpline Admin Desa
              </Label>
              <Input
                type="text"
                required
                placeholder="6285725900000"
                value={data.adminPhone}
                onChange={(e) => setData("adminPhone", e.target.value)}
                className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
              URL Banner Utama (Hero Banner)
            </Label>
            <Input
              type="text"
              required
              value={data.heroBanner}
              onChange={(e) => setData("heroBanner", e.target.value)}
              className="rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold text-navy-500 uppercase tracking-wider text-xs block">
              Deskripsi Singkat Portal Desa
            </Label>
            <textarea
              rows={3}
              required
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-normal focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal resize-none transition-all shadow-3xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-navy-100">
            <Button
              type="submit"
              disabled={processing}
              className="px-6 h-11 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-widest text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              {processing ? <Spinner /> : <Save className="w-4 h-4" />}
              <span>{processing ? "Menyimpan..." : "Simpan Perubahan Global"}</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white border border-navy-200/60 rounded-3xl p-6 sm:p-8 shadow-3xs max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-navy-600">
          <Eye className="w-4.5 h-4.5 text-pastel-teal" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
            Pratinjau Tampilan Header Platform
          </span>
        </div>

        <div className="bg-navy-900 rounded-3xl p-6 sm:p-8 text-white space-y-3 relative overflow-hidden shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pastel-teal animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-navy-300">
              {data.villageName || "Desa Samirono"}
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            {data.appName || "SAMIRONO ETALASE"}
          </h4>

          <p className="text-xs sm:text-sm text-pastel-peach font-extrabold uppercase tracking-wider">
            {data.tagline || "Sentra Komoditas Warga"}
          </p>

          <p className="text-xs sm:text-sm text-navy-300 leading-relaxed font-normal max-w-xl">
            {data.description || "Deskripsi portal..."}
          </p>
        </div>
      </div>
    </div>
  );
}
