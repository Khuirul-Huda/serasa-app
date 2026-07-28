/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, Sparkles, User } from "lucide-react";

type Props = {
  status?: string;
  canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/login");
  };

  const handleDemoLogin = (role: "owner" | "admin") => {
    const email = role === "owner" 
      ? "owner@serasa.levitation.web.id" 
      : "admin@serasa.levitation.web.id";
    const password = "password";
    
    // Direct submission via router to bypass state batching latency
    router.post("/login", { email, password, remember: true });
  };

  return (
    <>
      <Head title="Masuk ke Portal - SAMIRONO ETALASE" />

      <div className="space-y-6 font-sans text-navy-900">
        
        {/* Branding header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-pastel-teal text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Store className="w-5.5 h-5.5 text-white" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight text-navy-900 leading-none">
            SAMIRONO <span className="text-pastel-teal">ETALASE</span>
          </h2>
          <span className="text-[9px] text-navy-400 font-bold uppercase tracking-widest block font-mono">
            Platform Ekonomi Warga
          </span>
        </div>

        {/* Demo Mode Quick Access Card */}
        <div className="bg-pastel-teal-light/30 border border-pastel-teal/20 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-navy-900">
            <Sparkles className="w-4 h-4 text-pastel-teal fill-pastel-teal/20 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider">Akses Cepat (Demo Mode)</span>
          </div>
          <p className="text-[10px] text-navy-500 leading-normal">
            Klik tombol di bawah untuk masuk secara instan menggunakan akun demonstrasi yang telah disiapkan.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("owner")}
              className="py-2.5 px-3 bg-white hover:bg-pastel-teal-light border border-pastel-teal/20 hover:border-pastel-teal rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer shadow-3xs group"
            >
              <Store className="w-4 h-4 text-pastel-teal group-hover:scale-110 transition-transform" />
              <span className="text-[9.5px] font-extrabold text-navy-800 uppercase tracking-tight">Owner Toko</span>
              <span className="text-[8px] text-navy-400 font-medium">owner@serasa...</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="py-2.5 px-3 bg-white hover:bg-pastel-peach-light border border-pastel-peach/30 hover:border-pastel-peach rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer shadow-3xs group"
            >
              <ShieldCheck className="w-4 h-4 text-pastel-peach group-hover:scale-110 transition-transform" />
              <span className="text-[9.5px] font-extrabold text-navy-800 uppercase tracking-tight">Admin Desa</span>
              <span className="text-[8px] text-navy-400 font-medium">admin@serasa...</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-navy-200/60"></div>
          <span className="flex-shrink mx-4 text-[9px] text-navy-400 font-bold uppercase tracking-widest font-mono">Atau Manual</span>
          <div className="flex-grow border-t border-navy-200/60"></div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5 text-xs">
          
          <div className="space-y-1">
            <Label htmlFor="email" className="font-bold text-navy-400 uppercase tracking-wider text-[9px]">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs"
            />
            <InputError message={errors.email} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-bold text-navy-400 uppercase tracking-wider text-[9px]">Kata Sandi</Label>
              {canResetPassword && (
                <Link
                  href="/forgot-password"
                  className="text-[9.5px] font-bold text-pastel-teal hover:underline"
                >
                  Lupa Sandi?
                </Link>
              )}
            </div>
            <PasswordInput
              id="password"
              required
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs"
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center gap-2 select-none">
            <Checkbox
              id="remember"
              checked={data.remember}
              onCheckedChange={(val) => setData("remember", !!val)}
              className="border-navy-300 text-pastel-teal focus:ring-pastel-teal"
            />
            <label htmlFor="remember" className="text-[11px] font-medium text-navy-600 cursor-pointer">
              Ingat akun saya
            </label>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-3xs"
          >
            {processing ? "Memproses..." : "Masuk ke Sistem"}
          </Button>

        </form>

        <div className="text-center text-[11px] text-navy-400 font-medium">
          Belum memiliki akun warga?{" "}
          <Link href="/register" className="text-pastel-teal font-bold hover:underline">
            Daftar Baru
          </Link>
        </div>

      </div>

      {status && (
        <div className="mt-4 p-3 bg-pastel-mint-light border border-pastel-mint/20 rounded-xl text-center text-xs font-semibold text-pastel-mint">
          {status}
        </div>
      )}
    </>
  );
}

Login.layout = {
  title: "Masuk ke Akun",
  description: "Masukkan kredensial terdaftar untuk mengelola etalase digital Anda.",
};
