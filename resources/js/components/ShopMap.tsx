/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { router } from '@inertiajs/react';
import L from 'leaflet';
import {
    MapPin,
    Search,
    Compass,
    Store,
    X,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { AppSettings, Shop } from '@/types';

interface ShopMapProps {
    shops: Shop[];
    villageName?: string;
    settings?: AppSettings;
}

// Custom DivIcon marker generator using SVG matching soft pastel teal theme
const createCustomMarker = (
    color: string = '#00B4D8',
    isSelected: boolean = false,
) => {
    const scale = isSelected ? 'scale(1.25)' : 'scale(1)';

    return L.divIcon({
        html: `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;user-select:none;">
        <div style="width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 6px -1px rgba(0,0,0,.1);border:2px solid #fff;transition:transform .2s;transform:${scale};background-color:${color};">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M14 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/><path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
        </div>
      </div>
    `,
        className: 'custom-leaflet-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

export default function ShopMap({
    shops,
    villageName = 'Desa Samirono',
    settings,
}: ShopMapProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activePin, setActivePin] = useState<Shop | null>(null);

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.FeatureGroup | null>(null);

    const defaultLat = settings?.mapCenterLat ?? -7.3822;
    const defaultLng = settings?.mapCenterLng ?? 110.4287;
    const defaultZoom = settings?.mapZoom ?? 15;

    const categories = useMemo(() => {
        const list = new Set(shops.map((s) => s.category));

        return ['all', ...Array.from(list)];
    }, [shops]);

    // Filtered shops to show on map sidebar
    const mapShops = useMemo(() => {
        return shops.filter((shop) => {
            const matchSearch =
                shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shop.ownerName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                shop.dusun.toLowerCase().includes(searchQuery.toLowerCase());

            const matchCategory =
                selectedCategory === 'all' ||
                shop.category === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [shops, searchQuery, selectedCategory]);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        if (!mapInstanceRef.current) {
            // Center of Desa Samirono (Getasan)
            const map = L.map(mapContainerRef.current, {
                center: [defaultLat, defaultLng],
                zoom: defaultZoom,
                scrollWheelZoom: true,
            });

            // Add clean Voyager map tiles
            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    maxZoom: 20,
                },
            ).addTo(map);

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

        if (!map || !mapContainerRef.current) {
            return;
        }

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

        if (!map || !markersLayer) {
            return;
        }

        markersLayer.clearLayers();

        mapShops.forEach((shop) => {
            if (shop.lat == null || shop.lng == null) {
                return;
            }

            const lat = shop.lat;
            const lng = shop.lng;

            const isSelected = activePin?.id === shop.id;
            const color = isSelected ? '#F07167' : '#00B4D8'; // coral for selected, teal for default

            const marker = L.marker([lat, lng], {
                icon: createCustomMarker(color, isSelected),
            });

            marker.on('click', () => {
                setActivePin(shop);
                map.setView([lat, lng], 16, { animate: true });
            });

            marker.addTo(markersLayer);
        });

        if (markersLayer.getLayers().length > 0 && !activePin) {
            const bounds = markersLayer.getBounds();
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [mapShops, activePin]);

    // Center on pin when manually selected from list
    const handleSelectShopFromSidebar = (shop: Shop) => {
        setActivePin(shop);
        const map = mapInstanceRef.current;

        if (map && shop.lat != null && shop.lng != null) {
            map.setView([shop.lat, shop.lng], 16, { animate: true });
        }
    };

    return (
        <div
            className="shadow-3xs overflow-hidden rounded-3xl border border-navy-200/60 bg-white font-sans text-navy-900"
            id="serasa-village-map"
        >
            {/* Map Control Bar */}
            <div className="flex flex-col items-stretch justify-between gap-4 border-b border-navy-200/60 bg-navy-50/50 p-5 md:flex-row md:items-center">
                <div>
                    <h2 className="flex items-center gap-2 text-[15px] font-bold tracking-wide text-navy-900 uppercase">
                        <Compass className="h-5 w-5 text-pastel-teal" />
                        <span>Peta Geografis UMKM {villageName}</span>
                    </h2>
                    <p className="text-xs text-navy-500">
                        Klik pin toko atau daftar di samping untuk melihat letak
                        akurat, kontak, jam operasional, dan etalase digital.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Map Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-navy-400" />
                        <input
                            type="text"
                            placeholder="Cari UMKM di peta..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-navy-200/60 bg-white py-2 pr-14 pl-9 text-xs font-medium text-navy-800 focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md bg-navy-100 px-2 py-0.5 text-[8px] font-bold tracking-wider text-navy-600 uppercase transition-colors hover:bg-pastel-teal hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Dropdown */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="shadow-3xs cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2 text-xs font-bold tracking-wider text-navy-700 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none"
                    >
                        <option value="all">Semua Kategori</option>
                        {categories
                            .filter((c) => c !== 'all')
                            .map((cat) => (
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
                <div className="relative z-0 aspect-16/10 overflow-hidden border-b border-navy-200/60 sm:aspect-16/9 md:aspect-21/9 lg:col-span-8 lg:aspect-16/10 lg:border-r lg:border-b-0">
                    <div
                        ref={mapContainerRef}
                        className="h-full w-full"
                        style={{ minHeight: '450px' }}
                    />

                    {/* ACTIVE PIN DETAIL PANEL */}
                    {activePin && (
                        <div
                            className="absolute right-4 bottom-4 left-4 z-[1001] flex animate-fade-in items-start gap-3.5 rounded-2xl border border-navy-200/60 bg-white p-5 shadow-lg sm:right-auto sm:left-1/2 sm:w-96 sm:-translate-x-1/2"
                            id="map-detail-card"
                        >
                            <button
                                onClick={() => setActivePin(null)}
                                className="absolute top-3 right-3 cursor-pointer rounded-full border border-transparent p-1.5 text-navy-400 transition-colors hover:border-navy-100 hover:bg-navy-50 hover:text-navy-800"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <img
                                src={activePin.logo}
                                alt={activePin.name}
                                className="shadow-3xs h-12 w-12 shrink-0 rounded-xl border border-navy-200 object-cover"
                                referrerPolicy="no-referrer"
                            />

                            <div className="flex-1 space-y-1 pr-4">
                                <span className="inline-block rounded border border-navy-200/60 bg-navy-100 px-2 py-0.5 text-xs font-bold tracking-wider text-navy-500 uppercase">
                                    {activePin.category}
                                </span>

                                <h4 className="flex items-center gap-1 text-sm leading-tight font-bold text-navy-900">
                                    {activePin.name}
                                    {activePin.isVerified && (
                                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-pastel-mint-light text-pastel-mint" />
                                    )}
                                </h4>

                                <p className="text-xs font-bold tracking-wider text-navy-400 uppercase">
                                    Pemilik:{' '}
                                    <span className="font-extrabold text-navy-700">
                                        {activePin.ownerName}
                                    </span>
                                </p>

                                {activePin.jamKerja && (
                                    <p className="flex items-center gap-1 pt-0.5 text-xs font-bold text-navy-500">
                                        <Clock className="h-3 w-3 shrink-0 text-pastel-teal" />
                                        <span>Jam Kerja: </span>
                                        <span className="font-extrabold text-pastel-teal">
                                            {activePin.jamKerja}
                                        </span>
                                    </p>
                                )}

                                <p className="flex items-start gap-1 pt-0.5 text-xs leading-normal text-navy-500">
                                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-pastel-teal" />
                                    <span>{activePin.address}</span>
                                </p>

                                <div className="flex items-center gap-1.5 pt-2.5">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                `/shops/${activePin.id}`,
                                            )
                                        }
                                        className="shadow-3xs flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-pastel-teal px-3 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-pastel-teal/90"
                                    >
                                        <span>Buka Katalog Toko</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Shop Selection List */}
                <div className="max-h-[450px] space-y-3 overflow-y-auto border-l border-navy-200/60 bg-navy-50/50 p-4 lg:col-span-4 lg:max-h-[600px]">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-200/60 bg-navy-50/90 pb-2 backdrop-blur-xs">
                        <span className="text-xs font-bold tracking-widest text-navy-400 uppercase">
                            Daftar UMKM ({mapShops.length})
                        </span>
                        {selectedCategory !== 'all' && (
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className="cursor-pointer text-xs font-bold tracking-wider text-pastel-teal uppercase hover:text-pastel-teal/80"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {mapShops.length === 0 ? (
                        <div className="py-12 text-center">
                            <Store className="mx-auto mb-2 h-8 w-8 text-navy-300" />
                            <p className="text-xs text-navy-400 italic">
                                Tidak ada UMKM yang cocok dengan filter
                                pencarian peta Anda.
                            </p>
                        </div>
                    ) : (
                        mapShops.map((shop) => {
                            const isActive = activePin?.id === shop.id;

                            return (
                                <div
                                    key={shop.id}
                                    onClick={() =>
                                        handleSelectShopFromSidebar(shop)
                                    }
                                    className={`flex cursor-pointer gap-3 rounded-2xl border p-3 text-left transition-all ${
                                        isActive
                                            ? 'shadow-3xs border-pastel-teal bg-white ring-1 ring-pastel-teal/30'
                                            : 'border-navy-200/60 bg-white hover:border-pastel-teal/50'
                                    }`}
                                    id={`map-sidebar-shop-${shop.id}`}
                                >
                                    <img
                                        src={shop.logo}
                                        alt={shop.name}
                                        className="shadow-3xs h-10 w-10 shrink-0 rounded-xl border border-navy-200 object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs leading-tight font-bold text-navy-900 transition-colors hover:text-pastel-teal">
                                            {shop.name}
                                        </h4>
                                        <p className="text-xs font-medium text-navy-400">
                                            Pemilik: {shop.ownerName}
                                        </p>
                                        {shop.jamKerja && (
                                            <p className="flex items-center gap-0.5 text-xs font-medium text-navy-500">
                                                <Clock className="h-2.5 w-2.5 shrink-0 text-pastel-teal" />
                                                <span>{shop.jamKerja}</span>
                                            </p>
                                        )}
                                        <span className="inline-block text-xs font-bold tracking-wider text-pastel-teal uppercase">
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
