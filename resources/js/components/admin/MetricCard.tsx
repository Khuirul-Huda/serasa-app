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
    <div className="bg-white rounded-3xl border border-navy-200/60 p-5 shadow-3xs flex items-center justify-between hover:border-pastel-teal/30 transition-all">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block">
          {label}
        </span>
        <span className="text-2xl font-black text-navy-900 leading-none block">
          {value}
        </span>
        {subtitle && (
          <span className="text-[9.5px] text-navy-400 font-medium block">
            {subtitle}
          </span>
        )}
      </div>
      <div className="w-10 h-10 rounded-2xl bg-navy-50 border border-navy-200/60 flex items-center justify-center text-navy-400 shrink-0">
        {icon}
      </div>
    </div>
  );
}
