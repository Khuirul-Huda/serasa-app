/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

interface AddProductFormProps {
    form: any;
    categories: Category[];
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
}

export default function AddProductForm({
    form,
    categories,
    onSubmit,
    onCancel,
}: AddProductFormProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) {
            return;
        }

        const existingFiles = (form.data.images || []) as File[];
        const combinedFiles = [...existingFiles, ...selectedFiles].slice(0, 5);

        form.setData('images', combinedFiles);
        form.setData('image', combinedFiles[0] || null);

        const newPreviews = combinedFiles.map((file) =>
            typeof file === 'string' ? file : URL.createObjectURL(file),
        );
        setPreviews(newPreviews);
    };

    const handleRemoveImage = (index: number) => {
        const existingFiles = (form.data.images || []) as File[];
        const updatedFiles = existingFiles.filter((_, i) => i !== index);

        form.setData('images', updatedFiles);
        form.setData('image', updatedFiles[0] || null);

        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
    };

    return (
        <div className="shadow-3xs space-y-4 rounded-3xl border border-navy-200/60 bg-white p-6 font-sans text-navy-900">
            <div>
                <h4 className="text-base font-extrabold tracking-wide text-navy-900 uppercase">
                    Rincian Produk Baru
                </h4>
                <p className="mt-0.5 text-xs font-normal text-navy-500 sm:text-sm">
                    Lengkapi parameters berikut untuk menampilkan produk di
                    etalase utama. Anda dapat mengunggah hingga 5 foto produk.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Nama Produk
                        </Label>
                        <Input
                            type="text"
                            required
                            placeholder="Contoh: Susu Stroberi Segar"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Kategori Komoditas
                        </Label>
                        <select
                            value={form.data.categoryId}
                            onChange={(e) =>
                                form.setData('categoryId', e.target.value)
                            }
                            className="shadow-3xs w-full cursor-pointer rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-navy-800 uppercase focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Harga Jual (Rupiah)
                        </Label>
                        <Input
                            type="number"
                            required
                            placeholder="Contoh: 15000"
                            value={form.data.price}
                            onChange={(e) =>
                                form.setData('price', e.target.value)
                            }
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Satuan Takaran
                        </Label>
                        <Input
                            type="text"
                            required
                            placeholder="Pcs, Liter, Kg, Botol"
                            value={form.data.unit}
                            onChange={(e) =>
                                form.setData('unit', e.target.value)
                            }
                            className="rounded-xl border-navy-200/60 text-xs focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                            Foto Produk (Maksimal 5 Foto)
                        </Label>
                        <span className="text-2xs font-semibold text-navy-400">
                            {previews.length} / 5 Foto Terpilih
                        </span>
                    </div>

                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={previews.length >= 5}
                        onChange={handleFileChange}
                        className="cursor-pointer rounded-xl border-navy-200/60 bg-white py-1 text-xs text-navy-500 focus-visible:border-pastel-teal focus-visible:ring-pastel-teal/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    {/* Multi-image thumbnail preview grid */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 pt-2">
                            {previews.map((src, index) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-xl border border-navy-200 bg-navy-50"
                                >
                                    <img
                                        src={src}
                                        alt={`Preview ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    {index === 0 && (
                                        <span className="absolute top-1 left-1 rounded bg-pastel-teal px-1.5 py-0.5 text-[9px] font-black text-white uppercase shadow-xs">
                                            Sampul
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-navy-900/70 text-white opacity-90 transition-opacity hover:bg-pastel-coral group-hover:opacity-100"
                                        title="Hapus foto ini"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label className="block text-xs font-bold tracking-wider text-navy-500 uppercase">
                        Deskripsi Uraian Produk
                    </Label>
                    <textarea
                        rows={3}
                        placeholder="Jelaskan spesifikasi keunikan rasa susu, bahan baku bambu anyaman, atau cita rasa produk kuliner Anda..."
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData('description', e.target.value)
                        }
                        className="shadow-3xs w-full resize-none rounded-xl border border-navy-200/60 bg-white px-4 py-2.5 text-xs font-medium text-navy-800 transition-all focus:border-pastel-teal focus:ring-2 focus:ring-pastel-teal/20 focus:outline-none sm:text-sm"
                    />
                </div>

                <div className="flex justify-end gap-2 border-t border-navy-100 pt-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="h-10 rounded-xl border-navy-200 text-xs text-navy-600 sm:text-sm"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="shadow-3xs h-10 cursor-pointer rounded-xl bg-pastel-teal px-5 text-xs font-extrabold tracking-wider text-white uppercase transition-all hover:bg-pastel-teal/90 sm:text-sm"
                    >
                        {form.processing ? 'Menyimpan...' : 'Luncurkan Produk'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
