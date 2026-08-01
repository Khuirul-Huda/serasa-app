import { Link, usePage } from '@inertiajs/react';
import { User, ShieldCheck, Palette, Settings } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import MarketplaceLayout from '@/layouts/marketplace-layout';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { AppSettings, Category, Product } from '@/types';

const sidebarNavItems = [
    {
        title: 'Profil Pengguna',
        href: edit(),
        icon: User,
    },
    {
        title: 'Keamanan & Sandi',
        href: editSecurity(),
        icon: ShieldCheck,
    },
    {
        title: 'Tampilan Aplikasi',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { props } = usePage();
    const settings = props.settings as AppSettings | undefined;
    const categories = (props.categories as Category[]) || [];
    const products = (props.products as Product[]) || [];

    return (
        <MarketplaceLayout
            settings={settings}
            categories={categories}
            products={products}
            activeTab="admin"
        >
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans text-navy-900 animate-fade-in space-y-6">
                {/* Header Banner */}
                <div className="shadow-3xs space-y-2 rounded-3xl border border-navy-200/60 bg-white p-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pastel-teal text-white shadow-2xs">
                            <Settings className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black tracking-wider text-pastel-teal uppercase">
                            Pengaturan Portal
                        </span>
                    </div>
                    <Heading
                        title="Pengaturan Akun & Keamanan"
                        description="Kelola data profil pengguna, perbarui kata sandi, dan atur tema tampilan portal."
                    />
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Navigation Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <nav
                            className="flex flex-row lg:flex-col gap-1 overflow-x-auto rounded-2xl border border-navy-200/60 bg-white p-2 shadow-2xs"
                            aria-label="Pengaturan Navigasi"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isCurrentOrParentUrl(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all whitespace-nowrap',
                                            isActive
                                                ? 'border border-pastel-teal/20 bg-pastel-teal-light text-pastel-teal shadow-2xs'
                                                : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900',
                                        )}
                                    >
                                        <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-pastel-teal' : 'text-navy-400')} />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="my-2 lg:hidden" />

                    {/* Content Area Box */}
                    <main className="flex-1 min-w-0">
                        <div className="shadow-3xs rounded-3xl border border-navy-200/60 bg-white p-6 sm:p-8">
                            <div className="max-w-xl space-y-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
