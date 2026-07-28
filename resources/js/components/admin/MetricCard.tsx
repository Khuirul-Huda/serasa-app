/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

export default function MetricCard({
  label,
  value,
  subtitle,
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-navy-200/60 p-5 shadow-3xs flex items-center justify-between hover:border-pastel-teal transition-all font-sans text-navy-900">
      <div className="space-y-1">
        <span className="text-xs font-extrabold text-navy-500 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl sm:text-3xl font-black text-navy-900 leading-none block">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs text-navy-400 font-normal block pt-0.5">
            {subtitle}
          </span>
        )}
      </div>
      <div className="w-11 h-11 rounded-2xl bg-navy-50 border border-navy-200/60 flex items-center justify-center text-navy-600 shrink-0">
        {icon}
      </div>
    </div>
  );
}
