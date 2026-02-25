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
    Briefcase
} from 'lucide-react';
import { cn } from '@/utils';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';

interface Props {
    header?: ReactNode;
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
        { label: 'Account', icon: Settings, href: route('profile.edit'), active: route().current('profile.edit') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
            {/* Sidebar Desktop - Autohide / Hover effect */}
            <aside 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "hidden md:flex flex-col border-r bg-white shadow-sm transition-all duration-300 ease-in-out z-50",
                    isHovered ? "w-64" : "w-16"
                )}
            >
                <div className="h-16 flex items-center px-4 border-b shrink-0 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <Typography variant="large" className="text-primary-foreground font-black text-xs lowercase">f</Typography>
                    </div>
                    <span className={cn("ml-3 font-bold tracking-tight transition-opacity duration-200 whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>
                        farros.space
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pt-6 px-2 space-y-1 no-scrollbar">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                item.active 
                                    ? "bg-primary text-primary-foreground shadow-sm" 
                                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", item.active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            <span className={cn("ml-3 font-medium transition-all duration-200 whitespace-nowrap", isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 uppercase text-[10px] pointer-events-none")}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="p-2 border-t space-y-1">
                    <Link 
                        href="/" 
                        className="flex items-center px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-all"
                    >
                        <Home className="w-5 h-5 shrink-0" />
                        <span className={cn("ml-3 text-sm font-medium transition-opacity whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>Home</span>
                    </Link>
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="w-full flex items-center px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={cn("ml-3 text-sm font-medium transition-opacity whitespace-nowrap", isHovered ? "opacity-100" : "opacity-0")}>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside 
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 z-[60] md:hidden transition-transform duration-300 ease-in-out p-6 flex flex-col",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex justify-between items-center mb-8">
                    <Typography variant="large" className="font-bold">Menu</Typography>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
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
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                                item.active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="pt-6 border-t">
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-left">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Navbar */}
                <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="md:hidden mr-4"
                            onClick={toggleMobile}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        {header && (
                            <div className="flex items-center">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-sm font-semibold">{auth.user.name}</span>
                            <span className="text-xs text-muted-foreground">{auth.user.email}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-muted border flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
