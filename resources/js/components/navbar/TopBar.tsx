/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Globe, Phone } from "lucide-react";
import React from "react";
import type { AppSettings } from "@/types";
import UserMenu from "./UserMenu";

interface TopBarProps {
  settings: AppSettings;
}

export default function TopBar({ settings }: TopBarProps) {
  return (
    <div className="bg-navy-50 border-b border-navy-200/60 py-1.5 px-4 text-[11px] text-navy-600 hidden sm:block">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side links */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-pastel-teal">
            <Globe className="w-3.5 h-3.5" />
            <span>{settings.villageName} Getasan</span>
          </span>
          <span className="text-navy-300">|</span>
          <a
            href={`https://wa.me/${settings.adminPhone}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-pastel-teal flex items-center gap-1 transition-all"
          >
            <Phone className="w-3 h-3" />
            <span>Helpline Desa: +{settings.adminPhone}</span>
          </a>
        </div>

        {/* Right side — user menu */}
        <UserMenu />
      </div>
    </div>
  );
}
