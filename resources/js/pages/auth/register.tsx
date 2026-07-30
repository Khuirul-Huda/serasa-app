/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Form, Head, Link } from "@inertiajs/react";
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
      <Head title="Daftar Akun Baru" />

      <div className="space-y-6 font-sans text-navy-900">
        <Form
          {...store.form()}
          resetOnSuccess={["password", "password_confirmation"]}
          disableWhileProcessing
          className="flex flex-col gap-5"
        >
          {({ processing, errors }) => (
            <>
              <div className="grid gap-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Nama Lengkap Pemilik</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="name"
                    placeholder="Contoh: Pak Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Alamat Email Pengguna</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    tabIndex={2}
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
                  />
                  <InputError message={errors.email} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Kata Sandi</Label>
                  <PasswordInput
                    id="password"
                    required
                    tabIndex={3}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    passwordrules={passwordRules}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
                  />
                  <InputError message={errors.password} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password_confirmation" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Konfirmasi Kata Sandi</Label>
                  <PasswordInput
                    id="password_confirmation"
                    required
                    tabIndex={4}
                    autoComplete="new-password"
                    placeholder="Ulangi kata sandi Anda"
                    passwordrules={passwordRules}
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={processing}
                tabIndex={5}
                className="mt-2 w-full py-3.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-3xs"
              >
                {processing && <Spinner />}
                Daftar Akun Toko Baru
              </Button>

              <div className="text-center text-xs text-navy-400 font-medium pt-1">
                Sudah memiliki akun toko terdaftar?{" "}
                <Link
                  href={login()}
                  tabIndex={6}
                  className="text-pastel-teal font-bold hover:underline"
                >
                  Masuk Sekarang
                </Link>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
