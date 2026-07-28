/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <AppLogoIcon className="size-8 shrink-0" />
            <div className="flex flex-col text-left font-sans">
                <span className="text-navy-900 font-black text-sm tracking-tight uppercase leading-none">
                    SAMIRONO <span className="text-pastel-teal">ETALASE</span>
                </span>
                <span className="text-[8.5px] text-navy-400 font-bold uppercase tracking-widest leading-tight mt-0.5">
                    Sentra Ekonomi Desa
                </span>
            </div>
        </div>
    );
}
