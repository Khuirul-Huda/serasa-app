/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, UploadCloud, FileSpreadsheet, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

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
  action: "import" | "skip";
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
  if (!isOpen) return null;

  const validCount = importRows.filter((r) => r.action === "import").length;
  const conflictCount = importRows.filter((r) => r.isConflict).length;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-navy-200 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-navy-100 flex justify-between items-center bg-navy-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pastel-teal-light text-pastel-teal flex items-center justify-center border border-pastel-teal/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy-900 text-base uppercase tracking-wider">
                Import Massal Data UMKM (Excel)
              </h3>
              <p className="text-xs text-navy-500 mt-0.5">
                Unggah berkas spreadsheet .xlsx / .xls untuk memperbarui direktori toko desa secara otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-navy-200 rounded-2xl p-6 text-center hover:border-pastel-teal transition-all bg-navy-50/30">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={onFileUpload}
              className="hidden"
            />
            <UploadCloud className="w-10 h-10 text-pastel-teal mx-auto mb-2" />
            <span className="text-xs font-bold text-navy-800 block">
              Pilih Berkas Excel DATA UMKM
            </span>
            <span className="text-[10px] text-navy-400 block mt-1">
              Format didukung: .xlsx atau .xls dengan kolom Nama Pemilik, Alamat, No WA, Nama Toko, dll.
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={isParsing}
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 rounded-xl border-navy-200 text-navy-700 hover:bg-pastel-teal-light hover:text-pastel-teal text-xs font-bold uppercase tracking-wider"
            >
              {isParsing ? "Membaca File..." : "Browse File Excel"}
            </Button>
          </div>

          {/* Parsed Rows Table */}
          {importRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-navy-900 uppercase tracking-wider">
                  Hasil Preview Data ({importRows.length} Baris)
                </span>
                <div className="flex gap-3 text-[11px]">
                  <span className="text-pastel-mint font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validCount} Didaftarkan
                  </span>
                  {conflictCount > 0 && (
                    <span className="text-pastel-peach font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {conflictCount} Konflik Nama
                    </span>
                  )}
                </div>
              </div>

              <div className="border border-navy-200 rounded-2xl overflow-hidden max-h-64 overflow-y-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-navy-50 border-b border-navy-100 text-[10px] uppercase font-bold text-navy-500 tracking-wider">
                    <tr>
                      <th className="p-3">Baris</th>
                      <th className="p-3">Pemilik</th>
                      <th className="p-3">Nama Toko</th>
                      <th className="p-3">Sektor</th>
                      <th className="p-3">No. WA</th>
                      <th className="p-3">Status / Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100 font-medium">
                    {importRows.map((row) => (
                      <tr
                        key={row.rowNum}
                        className={
                          row.isConflict
                            ? "bg-pastel-coral-light/20 hover:bg-pastel-coral-light/30"
                            : "hover:bg-navy-50/50"
                        }
                      >
                        <td className="p-3 font-mono text-[10px] text-navy-400">
                          #{row.rowNum}
                        </td>
                        <td className="p-3 font-bold text-navy-900">
                          {row.ownerName}
                        </td>
                        <td className="p-3 text-navy-800">
                          {row.name}
                          {row.isConflict && (
                            <span className="block text-[9px] text-pastel-coral font-bold mt-0.5">
                              ⚠️ Konflik: Mirip "{row.conflictShopName}"
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-navy-600">{row.category}</td>
                        <td className="p-3 font-mono text-[11px] text-navy-600">
                          {row.phone}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => onToggleAction(row.rowNum)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                              row.action === "import"
                                ? "bg-pastel-teal text-white"
                                : "bg-navy-200 text-navy-600 hover:bg-navy-300"
                            }`}
                          >
                            {row.action === "import" ? "Import" : "Lewati"}
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
        <div className="p-4 border-t border-navy-100 flex justify-between items-center bg-navy-50/50">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-navy-200 text-navy-600"
          >
            Batal
          </Button>

          {importRows.length > 0 && (
            <Button
              type="button"
              disabled={isSubmittingImport || validCount === 0}
              onClick={onSubmitImport}
              className="bg-pastel-teal hover:bg-pastel-teal/90 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-3xs flex items-center gap-2"
            >
              {isSubmittingImport ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
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
