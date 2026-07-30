/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Search } from "lucide-react";
import { router } from "@inertiajs/react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

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

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Cari nama pengguna atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2.5 rounded-xl border-navy-200/60 focus-visible:ring-pastel-teal/20 focus-visible:border-pastel-teal bg-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-navy-200/60 bg-white text-navy-800 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal cursor-pointer shadow-3xs"
        >
          <option value="all">Semua Peran ({users.length})</option>
          <option value="admin">Super Admin ({users.filter((u) => u.role === "admin").length})</option>
          <option value="owner">Owner Toko ({users.filter((u) => u.role === "owner").length})</option>
          <option value="user">Pengguna Warga ({users.filter((u) => u.role === "user").length})</option>
        </select>
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-xs sm:text-sm text-navy-400 italic">
                    Belum ada akun yang cocok dengan filter pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
