/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { formatIDR } from '@/utils';

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
            if (
                cartRef.current &&
                !cartRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
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
                className="relative cursor-pointer rounded-xl p-2 text-navy-600 transition-all hover:bg-navy-100 hover:text-pastel-teal"
                title="Keranjang Simulasi"
                id="navbar-cart-trigger"
            >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-pastel-coral text-[8px] font-extrabold text-white">
                        {cartItems.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 w-76 animate-fade-in rounded-2xl border border-navy-200 bg-white px-4 py-3.5 text-xs shadow-xl sm:w-80">
                    <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                        <span className="text-sm font-bold text-navy-900">
                            Keranjang Simulasi ({cartItems.length})
                        </span>
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-bold text-pastel-teal hover:underline"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="py-8 text-center text-navy-400 italic">
                            Keranjang belanja kosong
                        </div>
                    ) : (
                        <div className="max-h-56 divide-y divide-navy-100 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-start gap-2.5 py-2.5"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-10 w-10 shrink-0 rounded-lg border object-cover"
                                    />
                                    <div className="min-w-0 flex-grow">
                                        <span className="block truncate text-[11px] font-bold text-navy-800 transition-colors group-hover:text-pastel-teal">
                                            {item.name}
                                        </span>
                                        <span className="mt-0.5 block text-[10px] text-navy-400">
                                            {item.qty} x {formatIDR(item.price)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) =>
                                            handleDeleteCartItem(item.id, e)
                                        }
                                        className="rounded-md p-1 text-navy-400 hover:bg-pastel-coral-light hover:text-pastel-coral"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="space-y-3 border-t border-navy-100 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-navy-500">
                                    Total Harga:
                                </span>
                                <span className="text-sm font-bold text-navy-900">
                                    {formatIDR(cartTotal)}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    toast.info(
                                        'Simulasi Pemesanan: Pembelian sungguhan langsung dilakukan via WhatsApp ke Pelaku UMKM di detail produk.',
                                        { duration: 5000 },
                                    );
                                    setIsOpen(false);
                                }}
                                className="shadow-3xs block w-full cursor-pointer rounded-xl bg-pastel-teal py-2 text-center text-[9px] font-bold tracking-wider text-white uppercase hover:bg-pastel-teal/90"
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
