/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Form, Head, Link } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
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
        <Form {...email.form()}>
          {({ processing, errors }) => (
            <>
              <div className="grid gap-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-bold text-navy-500 uppercase tracking-wider text-xs block">Alamat Email Terdaftar</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-navy-200/60 focus:border-pastel-teal focus:ring-pastel-teal/20 transition-all text-xs sm:text-sm"
                  />
                  <InputError message={errors.email} />
                </div>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-all shadow-3xs mt-2"
              >
                {processing && (
                  <LoaderCircle className="w-4 h-4 animate-spin text-white mr-1.5" />
                )}
                Kirim Tautan Atur Ulang Sandi
              </Button>

              <div className="text-center text-xs text-navy-400 font-medium pt-1">
                Kembali ke halaman{" "}
                <Link
                  href={login()}
                  className="text-pastel-teal font-bold hover:underline"
                >
                  Masuk Akun
                </Link>
              </div>
            </>
          )}
        </Form>
      </div>
    </>
  );
}
