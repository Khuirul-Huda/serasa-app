/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Form, Head, Link } from "@inertiajs/react";
import { Store } from "lucide-react";
import React from "react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/routes";
import { store } from "@/routes/register";

type Props = {
  passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
  return (
    <>
      <Head title="Daftar Akun - SAMIRONO ETALASE" />

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

        <Form
          {...store.form()}
          resetOnSuccess={["password", "password_confirmation"]}
          disableWhileProcessing
          className="flex flex-col gap-6"
        >
          {({ processing, errors }) => (
            <>
              <div className="grid gap-4.5 text-xs">
                
                <div className="space-y-1">
                  <Label htmlFor="name" className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Nama Lengkap</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    name="name"
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-250 focus:border-emerald-600 focus:ring-emerald-500/10 transition-all text-xs"
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    name="email"
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-250 focus:border-emerald-600 focus:ring-emerald-500/10 transition-all text-xs"
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Kata Sandi</Label>
                  <PasswordInput
                    id="password"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    name="password"
                    placeholder="Kata sandi minimal 8 karakter"
                    passwordrules={passwordRules}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-250 focus:border-emerald-600 focus:ring-emerald-500/10 transition-all text-xs"
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password_confirmation" className="font-bold text-gray-500 uppercase tracking-wider text-[9px]">Konfirmasi Kata Sandi</Label>
                  <PasswordInput
                    id="password_confirmation"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    name="password_confirmation"
                    placeholder="Ketik ulang kata sandi"
                    passwordrules={passwordRules}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-250 focus:border-emerald-600 focus:ring-emerald-500/10 transition-all text-xs"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="mt-2 w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer disabled:opacity-50 transition-all"
                  tabIndex={5}
                >
                  {processing && <Spinner />}
                  Daftar Akun Warga
                </Button>
              </div>

              <div className="text-center text-[11px] text-gray-400 font-medium">
                Sudah memiliki akun?{" "}
                <Link href={login()} className="text-emerald-700 font-bold hover:underline" tabIndex={6}>
                  Masuk
                </Link>
              </div>
            </>
          )}
        </Form>

      </div>
    </>
  );
}

Register.layout = {
  title: "Daftar Akun Baru",
  description: "Lengkapi rincian berikut untuk membuat akun warga baru.",
};
