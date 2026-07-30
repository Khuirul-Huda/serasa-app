/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-xs animate-fade-in font-sans text-navy-900">
      <div className="bg-white rounded-3xl border border-navy-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-scale-in">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isDanger
                ? "bg-pastel-coral-light border-pastel-coral/30 text-pastel-coral"
                : "bg-pastel-peach-light border-pastel-peach/30 text-pastel-peach"
            }`}
          >
            {isDanger ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div className="space-y-1.5 min-w-0">
            <h3 className="font-extrabold text-navy-900 text-base leading-tight uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-xs text-navy-500 font-normal leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-navy-100">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-xl border-navy-200 text-navy-600 text-xs font-bold cursor-pointer"
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl text-white text-xs font-black uppercase tracking-wider shadow-3xs cursor-pointer ${
              isDanger
                ? "bg-pastel-coral hover:bg-pastel-coral/90"
                : "bg-pastel-teal hover:bg-pastel-teal/90"
            }`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
