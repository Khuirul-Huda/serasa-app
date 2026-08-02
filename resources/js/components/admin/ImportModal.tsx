/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
    X,
    UploadCloud,
    FileSpreadsheet,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Download,
} from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

export interface ParsedImportRow {
    rowNum: number;
    ownerName: string;
    address: string;
    dusun: string;
    phone: string;
    name: string;
    category: string;
    nib: boolean;
    halal: boolean;
    pirt: boolean;
    isConflict: boolean;
    conflictShopName?: string;
    action: 'import' | 'skip';
}

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    importRows: ParsedImportRow[];
    isParsing: boolean;
    isSubmittingImport: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleAction: (rowNum: number) => void;
    onSubmitImport: () => void;
}

export default function ImportModal({
    isOpen,
    onClose,
    importRows,
    isParsing,
    isSubmittingImport,
    fileInputRef,
    onFileUpload,
    onToggleAction,
    onSubmitImport,
}: ImportModalProps) {
    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const validCount = importRows.filter((r) => r.action === 'import').length;
    const conflictCount = importRows.filter((r) => r.isConflict).length;

    const modalContent = (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex animate-fade-in cursor-pointer items-center justify-center bg-navy-900/60 p-4 font-sans text-navy-900 backdrop-blur-xs"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[85vh] w-full max-w-4xl cursor-default flex-col overflow-hidden rounded-3xl border border-navy-200 bg-white shadow-2xl"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/50 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold tracking-wider text-navy-900 uppercase sm:text-lg">
                                Import Massal Data UMKM (Excel)
                            </h3>
                            <p className="mt-0.5 text-xs font-normal text-navy-500 sm:text-sm">
                                Unggah berkas spreadsheet .xlsx / .xls untuk
                                memperbarui direktori toko desa secara otomatis.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-xl p-2 text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* File Upload Zone */}
                    <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/30 p-6 text-center transition-all hover:border-pastel-teal">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".xlsx,.xls"
                            onChange={onFileUpload}
                            className="hidden"
                        />
                        <UploadCloud className="mx-auto mb-2 h-10 w-10 text-pastel-teal" />
                        <span className="block text-sm font-bold text-navy-800">
                            Pilih Berkas Excel DATA UMKM
                        </span>
                        <span className="mt-1 block text-xs text-navy-400">
                            Format didukung: .xlsx atau .xls dengan kolom Nama
                            Pemilik, Alamat, No WA, Nama Toko, dll.
                        </span>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isParsing}
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer rounded-xl border-navy-200 text-xs font-bold tracking-wider text-navy-700 uppercase hover:bg-pastel-teal-light hover:text-pastel-teal sm:text-sm"
                            >
                                {isParsing
                                    ? 'Membaca File...'
                                    : 'Browse File Excel'}
                            </Button>
                            <a
                                href="/templates/Template_Import_UMKM_2026.xlsx"
                                download="Template_Import_UMKM_2026.xlsx"
                                className="inline-flex items-center gap-1.5 rounded-xl border border-pastel-teal/30 bg-white px-4 py-2.5 text-xs font-bold tracking-wider text-pastel-teal uppercase shadow-2xs transition-all hover:bg-pastel-teal hover:text-white sm:text-sm"
                            >
                                <Download className="h-4 w-4" />
                                <span>Unduh Template Excel</span>
                            </a>
                        </div>
                    </div>

                    {/* Parsed Rows Table */}
                    {importRows.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="font-bold tracking-wider text-navy-900 uppercase">
                                    Hasil Preview Data ({importRows.length}{' '}
                                    Baris)
                                </span>
                                <div className="flex gap-4 font-mono text-xs">
                                    <span className="flex items-center gap-1 font-bold text-pastel-teal">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {validCount} Didaftarkan
                                    </span>
                                    {conflictCount > 0 && (
                                        <span className="flex items-center gap-1 font-bold text-pastel-peach">
                                            <AlertTriangle className="h-4 w-4" />
                                            {conflictCount} Konflik Nama
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-64 overflow-hidden overflow-y-auto rounded-2xl border border-navy-200 text-xs sm:text-sm">
                                <table className="w-full text-left">
                                    <thead className="border-b border-navy-100 bg-navy-50 text-xs font-extrabold tracking-wider text-navy-600 uppercase">
                                        <tr>
                                            <th className="p-3">Baris</th>
                                            <th className="p-3">Pemilik</th>
                                            <th className="p-3">Nama Toko</th>
                                            <th className="p-3">Sektor</th>
                                            <th className="p-3">No. WA</th>
                                            <th className="p-3">
                                                Status / Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-100 font-medium">
                                        {importRows.map((row) => (
                                            <tr
                                                key={row.rowNum}
                                                className={
                                                    row.isConflict
                                                        ? 'bg-pastel-coral-light/20 hover:bg-pastel-coral-light/30'
                                                        : 'hover:bg-navy-50/50'
                                                }
                                            >
                                                <td className="p-3 font-mono text-xs text-navy-400">
                                                    #{row.rowNum}
                                                </td>
                                                <td className="p-3 font-bold text-navy-900">
                                                    {row.ownerName}
                                                </td>
                                                <td className="p-3 text-navy-800">
                                                    {row.name}
                                                    {row.isConflict && (
                                                        <span className="mt-0.5 block text-xs font-bold text-pastel-coral">
                                                            ⚠️ Konflik: Mirip "
                                                            {
                                                                row.conflictShopName
                                                            }
                                                            "
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-navy-600">
                                                    {row.category}
                                                </td>
                                                <td className="p-3 font-mono text-xs text-navy-600">
                                                    {row.phone}
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() =>
                                                            onToggleAction(
                                                                row.rowNum,
                                                            )
                                                        }
                                                        className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-bold tracking-wider uppercase transition-all ${
                                                            row.action ===
                                                            'import'
                                                                ? 'bg-pastel-teal text-white'
                                                                : 'bg-navy-200 text-navy-600 hover:bg-navy-300'
                                                        }`}
                                                    >
                                                        {row.action === 'import'
                                                            ? 'Import'
                                                            : 'Lewati'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-navy-100 bg-navy-50/50 p-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl border-navy-200 text-xs text-navy-600 sm:text-sm"
                    >
                        Batal
                    </Button>

                    {importRows.length > 0 && (
                        <Button
                            type="button"
                            disabled={isSubmittingImport || validCount === 0}
                            onClick={onSubmitImport}
                            className="shadow-3xs flex cursor-pointer items-center gap-2 rounded-xl bg-pastel-teal text-xs font-extrabold tracking-wider text-white uppercase hover:bg-pastel-teal/90 sm:text-sm"
                        >
                            {isSubmittingImport ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                    <span>Mengimpor Data...</span>
                                </>
                            ) : (
                                <span>Proses Import ({validCount} Toko)</span>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
