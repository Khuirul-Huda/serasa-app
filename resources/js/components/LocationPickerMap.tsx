/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import L from 'leaflet';
import React, { useEffect, useRef } from 'react';

interface LocationPickerMapProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({
    lat,
    lng,
    onChange,
}: LocationPickerMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [lat, lng],
                zoom: 15,
            });

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                {
                    maxZoom: 20,
                },
            ).addTo(map);

            const marker = L.marker([lat, lng], {
                draggable: true,
                icon: L.divIcon({
                    html: `
            <div class="flex flex-col items-center justify-center relative select-none">
              <div class="absolute w-8 h-8 rounded-full animate-ping bg-pastel-teal opacity-30"></div>
              <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-white bg-pastel-teal shadow-md border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-white"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            </div>
          `,
                    className: 'custom-picker-leaflet-marker',
                    iconSize: [36, 36],
                    iconAnchor: [18, 18],
                }),
            }).addTo(map);

            marker.on('dragend', () => {
                const latLng = marker.getLatLng();
                onChange(
                    Number(latLng.lat.toFixed(6)),
                    Number(latLng.lng.toFixed(6)),
                );
            });

            map.on('click', (e) => {
                const newLat = e.latlng.lat;
                const newLng = e.latlng.lng;
                marker.setLatLng([newLat, newLng]);
                onChange(Number(newLat.toFixed(6)), Number(newLng.toFixed(6)));
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update map center & marker position when external coordinates update
    useEffect(() => {
        if (mapInstanceRef.current && markerRef.current) {
            const currentMarkerLatLng = markerRef.current.getLatLng();

            if (
                currentMarkerLatLng.lat !== lat ||
                currentMarkerLatLng.lng !== lng
            ) {
                markerRef.current.setLatLng([lat, lng]);
                mapInstanceRef.current.setView([lat, lng], 15);
            }
        }
    }, [lat, lng]);

    return (
        <div
            ref={mapContainerRef}
            className="shadow-3xs z-0 h-44 w-full overflow-hidden rounded-xl border border-slate-200"
        />
    );
}
