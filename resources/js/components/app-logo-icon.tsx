/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="40" height="40" rx="12" fill="#00B4D8" />
            <path
                d="M25 14C23.8 12.8 22.1 12 20 12C15.6 12 13 14.5 13 18C13 23.5 27 21 27 26.5C27 30 24.2 32.5 19.5 32.5C16.8 32.5 14.5 31.4 13 29.8"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
