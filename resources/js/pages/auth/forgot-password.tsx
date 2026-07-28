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
        <div className="mb-4 p-3 bg-pastel-teal-light border border-pastel-teal/20 rounded-xl text-center text-xs font-semibold text-pastel-teal">
          {status}
        </div>
      )}

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

        <Form {...email.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-4.5 text-xs">
                <div className="space-y-1">
                  <Label htmlFor="email" className="font-bold text-navy-400 uppercase tracking-wider text-[9px]">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    autoFocus
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs"
                  />
                  <InputError message={errors.email} />
                </div>

                <Button
                  className="w-full py-3.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-3xs"
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

        <div className="text-center text-[11px] text-navy-400 font-medium">
          Kembali ke halaman{" "}
          <Link href={login()} className="text-pastel-teal font-bold hover:underline">
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
