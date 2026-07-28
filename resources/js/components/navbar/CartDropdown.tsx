/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, Trash2, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import { formatIDR } from "@/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CartDropdownProps {
  onOpen?: () => void;
}

export default function CartDropdown({ onOpen }: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteCartItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onOpen?.();
  };

  return (
    <div className="relative" ref={cartRef}>
      <button
        onClick={handleToggle}
        className="p-2 text-navy-600 hover:text-pastel-teal hover:bg-navy-100 rounded-xl transition-all relative cursor-pointer"
        title="Keranjang Simulasi"
        id="navbar-cart-trigger"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItems.length > 0 && (
          <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-pastel-coral text-white font-extrabold text-[8px] flex items-center justify-center rounded-full border-2 border-white">
            {cartItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-white border border-navy-200 rounded-2xl shadow-xl z-50 py-3.5 px-4 animate-fade-in text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-navy-100">
            <span className="font-bold text-navy-900 text-sm">
              Keranjang Simulasi ({cartItems.length})
            </span>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-[10px] text-pastel-teal hover:underline font-bold"
            >
              Lihat Semua
            </Link>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-navy-400 italic">
              Keranjang belanja kosong
            </div>
          ) : (
            <div className="divide-y divide-navy-100 max-h-56 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-start gap-2.5 group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover border shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="block font-bold text-navy-800 text-[11px] truncate group-hover:text-pastel-teal transition-colors">
                      {item.name}
                    </span>
                    <span className="block text-[10px] text-navy-400 mt-0.5">
                      {item.qty} x {formatIDR(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteCartItem(item.id, e)}
                    className="text-navy-400 hover:text-pastel-coral p-1 rounded-md hover:bg-pastel-coral-light"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="pt-3 border-t border-navy-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-navy-500 font-medium">Total Harga:</span>
                <span className="font-bold text-sm text-navy-900">
                  {formatIDR(cartTotal)}
                </span>
              </div>
              <button
                onClick={() => {
                  alert(
                    "Ini adalah simulasi pemesanan. Pembelian sungguhan langsung dilakukan dengan menghubungi WhatsApp Pelaku UMKM bersangkutan di detail produk.",
                  );
                  setIsOpen(false);
                }}
                className="w-full py-2 bg-pastel-teal hover:bg-pastel-teal/90 text-white font-bold uppercase tracking-wider text-[9px] rounded-xl text-center shadow-3xs cursor-pointer block"
              >
                Beli Langsung (Hubungi Penjual)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
