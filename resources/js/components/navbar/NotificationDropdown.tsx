/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, MapPin, ThumbsUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface NotificationDropdownProps {
  onOpen?: () => void;
}

export default function NotificationDropdown({
  onOpen,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onOpen?.();
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={handleToggle}
        className="p-2 text-navy-600 hover:text-pastel-teal hover:bg-navy-100 rounded-xl transition-all relative cursor-pointer"
        title="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pastel-coral rounded-full border border-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-navy-200 rounded-2xl shadow-xl z-50 py-3 px-3.5 animate-fade-in text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-navy-100">
            <span className="font-bold text-navy-900">Notifikasi Portal</span>
            <span className="text-[9px] text-navy-400 font-bold uppercase tracking-wider">
              Terbaru
            </span>
          </div>
          <div className="divide-y divide-navy-100 max-h-64 overflow-y-auto">
            <div className="py-2.5 space-y-0.5 bg-pastel-teal-light/20 px-1 rounded-lg">
              <span className="font-bold text-navy-800 text-[11px]">
                Toko Baru Terdaftar!
              </span>
              <p className="text-[10px] text-navy-500 font-normal leading-relaxed">
                Gethuk Manis Bu Marni baru saja bergabung ke etalase.
              </p>
              <span className="block text-[9px] text-navy-400 font-medium">
                10 menit yang lalu
              </span>
            </div>
            <div className="py-2.5 space-y-0.5">
              <span className="font-bold text-navy-800 text-[11px]">
                Verifikasi Berhasil
              </span>
              <p className="text-[10px] text-navy-500 font-normal leading-relaxed">
                Toko Kerajinan Bambu Lestari telah diverifikasi oleh Admin Desa.
              </p>
              <span className="block text-[9px] text-navy-400 font-medium">
                2 jam yang lalu
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
