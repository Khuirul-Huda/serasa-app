/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from "react";
import { Form, Head, Link } from "@inertiajs/react";
import { LoaderCircle, Store } from "lucide-react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/routes";
import { email } from "@/routes/password";

export default function ForgotPassword({ status }: { status?: string }) {
  return (
    <>
      <Head title="Lupa Sandi - SAMIRONO ETALASE" />

      {status && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs font-semibold text-emerald-800">
          {status}
        </div>
      )}

      <div className="space-y-6 font-sans">
        
        {/* Branding header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Store className="w-5.5 h-5.5 text-white" />
          </div>
          <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 leading-none">
            SAMIRONO <span className="text-emerald-700">ETALASE</span>
          </h2>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block font-mono">
            Platform Ekonomi Warga
          </span>
        </div>

        <Form {...email.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-4.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="email" className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    autoFocus
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-250 focus:border-emerald-600 focus:ring-emerald-500/10 transition-all text-xs"
                  />
                  <InputError message={errors.email} />
                </div>

                <Button
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer disabled:opacity-50 transition-all"
                  disabled={processing}
                >
                  {processing && (
                    <LoaderCircle className="h-4 w-4 animate-spin text-white" />
                  )}
                  Kirim Tautan Pemulihan
                </Button>
              </div>
            </>
          )}
        </Form>

        <div className="text-center text-[11px] text-gray-400 font-medium">
          Kembali ke halaman{" "}
          <Link href={login()} className="text-emerald-700 font-bold hover:underline">
            Masuk
          </Link>
        </div>
      </div>
    </>
  );
}

ForgotPassword.layout = {
  title: "Lupa Kata Sandi",
  description: "Masukkan email terdaftar Anda untuk menerima tautan pemulihan kata sandi.",
};
