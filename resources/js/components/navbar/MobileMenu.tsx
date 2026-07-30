import { Link, usePage, router } from "@inertiajs/react";
import {
  Store,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import React from "react";
import type { AppSettings } from "@/types";

interface MobileMenuProps {
  settings: AppSettings;
  activeTab: string;
  isOpen?: boolean;
  user?: any;
  onClose: () => void;
}

export default function MobileMenu({
  settings,
  activeTab,
  isOpen = true,
  user,
  onClose,
}: MobileMenuProps) {
  const { auth } = usePage().props as any;
  const currentUser = user || auth?.user;

  if (!isOpen) return null;

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/logout");
  };

  return (
    <div
      className="md:hidden border-t border-navy-200 bg-white shadow-lg animate-fade-in"
      id="mobile-menu-content"
    >
      <div className="px-3 pt-2 pb-4 space-y-1">
        <div className="px-4 py-2 text-[10px] text-navy-400 font-bold uppercase tracking-wider">
          Navigasi Halaman
        </div>

        <Link
          href="/"
          onClick={onClose}
          prefetch="hover"
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "katalog"
              ? "bg-pastel-teal-light text-pastel-teal font-extrabold border border-pastel-teal/15"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-pastel-teal" />
          <span>Seluruh Etalase</span>
        </Link>

        <Link
          href="/shops"
          onClick={onClose}
          prefetch="hover"
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "shops"
              ? "bg-pastel-teal-light text-pastel-teal font-extrabold border border-pastel-teal/15"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          <Store className="w-4 h-4 text-pastel-teal" />
          <span>Daftar UMKM Warga</span>
        </Link>

        <Link
          href="/map"
          onClick={onClose}
          prefetch="hover"
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "map"
              ? "bg-pastel-teal-light text-pastel-teal font-extrabold border border-pastel-teal/15"
              : "text-navy-600 hover:bg-navy-50"
          }`}
        >
          <MapPin className="w-4 h-4 text-pastel-teal" />
          <span>Peta Geografis Desa</span>
        </Link>

        <div className="border-t border-navy-100 my-2" />

        {currentUser ? (
          <div className="space-y-1">
            <div className="px-4 py-1 text-[10px] text-navy-400 font-bold uppercase tracking-wider">
              Akun: {currentUser.name}
            </div>
            {currentUser.role === "admin" ? (
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="w-full py-2 bg-pastel-peach hover:bg-pastel-peach/90 text-navy-900 font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
              >
                Panel Admin Desa
              </Link>
            ) : (
              <Link
                href="/merchant/dashboard"
                onClick={onClose}
                className="w-full py-2 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
              >
                Kelola Toko Saya
              </Link>
            )}
            <form onSubmit={handleLogout} className="px-3 pt-1">
              <button
                type="submit"
                className="w-full py-2 bg-pastel-coral-light hover:bg-pastel-coral/20 text-pastel-coral font-bold rounded-xl text-center text-xs uppercase tracking-wider cursor-pointer"
              >
                Keluar
              </button>
            </form>
          </div>
        ) : (
          <div className="px-3 py-2 space-y-2">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-2 border border-navy-200 text-navy-600 hover:bg-navy-50 font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="w-full py-2 bg-pastel-coral hover:bg-pastel-coral/90 text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
            >
              Daftar Akun Baru
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
