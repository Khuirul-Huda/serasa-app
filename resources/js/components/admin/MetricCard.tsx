/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

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
        <div className="shadow-3xs flex items-center justify-between rounded-3xl border border-navy-200/60 bg-white p-5 font-sans text-navy-900 transition-all hover:border-pastel-teal">
            <div className="space-y-1">
                <span className="block text-xs font-extrabold tracking-wider text-navy-500 uppercase">
                    {label}
                </span>
                <span className="block text-2xl leading-none font-black text-navy-900 sm:text-3xl">
                    {value}
                </span>
                {subtitle && (
                    <span className="block pt-0.5 text-xs font-normal text-navy-400">
                        {subtitle}
                    </span>
                )}
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-navy-200/60 bg-navy-50 text-navy-600">
                {icon}
            </div>
        </div>
    );
}
