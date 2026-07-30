/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Globe, Phone } from 'lucide-react';
import React from 'react';
import type { AppSettings } from '@/types';
import UserMenu from './UserMenu';

interface TopBarProps {
    settings: AppSettings;
}

export default function TopBar({ settings }: TopBarProps) {
    return (
        <div className="hidden border-b border-navy-200/60 bg-navy-50 px-4 py-1.5 text-xs text-navy-600 sm:block">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Left side links */}
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-semibold text-pastel-teal">
                        <Globe className="h-3.5 w-3.5" />
                        <span>{settings.villageName} Getasan</span>
                    </span>
                    <span className="text-navy-300">|</span>
                    <a
                        href={`https://wa.me/${settings.adminPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 transition-all hover:text-pastel-teal"
                    >
                        <Phone className="h-3 w-3" />
                        <span>Helpline Desa: +{settings.adminPhone}</span>
                    </a>
                </div>

                {/* Right side — user menu */}
                <UserMenu />
            </div>
        </div>
    );
}
