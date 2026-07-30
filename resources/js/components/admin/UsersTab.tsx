/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users } from "lucide-react";
import { router } from "@inertiajs/react";
import React from "react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { AdminUser } from "@/pages/admin-dashboard";

interface UsersTabProps {
  users: AdminUser[];
}

export default function UsersTab({ users }: UsersTabProps) {
  const handleRoleChange = (userId: number, newRole: string, userName: string) => {
    router.post(`/admin/users/${userId}/role`, { role: newRole }, {
      onSuccess: () => {
        toast.success(`Peran akun "${userName}" berhasil diubah menjadi ${newRole.toUpperCase()}.`);
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-navy-900" id="admin-users-tab">
      {/* Header Bar */}
      <div className="bg-white border border-navy-200/60 p-5 sm:p-6 rounded-3xl shadow-3xs flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-navy-900 text-lg uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-pastel-teal" />
            <span>Manajemen Pengguna & Peran Akun</span>
          </h3>
          <p className="text-xs sm:text-sm text-navy-500 mt-1 font-normal">
            Daftar seluruh akun terdaftar dan hak akses dalam portal etalase desa.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-pastel-teal-light border border-pastel-teal/20 text-pastel-teal font-black text-xs uppercase tracking-wider rounded-xl">
          {users.length} Akun Terdaftar
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-navy-200/60 rounded-3xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy-50 border-b border-navy-100 hover:bg-navy-50/50 text-xs font-extrabold uppercase text-navy-600 tracking-wider">
                <TableHead className="p-4">Nama Pengguna</TableHead>
                <TableHead className="p-4">Alamat Email</TableHead>
                <TableHead className="p-4">Tanggal Registrasi</TableHead>
                <TableHead className="p-4">Peran (Role)</TableHead>
                <TableHead className="p-4 text-right">Ubah Peran (Role)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-b border-navy-100 hover:bg-navy-50/30 transition-colors">
                  <TableCell className="p-4 font-bold text-navy-900 text-xs sm:text-sm">
                    {user.name}
                  </TableCell>

                  <TableCell className="p-4 text-xs sm:text-sm font-mono text-navy-600">
                    {user.email}
                  </TableCell>

                  <TableCell className="p-4 text-xs sm:text-sm text-navy-500 font-normal">
                    {user.createdAt}
                  </TableCell>

                  <TableCell className="p-4">
                    {user.role === "admin" ? (
                      <span className="px-2.5 py-1 bg-pastel-peach-light text-pastel-peach border border-pastel-peach/30 text-xs font-black uppercase rounded-lg">
                        Admin Desa
                      </span>
                    ) : user.role === "owner" ? (
                      <span className="px-2.5 py-1 bg-pastel-teal-light text-pastel-teal border border-pastel-teal/30 text-xs font-black uppercase rounded-lg">
                        Owner Toko
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-navy-100 text-navy-600 border border-navy-200 text-xs font-bold uppercase rounded-lg">
                        Pengguna
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="p-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value, user.name)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
                    >
                      <option value="user">Pengguna (Warga)</option>
                      <option value="owner">Owner Toko (Pelaku Usaha)</option>
                      <option value="admin">Super Admin (Pemerintah Desa)</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
