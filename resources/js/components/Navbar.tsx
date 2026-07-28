/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { Link, usePage, router } from "@inertiajs/react";
import { 
  Store, 
  ShoppingBag, 
  MapPin, 
  User as UserIcon, 
  ShieldCheck, 
  Menu, 
  X, 
  Settings,
  Search,
  ShoppingCart,
  Bell,
  Phone,
  ChevronDown,
  Globe,
  Trash2,
  LogOut
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import type { AppSettings, Category, Product } from "@/types";
import { formatIDR } from "@/utils";

interface NavbarProps {
  settings: AppSettings;
  activeTab: "katalog" | "shops" | "map" | "merchant" | "admin" | "detail";
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  categories: Category[];
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export default function Navbar({
  settings,
  activeTab,
  searchQuery = "",
  setSearchQuery,
}: NavbarProps) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Refs for closing dropdowns on click outside
  const cartRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dummy items in Cart for marketplace fidelity
  const [cartItems, setCartItems] = useState([
    { id: "c1", name: "Keju Mozzarella Lokal Samirono", price: 38000, qty: 1, image: "https://images.unsplash.com/photo-1552763484-5d60bed6f2d8?auto=format&fit=crop&q=80&w=150" },
    { id: "c2", name: "Susu Sapi Segar Pasteurisasi (1L)", price: 15000, qty: 2, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=150" }
  ]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleDeleteCartItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSearchChange = (val: string) => {
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      router.visit(`/?search=${encodeURIComponent(val)}`);
    }
  };

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/logout");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs font-sans transition-all" id="marketplace-navbar">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-stone-100/70 border-b border-stone-200/70 py-1.5 px-4 text-[11px] text-stone-600 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Left side links */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <Globe className="w-3.5 h-3.5" />
              <span>{settings.villageName} Getasan</span>
            </span>
            <span className="text-stone-300">|</span>
            <a href={`https://wa.me/${settings.adminPhone}`} target="_blank" rel="noreferrer" className="hover:text-emerald-600 flex items-center gap-1 transition-all">
              <Phone className="w-3 h-3" />
              <span>Helpline Desa: +{settings.adminPhone}</span>
            </a>
          </div>

          {/* Right side links - Real Auth State */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 text-gray-700 hover:text-emerald-600 font-bold uppercase tracking-wider text-[10px] bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Halo, </span>
                  <span className="text-emerald-700 underline">
                    {user.name} ({user.role === 'admin' ? 'Admin' : 'Owner'})
                  </span>
                  <ChevronDown className="w-3 h-3 text-emerald-600" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 animate-fade-in text-xs">
                    <div className="px-3.5 py-1.5 border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Akun Saya
                    </div>
                    {user.role === 'admin' ? (
                      <Link 
                        href="/admin/dashboard"
                        className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center gap-2 text-gray-700 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <span>Panel Admin</span>
                      </Link>
                    ) : (
                      <Link 
                        href="/merchant/dashboard"
                        className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center gap-2 text-gray-700 transition-colors"
                      >
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>Kelola Toko</span>
                      </Link>
                    )}
                    <Link 
                      href="/settings/profile"
                      className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 flex items-center gap-2 text-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Ubah Profil</span>
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <form onSubmit={handleLogout}>
                      <button 
                        type="submit"
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="hover:text-emerald-700 font-bold text-[10.5px] uppercase tracking-wider text-gray-600 transition-colors">
                  Masuk
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/register" className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] uppercase tracking-wider rounded-lg transition-colors shadow-2xs">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 justify-between">
        
        {/* Brand Logo & Desktop Primary Navigation Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link 
            href="/"
            className="flex items-center gap-2 text-left group cursor-pointer"
            id="brand-logo"
          >
            <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-600 transition-all duration-300 transform group-hover:scale-105">
              <Store className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="hidden lg:block">
              <span className="text-base font-sans text-gray-900 tracking-tight block font-black uppercase">
                SAMIRONO <span className="text-emerald-700">ETALASE</span>
              </span>
              <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase block -mt-1 font-mono">
                SENTRA UMKM DESA
              </span>
            </div>
          </Link>

          {/* Desktop Integrated Navigation */}
          <nav className="hidden md:flex items-center gap-1 border-l border-gray-200 pl-4">
            <Link
              href="/"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "katalog"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100/70"
                  : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
              }`}
            >
              Etalase Warga
            </Link>
            <Link
              href="/shops"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "shops"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100/70"
                  : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
              }`}
            >
              Daftar UMKM
            </Link>
            <Link
              href="/map"
              prefetch="hover"
              className={`px-3 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeTab === "map"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100/70"
                  : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
              }`}
            >
              Peta Geografis
            </Link>
          </nav>
        </div>

        {/* Search Input */}
        <div className="flex-grow max-w-md mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk desa (susu, keju, anyaman, gethuk...)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-gray-300 bg-gray-55 focus:bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 font-medium transition-all"
              id="global-search-input"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right side interactions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          
          {/* Cart Dropdown */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => {
                setIsCartOpen(!isCartOpen);
                setIsNotificationOpen(false);
              }}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-xl transition-all relative cursor-pointer"
              title="Keranjang Simulasi"
              id="navbar-cart-trigger"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white font-extrabold text-[8px] flex items-center justify-center rounded-full border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </button>

            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-3.5 px-4 animate-fade-in text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                  <span className="font-bold text-gray-900 text-sm">Keranjang Simulasi ({cartItems.length})</span>
                  <Link 
                    href="/"
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] text-emerald-600 hover:underline font-bold"
                  >
                    Lihat Semua
                  </Link>
                </div>

                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 italic">
                    Keranjang belanja kosong
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-start gap-2.5 group">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                        <div className="flex-grow min-w-0">
                          <span className="block font-bold text-gray-800 text-[11px] truncate group-hover:text-emerald-600 transition-colors">{item.name}</span>
                          <span className="block text-[10px] text-gray-400 mt-0.5">{item.qty} x {formatIDR(item.price)}</span>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteCartItem(item.id, e)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {cartItems.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Total Harga:</span>
                      <span className="font-bold text-sm text-gray-950">{formatIDR(cartTotal)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        alert("Ini adalah simulasi pemesanan. Pembelian sungguhan langsung dilakukan dengan menghubungi WhatsApp Pelaku UMKM bersangkutan di detail produk.");
                        setIsCartOpen(false);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-[9px] rounded-xl text-center shadow-3xs cursor-pointer block"
                    >
                      Beli Langsung (Hubungi Penjual)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsCartOpen(false);
              }}
              className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-xl transition-all relative cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-3 px-3.5 animate-fade-in text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-bold text-gray-900">Notifikasi Portal</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Terbaru</span>
                </div>
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  <div className="py-2.5 space-y-0.5 bg-emerald-50/20 px-1 rounded-lg">
                    <span className="font-bold text-gray-800 text-[11px]">Toko Baru Terdaftar!</span>
                    <p className="text-[10px] text-gray-500 font-normal leading-relaxed">Gethuk Manis Bu Marni baru saja bergabung ke etalase.</p>
                    <span className="block text-[9px] text-gray-400 font-medium">10 menit yang lalu</span>
                  </div>
                  <div className="py-2.5 space-y-0.5">
                    <span className="font-bold text-gray-800 text-[11px]">Verifikasi Berhasil</span>
                    <p className="text-[10px] text-gray-500 font-normal leading-relaxed">Toko Kerajinan Bambu Lestari telah diverifikasi oleh Admin Desa.</p>
                    <span className="block text-[9px] text-gray-400 font-medium">2 jam yang lalu</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Dashboard link for authenticated owners/admins */}
          {user && (
            <div className="hidden sm:flex items-center">
              {user.role === 'admin' ? (
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border ${
                    activeTab === "admin"
                      ? "bg-amber-500 text-gray-950 border-amber-500 shadow-3xs"
                      : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Desa</span>
                </Link>
              ) : (
                <Link
                  href="/merchant/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border ${
                    activeTab === "merchant"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-3xs"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Kelola Toko Saya</span>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-fade-in" id="mobile-menu-content">
          <div className="px-3 pt-2 pb-4 space-y-1">
            
            <div className="px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Navigasi Halaman
            </div>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              prefetch="hover"
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "katalog"
                  ? "bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Seluruh Etalase</span>
            </Link>

            <Link
              href="/shops"
              onClick={() => setIsMobileMenuOpen(false)}
              prefetch="hover"
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "shops"
                  ? "bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Daftar UMKM Warga</span>
            </Link>

            <Link
              href="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              prefetch="hover"
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "map"
                  ? "bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-100"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Peta Geografis Desa</span>
            </Link>

            <div className="border-t border-gray-100 my-2" />
            
            {user ? (
              <div className="space-y-1">
                <div className="px-4 py-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Akun: {user.name}
                </div>
                {user.role === 'admin' ? (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
                  >
                    Panel Admin Desa
                  </Link>
                ) : (
                  <Link
                    href="/merchant/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
                  >
                    Kelola Toko Saya
                  </Link>
                )}
                <form onSubmit={handleLogout} className="px-3 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-center text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl text-center text-xs uppercase tracking-wider block"
                >
                  Daftar Akun Baru
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
