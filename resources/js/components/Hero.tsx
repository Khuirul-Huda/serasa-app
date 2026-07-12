/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  ThumbsUp,
  Tag
} from "lucide-react";
import { AppSettings, Category } from "@/types";

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
  settings,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  totalShops,
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
    <div className="relative overflow-hidden bg-gray-50 border-b border-gray-200 pt-6 pb-10" id="serasa-hero">
      {/* Background Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Marketplace Banner Slider & Sidebar Promos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Main Promotions Slider Carousel (Lefthand Column) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-xs border border-gray-200 group/slider h-[280px] sm:h-[340px] bg-emerald-950">
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
                  className="w-full h-full object-cover opacity-35 transition-transform duration-10000 hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-950/70 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
                  <div className="space-y-2 sm:space-y-3 max-w-lg">
                    <span className="inline-block px-3 py-1 bg-amber-500 text-emerald-950 text-[9px] font-black uppercase tracking-wider rounded">
                      {slide.badge}
                    </span>
                    <h2 className="text-xl sm:text-3.5xl font-extrabold tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-amber-400 font-bold text-xs sm:text-sm">
                      {slide.tagline}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-200 leading-relaxed font-light line-clamp-2">
                      {slide.description}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setSearchQuery(slide.btnQuery)}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        Temukan Produk
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
                    i === currentSlide ? "bg-emerald-500 w-5" : "bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tokopedia-Style Countdown & Promo Card (Righthand Column) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 flex flex-col justify-between shadow-3xs h-[280px] sm:h-[340px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-600">
                  <Flame className="w-5 h-5 fill-red-500 animate-pulse" />
                  <span className="text-sm font-extrabold tracking-tight">KEJAR DISKON WARGA</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="px-1.5 py-0.5 bg-gray-900 text-white font-bold rounded">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-gray-500">:</span>
                  <span className="px-1.5 py-0.5 bg-gray-900 text-white font-bold rounded">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-gray-500">:</span>
                  <span className="px-1.5 py-0.5 bg-red-600 text-white font-bold rounded animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div className="flex gap-3.5 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1559561853-080268185995?auto=format&fit=crop&w=150&q=80"
                    alt="Promo Keju Samirono"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase rounded">
                    Stok Terbatas
                  </span>
                  <h4 className="text-[12px] font-bold text-gray-800 line-clamp-1 leading-snug">
                    Keju Samirono Mozzarella
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-black text-gray-900">Rp 30.000</span>
                    <span className="text-[9px] text-gray-400 line-through">Rp 35.000</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">Hemat Rp 5.000!</span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                  <span>Tersisa 4 pcs</span>
                  <span className="text-red-500">Hampir Habis (87% Terjual)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" style={{ width: "87%" }} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-[11px] text-gray-500">
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">100% Produk Desa</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">Getasan, Semarang</span>
              </div>
            </div>
          </div>

        </div>

        {/* E-Commerce Search & Suggestion Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-3xs space-y-4" id="search-filter-panel">
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari produk kriya, susu murni, keju mozarella, keripik tempe, atau nama UMKM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-20 py-3 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200 text-xs font-bold uppercase tracking-wider transition-all"
              id="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 bg-gray-200/50 hover:bg-gray-200 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
            <span className="font-bold uppercase tracking-wider text-[9px] text-gray-400 shrink-0">Pencarian Populer:</span>
            <div className="flex flex-wrap gap-1.5">
              {hotSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.query)}
                  className="px-2.5 py-1 rounded-md bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 font-medium border border-gray-200 hover:border-emerald-200 transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Katalog Sektor Kreatif:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCategory === "all"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-3xs"
                    : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
                }`}
                id="category-all"
              >
                Semua Produk ({totalProducts})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-3xs"
                      : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200"
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
