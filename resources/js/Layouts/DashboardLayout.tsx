import React, { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Home,
    Settings,
    Briefcase,
    Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/utils';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';

interface Props {
    header?: ReactNode | string;
}

export default function DashboardLayout({ children, header }: PropsWithChildren<Props>) {
    const { auth } = usePage<any>().props;
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: route('dashboard'), active: route().current('dashboard') },
        { label: 'Biodata', icon: User, href: route('dashboard.biodata'), active: route().current('dashboard.biodata') },
        { label: 'Threads', icon: MessageSquare, href: route('dashboard.threads'), active: route().current('dashboard.threads') },
        { label: 'Marketplace', icon: Briefcase, href: route('dashboard.marketplace.index'), active: route().current('dashboard.marketplace.*') },
        { label: 'Social Links', icon: LinkIcon, href: route('dashboard.social-links.index'), active: route().current('dashboard.social-links.*') },
        { label: 'Account', icon: Settings, href: route('profile.edit'), active: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-zinc-50/50 flex overflow-hidden font-sans">
            {/* Sidebar Desktop - Autohide / Hover effect */}
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "hidden md:flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 ease-in-out z-50",
                    isHovered ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-zinc-100 shrink-0 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                        <Typography variant="large" className="text-white font-black text-xs lowercase">f</Typography>
                    </div>
                    <span className={cn("ml-3 font-bold text-zinc-900 tracking-tight transition-opacity duration-200 whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>
                        farros.space
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pt-6 px-3 space-y-1 no-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                item.active
                                    ? "bg-zinc-100 text-zinc-900"
                                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", item.active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900")} />
                            <span className={cn("ml-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap", isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none")}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="p-3 border-t border-zinc-100 space-y-1">
                    <Link
                        href="/"
                        className="flex items-center px-3 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-semibold text-sm"
                    >
                        <Home className="w-5 h-5 shrink-0" />
                        <span className={cn("ml-3 transition-opacity whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>Home</span>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-semibold text-sm"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={cn("ml-3 transition-opacity whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-white border-r border-zinc-100 z-[60] md:hidden transition-transform duration-300 ease-in-out p-6 flex flex-col shadow-2xl",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="large" className="font-bold text-zinc-900">Menu</Typography>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-semibold",
                                item.active ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="pt-6 border-t border-zinc-100">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm text-left">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white flex items-center justify-between px-6 md:px-10 border-b border-zinc-100 shrink-0">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden mr-4 rounded-full"
                            onClick={toggleMobile}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        {header && (
                            <div className="flex items-center">
                                {typeof header === 'string' ? (
                                    <span className="font-bold text-zinc-900 text-sm">{header}</span>
                                ) : (
                                    header
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-zinc-900">{auth.user.name}</span>
                            <span className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase">{auth.user.is_admin ? 'Administrator' : 'User'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-zinc-400" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
