/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import L from "leaflet";
import { 
  MapPin, 
  Search, 
  Compass, 
  Store, 
  X, 
  CheckCircle2,
  Clock
} from "lucide-react";
import { Shop } from "@/types";
import { router } from "@inertiajs/react";

interface ShopMapProps {
  shops: Shop[];
}

// Custom DivIcon marker generator using SVG matching our clean emerald theme
const createCustomMarker = (color: string = "#10b981", isSelected: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="flex flex-col items-center justify-center relative select-none">
        <div class="absolute w-8 h-8 rounded-full animate-ping opacity-25" style="background-color: ${color};"></div>
        <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md border-2 border-white transition-all transform ${isSelected ? 'scale-125' : 'hover:scale-110'}" style="background-color: ${color};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
        </div>
      </div>
    `,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export default function ShopMap({ shops }: ShopMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePin, setActivePin] = useState<Shop | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.FeatureGroup | null>(null);

  const categories = useMemo(() => {
    const list = new Set(shops.map((s) => s.category));
    return ["all", ...Array.from(list)];
  }, [shops]);

  // Filtered shops to show on map
  const mapShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchSearch = 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory = selectedCategory === "all" || shop.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [shops, searchQuery, selectedCategory]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of Desa Samirono (Getasan)
      const map = L.map(mapContainerRef.current, {
        center: [-7.3822, 110.4287],
        zoom: 15,
        scrollWheelZoom: true,
      });

      // Add clean Voyager map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.featureGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Sync size on container resize
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Redraw Markers when shops or active pin changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    mapShops.forEach((shop) => {
      const isSelected = activePin?.id === shop.id;
      const color = isSelected ? "#f59e0b" : "#10b981"; // amber-500 or emerald-500

      const marker = L.marker([shop.lat, shop.lng], {
        icon: createCustomMarker(color, isSelected)
      });

      marker.on('click', () => {
        setActivePin(shop);
        map.setView([shop.lat, shop.lng], 16, { animate: true });
      });

      marker.addTo(markersLayer);
    });

    if (mapShops.length > 0 && !activePin) {
      const bounds = markersLayer.getBounds();
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [mapShops, activePin]);

  // Center on pin when manually selected from list
  const handleSelectShopFromSidebar = (shop: Shop) => {
    setActivePin(shop);
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([shop.lat, shop.lng], 16, { animate: true });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-3xs overflow-hidden" id="serasa-village-map">
      {/* Map Control Bar */}
      <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>Peta Geografis UMKM Desa Samirono</span>
          </h2>
          <p className="text-xs text-gray-500">Klik pin toko atau daftar di samping untuk melihat letak akurat, kontak, jam operasional, dan etalase digital.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari UMKM di peta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] bg-gray-100 hover:bg-emerald-600 text-gray-600 hover:text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-gray-700 uppercase tracking-wider cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.filter(c => c !== "all").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Leaflet Map Div Container */}
        <div className="lg:col-span-8 relative aspect-16/10 sm:aspect-16/9 md:aspect-21/9 lg:aspect-16/10 border-b lg:border-b-0 lg:border-r border-gray-200 overflow-hidden z-0">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "450px" }} />

          {/* ACTIVE PIN DETAIL PANEL */}
          {activePin && (
            <div 
              className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-lg p-5 flex items-start gap-3.5 animate-fade-in z-[1001]"
              id="map-detail-card"
            >
              <button 
                onClick={() => setActivePin(null)}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-800 border border-transparent hover:border-gray-100 rounded-full cursor-pointer hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={activePin.logo}
                alt={activePin.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200 shadow-3xs"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-1 flex-1 pr-4">
                <span className="text-[8px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider">
                  {activePin.category}
                </span>
                
                <h4 className="text-gray-800 text-sm flex items-center gap-1 leading-tight font-bold">
                  {activePin.name}
                  {activePin.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                  )}
                </h4>

                <p className="text-[9.5px] uppercase tracking-wider text-gray-400 font-bold">
                  Pemilik: <span className="text-gray-600 font-extrabold">{activePin.ownerName}</span>
                </p>

                {activePin.jamKerja && (
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 font-bold pt-0.5">
                    <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Jam Kerja: </span>
                    <span className="text-emerald-700 font-extrabold">{activePin.jamKerja}</span>
                  </p>
                )}

                <p className="text-[10px] text-gray-500 flex items-start gap-1 leading-normal pt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{activePin.address}</span>
                </p>

                <div className="pt-2.5 flex items-center gap-1.5">
                  <button
                    onClick={() => router.visit(`/shops/${activePin.id}`)}
                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-3xs"
                  >
                    <span>Buka Katalog Toko</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Shop Selection List */}
        <div className="lg:col-span-4 max-h-[450px] lg:max-h-[600px] overflow-y-auto p-4 space-y-3 bg-gray-50 border-l border-gray-200">
          <div className="sticky top-0 bg-gray-50 backdrop-blur-xs z-10 pb-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar UMKM ({mapShops.length})</span>
            {selectedCategory !== "all" && (
              <button 
                onClick={() => setSelectedCategory("all")}
                className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-500 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          {mapShops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 italic">Tidak ada UMKM yang cocok dengan filter pencarian peta Anda.</p>
            </div>
          ) : (
            mapShops.map((shop) => {
              const isActive = activePin?.id === shop.id;
              return (
                <div
                  key={shop.id}
                  onClick={() => handleSelectShopFromSidebar(shop)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 text-left ${
                    isActive
                      ? "bg-white border-emerald-600 shadow-3xs ring-1 ring-emerald-600/30"
                      : "bg-white border-gray-200 hover:border-emerald-600/50"
                  }`}
                  id={`map-sidebar-shop-${shop.id}`}
                >
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-3xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-0.5">
                    <h4 className="text-gray-800 text-xs font-bold leading-tight hover:text-emerald-600 transition-colors">
                      {shop.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-medium">Pemilik: {shop.ownerName}</p>
                    {shop.jamKerja && (
                      <p className="text-[9px] text-gray-500 flex items-center gap-0.5 font-medium">
                        <Clock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        <span>{shop.jamKerja}</span>
                      </p>
                    )}
                    <span className="inline-block text-[8px] font-bold text-emerald-600 uppercase tracking-wider">
                      {shop.dusun}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
