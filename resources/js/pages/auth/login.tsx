/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, Sparkles } from "lucide-react";

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
    
    router.post("/login", { email, password, remember: true });
  };

  return (
    <>
      <Head title="Masuk ke Portal UMKM" />

      <div className="space-y-6 font-sans text-navy-900">
        {/* Demo Mode Quick Access Card */}
        <div className="bg-pastel-teal-light/30 border border-pastel-teal/20 rounded-2xl p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-navy-900">
            <Sparkles className="w-4 h-4 text-pastel-teal fill-pastel-teal/20 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider">Akses Cepat (Demo Mode)</span>
          </div>
          <p className="text-xs text-navy-600 leading-relaxed font-normal">
            Klik tombol di bawah untuk masuk secara instan menggunakan akun demonstrasi yang telah disiapkan.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin("owner")}
              className="py-3 px-3 bg-white hover:bg-pastel-teal-light border border-pastel-teal/20 hover:border-pastel-teal rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer shadow-3xs group"
            >
              <Store className="w-4.5 h-4.5 text-pastel-teal group-hover:scale-110 transition-transform" />
              <span className="text-xs font-extrabold text-navy-800 uppercase tracking-tight">Owner Toko</span>
              <span className="text-[10px] text-navy-400 font-medium">owner@serasa...</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="py-3 px-3 bg-white hover:bg-pastel-peach-light border border-pastel-peach/30 hover:border-pastel-peach rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer shadow-3xs group"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-pastel-peach group-hover:scale-110 transition-transform" />
              <span className="text-xs font-extrabold text-navy-800 uppercase tracking-tight">Admin Desa</span>
              <span className="text-[10px] text-navy-400 font-medium">admin@serasa...</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-navy-200/60"></div>
          <span className="flex-shrink mx-4 text-xs text-navy-400 font-bold uppercase tracking-widest font-mono">Atau Manual</span>
          <div className="flex-grow border-t border-navy-200/60"></div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
            />
            <InputError message={errors.email} />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-bold text-navy-500 uppercase tracking-wider text-xs">Kata Sandi</Label>
              {canResetPassword && (
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-pastel-teal hover:underline"
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
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center gap-2 select-none pt-1">
            <Checkbox
              id="remember"
              checked={data.remember}
              onCheckedChange={(val) => setData("remember", !!val)}
              className="border-navy-300 text-pastel-teal focus:ring-pastel-teal"
            />
            <label htmlFor="remember" className="text-xs font-medium text-navy-600 cursor-pointer">
              Ingat akun saya
            </label>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-3xs mt-2"
          >
            {processing ? "Memproses..." : "Masuk ke Akun Toko"}
          </Button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-navy-400 font-medium">
          Belum memiliki akun toko?{" "}
          <Link
            href="/register"
            className="text-pastel-teal font-bold hover:underline"
          >
            Daftarkan Toko UMKM Baru
          </Link>
        </div>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-pastel-teal-light border border-pastel-teal/20 rounded-xl text-center text-xs font-semibold text-pastel-teal">
          {status}
        </div>
      )}
    </>
  );
}
