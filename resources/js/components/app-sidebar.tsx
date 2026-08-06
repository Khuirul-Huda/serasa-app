import { Link, usePage } from '@inertiajs/react';
import {
    ShoppingBag,
    ShieldCheck,
    Store,
    Newspaper,
    Activity,
    Package,
    MessageSquare,
    Layers,
    Users,
    Settings,
    ArrowLeft,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';

export function AppSidebar() {
    const page = usePage<{
        auth?: { user?: { role?: string } };
        shops?: any[];
        products?: any[];
        reviews?: any[];
        categories?: any[];
        users?: any[];
        articles?: any[];
    }>();
    const user = page.props.auth?.user;
    const currentUrl = page.url;

    const adminNavItems =
        user?.role === 'admin'
            ? [
                  {
                      title: 'Statistik',
                      href: '/admin/dashboard?tab=stats',
                      icon: Activity,
                      key: 'stats',
                  },
                  {
                      title: `Kelola UMKM (${page.props.shops?.length ?? 0})`,
                      href: '/admin/dashboard?tab=shops',
                      icon: Store,
                      key: 'shops',
                  },
                  {
                      title: `Moderasi Produk (${page.props.products?.length ?? 0})`,
                      href: '/admin/dashboard?tab=products',
                      icon: Package,
                      key: 'products',
                  },
                  {
                      title: `Ulasan (${page.props.reviews?.length ?? 0})`,
                      href: '/admin/dashboard?tab=reviews',
                      icon: MessageSquare,
                      key: 'reviews',
                  },
                  {
                      title: `Sektor (${page.props.categories?.length ?? 0})`,
                      href: '/admin/dashboard?tab=categories',
                      icon: Layers,
                      key: 'categories',
                  },
                  {
                      title: `Akun (${page.props.users?.length ?? 0})`,
                      href: '/admin/dashboard?tab=users',
                      icon: Users,
                      key: 'users',
                  },
                  {
                      title: `Kabar Desa & Artikel (${page.props.articles?.length ?? 0})`,
                      href: '/admin/dashboard?tab=articles',
                      icon: Newspaper,
                      key: 'articles',
                  },
                  {
                      title: 'Konfigurasi',
                      href: '/admin/dashboard?tab=config',
                      icon: Settings,
                      key: 'config',
                  },
              ]
            : [
                  {
                      title: 'Kelola Toko Saya',
                      href: '/merchant/dashboard',
                      icon: Store,
                      key: 'merchant',
                  },
              ];

    const isTabActive = (itemHref: string) => {
        if (currentUrl === itemHref) return true;
        if (
            currentUrl === '/admin/dashboard' &&
            itemHref === '/admin/dashboard?tab=stats'
        ) {
            return true;
        }

        return false;
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Admin Menu Group */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="flex items-center gap-1 font-extrabold text-pastel-teal">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Panel Admin Desa</span>
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isTabActive(item.href);

                            return (
                                <SidebarMenuItem key={item.key}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} preserveState preserveScroll>
                                            <Icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Direct link back to public marketplace */}
                <SidebarGroup className="mt-auto px-2 py-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'Ke Pasar Etalase' }}>
                                <Link
                                    href="/"
                                    className="text-navy-600 hover:text-pastel-teal dark:text-navy-300"
                                >
                                    <ArrowLeft />
                                    <span>Ke Etalase Publik</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
