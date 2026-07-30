/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePage } from "@inertiajs/react";
import React from "react";
import AppLogoIcon from "@/components/app-logo-icon";

interface AppLogoProps {
  appName?: string;
  tagline?: string;
}

export default function AppLogo({ appName, tagline }: AppLogoProps) {
  const { settings } = usePage().props as any;
  const resolvedAppName = appName || settings?.appName || "SAMIRONO ETALASE";
  const resolvedTagline = tagline || settings?.tagline || "Sentra Ekonomi Desa";

  const parts = resolvedAppName.split(" ");
  const firstWord = parts[0];
  const restWords = parts.slice(1).join(" ");

  return (
    <div className="flex items-center gap-2.5">
      <AppLogoIcon className="size-8 shrink-0" />
      <div className="flex flex-col text-left font-sans">
        <span className="text-navy-900 font-black text-sm tracking-tight uppercase leading-none">
          {firstWord}{" "}
          {restWords ? <span className="text-pastel-teal">{restWords}</span> : null}
        </span>
        <span className="text-[8.5px] text-navy-400 font-bold uppercase tracking-widest leading-tight mt-0.5">
          {resolvedTagline}
        </span>
      </div>
    </div>
  );
}
