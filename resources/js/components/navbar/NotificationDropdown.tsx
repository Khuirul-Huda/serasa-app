/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Store, CheckCircle2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import type { Shop } from "@/types";

interface NotificationDropdownProps {
  shops?: Shop[];
  onOpen?: () => void;
}

export default function NotificationDropdown({
  shops = [],
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

  const verifiedShops = shops.filter((s) => s.isVerified).slice(0, 3);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={handleToggle}
        className="p-2 text-navy-600 hover:text-pastel-teal hover:bg-navy-100 rounded-xl transition-all relative cursor-pointer"
        title="Notifikasi Portal"
      >
        <Bell className="w-5 h-5" />
        {verifiedShops.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pastel-coral rounded-full border border-white" />
        )}
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
            {verifiedShops.length === 0 ? (
              <div className="py-6 text-center text-navy-400 italic text-xs">
                Belum ada pembaruan notifikasi
              </div>
            ) : (
              verifiedShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.id}`}
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 flex items-start gap-2.5 hover:bg-navy-50/50 p-1.5 rounded-xl transition-colors block"
                >
                  <div className="w-7 h-7 rounded-lg bg-pastel-teal-light text-pastel-teal flex items-center justify-center shrink-0 border border-pastel-teal/20 mt-0.5">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-navy-800 text-[11px] truncate">
                        {shop.name}
                      </span>
                      <CheckCircle2 className="w-3 h-3 text-pastel-teal shrink-0" />
                    </div>
                    <p className="text-[10px] text-navy-500 font-normal leading-relaxed line-clamp-1">
                      Toko UMKM sektor {shop.category} aktif di {shop.dusun}.
                    </p>
                    <span className="block text-[9px] text-navy-400 font-medium">
                      Status Terverifikasi
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
