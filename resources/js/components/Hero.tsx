/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from "@inertiajs/react";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  ThumbsUp,
  Tag
} from "lucide-react";
import React, { useState, useEffect } from "react";
import type { AppSettings, Category } from "@/types";

interface HeroProps {
  settings: AppSettings;
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalShops: number;
  totalProducts: number;
}

const promoSlides = [
  {
    id: "slide-1",
    title: "Susu Sapi Murni Samirono",
    tagline: "Diskon 10% Spesial Minggu Ini",
    description: "Segar murni dari peternakan lereng Gunung Merbabu, diperah higienis harian oleh warga desa.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    badge: "🥛 SUSU SEGAR",
    btnQuery: "susu"
  },
  {
    id: "slide-2",
    title: "Keju Mozzarella & Ricotta",
    tagline: "Karya Tani Unggulan Samirono",
    description: "Diproduksi oleh sentra pengolahan susu Samirono dengan cita rasa keju eropa bersertifikat pangan.",
    image: "https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=800&q=80",
    badge: "🧀 KEJU LOKAL",
    btnQuery: "keju"
  },
  {
    id: "slide-3",
    title: "Kerajinan Anyaman Bambu",
    tagline: "100% Produk Kreatif Ramah Lingkungan",
    description: "Dianyam telaten dengan bambu pilihan lereng pegunungan untuk perabot estetis fungsional.",
    image: "https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=800&q=80",
    badge: "🎋 KRIYA BAMBU",
    btnQuery: "anyaman"
  }
];

export default function Hero({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  settings: _settings,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalShops: _totalShops,
  totalProducts,
}: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 44, seconds: 12 });

  // Carousel Auto-advance
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5500);

    return () => clearInterval(slideInterval);
  }, []);

  // Countdown timer simulation for e-commerce Flash Sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 44, seconds: 12 }; // reset loop to stay active
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  const hotSearches = [
    { label: "Susu Segar", query: "susu" },
    { label: "Keju Samirono", query: "keju" },
    { label: "Tas Anyaman", query: "tas" },
    { label: "Kopi Merbabu", query: "kopi" },
    { label: "Keripik Paru", query: "keripik" },
    { label: "Pupuk Organik", query: "pupuk" }
  ];

  return (
    <div className="relative overflow-hidden bg-navy-50/40 border-b border-navy-200/60 pt-6 pb-10 font-sans" id="serasa-hero">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(oklch(0.82_0.01_250)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Marketplace Banner Slider & Sidebar Promos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Main Promotions Slider Carousel (Lefthand Column) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xs border border-navy-200/60 group/slider h-[280px] sm:h-[340px] bg-navy-900">
            {promoSlides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  width={800}
                  height={340}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover opacity-40 transition-transform duration-10000 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Single-color gradient overlay: navy-900 → transparent ✅ */}
                <div className="absolute inset-0 bg-linear-to-tr from-navy-900 via-navy-900/75 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                  <div className="space-y-2 sm:space-y-3 max-w-lg">
                    <span className="inline-block px-3 py-1 bg-pastel-peach text-navy-900 text-[9px] font-black uppercase tracking-wider rounded-md">
                      {slide.badge}
                    </span>
                    <h2 className="text-xl sm:text-3.5xl font-black tracking-tight leading-tight text-white">
                      {slide.title}
                    </h2>
                    <p className="text-pastel-peach font-bold text-xs sm:text-sm">
                      {slide.tagline}
                    </p>
                    <p className="text-[11px] sm:text-xs text-navy-200 leading-relaxed font-normal line-clamp-2">
                      {slide.description}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setSearchQuery(slide.btnQuery)}
                        className="px-5 py-2.5 bg-pastel-coral hover:bg-pastel-coral/90 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Temukan Produk Warga
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-xs transition-all z-20 cursor-pointer opacity-0 group-hover/slider:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-4 left-6 sm:left-10 flex gap-1.5 z-20">
              {promoSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-2.5 h-1 rounded-full transition-all cursor-pointer ${
                    i === currentSlide ? "bg-pastel-teal w-5" : "bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Countdown & Highlight Promo Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-navy-200/60 p-5 flex flex-col justify-between shadow-2xs h-[280px] sm:h-[340px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-pastel-coral">
                  <Flame className="w-5 h-5 fill-pastel-coral/50 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider">KEJAR DISKON WARGA</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="px-1.5 py-0.5 bg-navy-900 text-white font-bold rounded-md text-[10px]">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-navy-400">:</span>
                  <span className="px-1.5 py-0.5 bg-navy-900 text-white font-bold rounded-md text-[10px]">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-navy-400">:</span>
                  <span className="px-1.5 py-0.5 bg-pastel-coral text-white font-bold rounded-md text-[10px] animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div 
                onClick={() => router.visit("/products/prod-keju-artisan")}
                className="flex gap-3.5 p-3 rounded-2xl bg-pastel-coral-light/40 hover:bg-pastel-coral-light border border-pastel-coral/20 hover:border-pastel-coral/40 transition-all cursor-pointer group/promo"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-navy-100 shrink-0 border border-pastel-coral/20 group-hover/promo:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=150&q=80"
                    alt="Promo Keju Samirono"
                    width={80}
                    height={80}
                    loading="lazy"
                    sizes="80px"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-1.5 py-0.5 bg-pastel-coral-light text-pastel-coral text-[8px] font-black uppercase rounded-md">
                    Stok Terbatas
                  </span>
                  <h4 className="text-[12px] font-bold text-navy-800 line-clamp-1 leading-snug group-hover/promo:text-pastel-coral transition-colors">
                    Keju Samirono Mozzarella
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-black text-navy-900">Rp 30.000</span>
                    <span className="text-[9px] text-navy-400 line-through">Rp 35.000</span>
                  </div>
                  <span className="text-[10px] text-pastel-mint font-bold block">Hemat Rp 5.000!</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-navy-500 font-bold">
                  <span>Tersisa 4 pcs</span>
                  <span className="text-pastel-coral">Hampir Habis (87% Terjual)</span>
                </div>
                <div className="w-full h-2 bg-navy-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pastel-coral rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
            </div>

            <div className="border-t border-navy-100 pt-3 flex justify-between items-center text-[11px] text-navy-500 font-medium">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-pastel-mint" />
                <span>100% Produk Desa</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-pastel-peach" />
                <span>Getasan, Semarang</span>
              </div>
            </div>
          </div>

        </div>

        {/* E-Commerce Search & Suggestion Bar */}
        <div className="bg-white rounded-3xl border border-navy-200/60 p-5 shadow-2xs space-y-4" id="search-filter-panel">
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
            <input
              type="text"
              placeholder="Cari produk kriya, susu murni, keju mozarella, keripik tempe, atau nama UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-20 py-3 rounded-2xl bg-navy-50 text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-pastel-teal/20 focus:border-pastel-teal border border-navy-200/60 text-xs font-semibold transition-all"
              id="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 p-0.5 bg-navy-200/60 hover:bg-navy-200 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-navy-500">
            <span className="font-bold uppercase tracking-wider text-[9px] text-navy-400 shrink-0">Pencarian Populer:</span>
            <div className="flex flex-wrap gap-1.5">
              {hotSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  className="px-2.5 py-1 rounded-lg bg-navy-100/60 hover:bg-pastel-teal-light text-navy-700 hover:text-pastel-teal font-medium border border-navy-200/50 hover:border-pastel-teal/20 transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-navy-100 pt-4 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 w-full">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === "all"
                    ? "bg-pastel-teal text-white border-pastel-teal shadow-2xs"
                    : "bg-white text-navy-600 hover:bg-navy-50 border-navy-200/60"
                }`}
                id="category-all"
              >
                Semua Produk ({totalProducts})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? "bg-pastel-teal text-white border-pastel-teal shadow-2xs"
                      : "bg-white text-navy-600 hover:bg-navy-50 border-navy-200/60"
                  }`}
                  id={`category-${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
