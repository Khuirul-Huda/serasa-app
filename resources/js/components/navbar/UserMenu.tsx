/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, usePage, router } from "@inertiajs/react";
import {
  User as UserIcon,
  ShieldCheck,
  Store,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { auth } = usePage().props as any;
  const user = auth?.user;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/logout");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="hover:text-pastel-teal font-bold text-[10.5px] uppercase tracking-wider text-navy-600 transition-colors"
        >
          Masuk
        </Link>
        <span className="text-navy-300">|</span>
        <Link
          href="/register"
          className="px-3 py-1 bg-pastel-coral hover:bg-pastel-coral/90 text-white font-bold text-[10.5px] uppercase tracking-wider rounded-lg transition-colors shadow-2xs"
        >
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-navy-700 hover:text-pastel-teal font-bold uppercase tracking-wider text-[10px] bg-pastel-teal-light/60 border border-pastel-teal/15 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
      >
        <UserIcon className="w-3.5 h-3.5 text-pastel-teal" />
        <span>Halo, </span>
        <span className="text-pastel-teal underline">
          {user.name} ({user.role === "admin" ? "Admin" : "Owner"})
        </span>
        <ChevronDown className="w-3 h-3 text-pastel-teal" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-navy-200 rounded-xl shadow-lg py-2 z-50 animate-fade-in text-xs">
          <div className="px-3.5 py-1.5 border-b border-navy-100 text-[10px] text-navy-400 font-bold uppercase tracking-wider">
            Akun Saya
          </div>
          {user.role === "admin" ? (
            <Link
              href="/admin/dashboard"
              className="w-full text-left px-3.5 py-2 hover:bg-pastel-teal-light flex items-center gap-2 text-navy-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-pastel-peach" />
              <span>Panel Admin</span>
            </Link>
          ) : (
            <Link
              href="/merchant/dashboard"
              className="w-full text-left px-3.5 py-2 hover:bg-pastel-teal-light flex items-center gap-2 text-navy-700 transition-colors"
            >
              <Store className="w-4 h-4 text-pastel-teal" />
              <span>Kelola Toko</span>
            </Link>
          )}
          <Link
            href="/settings/profile"
            className="w-full text-left px-3.5 py-2 hover:bg-pastel-teal-light flex items-center gap-2 text-navy-700 transition-colors"
          >
            <Settings className="w-4 h-4 text-navy-400" />
            <span>Ubah Profil</span>
          </Link>
          <hr className="my-1 border-navy-100" />
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="w-full text-left px-3.5 py-2 hover:bg-pastel-coral-light flex items-center gap-2 text-pastel-coral transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
