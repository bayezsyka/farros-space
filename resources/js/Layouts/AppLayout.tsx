import { Link, Head, usePage } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, MessageSquare, Mail, LayoutDashboard, Home, CalendarDays, Briefcase, Download, LogIn, LogOut, Monitor, Sun, Moon } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import useTranslation from '@/Hooks/useTranslation';
import { useTheme } from '@/Contexts/ThemeProvider';

interface Props {
    children: React.ReactNode;
    title?: string;
    overlayHeader?: boolean;
}

export default function AppLayout({ children, title, overlayHeader }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for subtle header shadow and background transition
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setMobileMenuOpen(false); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { locale } = usePage<PageProps>().props;
    const { __ } = useTranslation();

    const changeLocale = (newLocale: string) => {
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 0 && (segments[0] === 'id' || segments[0] === 'en')) {
            segments[0] = newLocale;
        } else {
            segments.unshift(newLocale);
        }
        window.location.href = '/' + segments.join('/') + window.location.search;
    };

    const navLinks = [
        { href: route('landing'), label: __('Home'), icon: Home },
        { href: route('threads.index'), label: __('Threads'), icon: MessageSquare },
        { href: route('marketplace.index'), label: __('Marketplace'), icon: ShoppingBag },
        { href: route('experiences.index'), label: __('Experience'), icon: Briefcase },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            <Head title={title} />

            <header
                className={`
                    fixed left-0 right-0 z-[100] w-full transition-all duration-300 ease-in-out
                    ${overlayHeader
                        ? scrolled
                            ? 'bg-background/95 backdrop-blur border-b shadow-sm'
                            : 'bg-transparent border-transparent'
                        : 'bg-background/95 backdrop-blur border-b shadow-sm'
                    }
                `}
            >
                <Container className="flex h-16 md:h-[72px] items-center justify-between gap-4">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all ${route().current(link.href.split('/').pop() || '')
                                    ? 'text-primary bg-primary/5'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side controls */}
                    <div className="flex items-center gap-2">
                        {/* ── Desktop Account / Sticky Side ── */}
                        <div className="hidden md:flex items-center gap-2">
                            {user ? (
                                <>
                                    {user.is_admin && (
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                        >
                                            <LayoutDashboard className="w-3.5 h-3.5" />
                                            {__('Dashboard')}
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-2 pl-2 border-l border-border ml-1 pr-1 mr-1">
                                        {user.avatar ? (
                                            <img src={user.avatar} className="w-7 h-7 rounded-full border border-primary/20 object-cover" alt={user.name} />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-muted-foreground hidden lg:inline mr-1">{user.name}</span>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            {__('Logout')}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <a
                                    href={route('auth.google')}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95 mr-2"
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    {__('Login with Google')}
                                </a>
                            )}
                        </div>

                        {/* ── Utility Section (Hides on Scroll, Desktop Only) ── */}
                        <div
                            className={`hidden md:flex items-center gap-2 transition-all duration-500 origin-right ${scrolled
                                ? 'opacity-0 scale-95 pointer-events-none max-w-0 -mr-2 overflow-hidden'
                                : 'opacity-100 scale-100 max-w-md'
                                }`}
                        >
                            {/* Language Switcher */}
                            <div className="flex items-center gap-1.5 pr-2 border-r border-border/50 mr-1 hidden sm:flex">
                                <button
                                    onClick={() => changeLocale('id')}
                                    className={`text-[10px] font-black w-6 h-6 rounded-md flex items-center justify-center transition-all ${locale === 'id' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                >
                                    ID
                                </button>
                                <button
                                    onClick={() => changeLocale('en')}
                                    className={`text-[10px] font-black w-6 h-6 rounded-md flex items-center justify-center transition-all ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                >
                                    EN
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <div className="hidden md:flex items-center gap-2">
                                    <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted/80 active:scale-95">
                                        <Mail className="w-3.5 h-3.5" />
                                        {__('Contact')}
                                    </Link>
                                    <Link href="/cv" className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-80 active:scale-95">
                                        <Download className="w-3.5 h-3.5" />
                                        {__('CV')}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE: Menu Trigger */}
                        <div className="md:hidden ml-1">
                            <button
                                className="z-50 p-2 -mr-1 transition-opacity hover:opacity-70 focus:outline-none"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Backdrop */}
            <div
                className={`fixed left-0 right-0 bottom-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ top: '72px' }}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel — full-width dropdown below navbar */}
            <div
                className={`fixed left-0 right-0 z-40 bg-background border-b border-border shadow-2xl transition-all duration-300 ease-in-out md:hidden rounded-b-3xl overflow-hidden ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
                    }`}
                style={{ top: '72px' }}
            >
                <nav className="flex flex-col p-4 space-y-0.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-3 pt-1 pb-1.5">{__('Menu')}</p>

                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-2xl transition-all active:scale-[0.98] ${route().current(link.href.split('/').pop() || '')
                                ? 'bg-primary/5 text-primary'
                                : 'text-foreground/80 hover:bg-muted'
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${route().current(link.href.split('/').pop() || '')
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted/50 text-muted-foreground'
                                }`}>
                                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                            </div>
                            {link.label}
                        </Link>
                    ))}

                    <div className="border-t border-border/40 my-2 mx-1" />

                    {user ? (
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-3 pb-1.5">{__('Account')}</p>

                            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/20 rounded-2xl border border-border/30 mb-1 mx-1">
                                {user.avatar ? (
                                    <img src={user.avatar} className="w-7 h-7 rounded-full border border-primary/20 object-cover flex-shrink-0" alt={user.name} />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 flex-shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate leading-tight">{user.name}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground truncate">{user.is_admin ? 'Admin Utama' : __('User')}</p>
                                </div>
                            </div>

                            {user.is_admin && (
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-2xl text-foreground/80 hover:bg-muted transition-all active:scale-[0.98]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="w-7 h-7 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                    </div>
                                    {__('Dashboard')}
                                </Link>
                            )}

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-destructive rounded-2xl hover:bg-destructive/5 transition-all w-full text-left active:scale-[0.98]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="w-7 h-7 rounded-xl bg-destructive/5 flex items-center justify-center text-destructive/70">
                                    <LogOut className="w-3.5 h-3.5" />
                                </div>
                                {__('Logout')}
                            </Link>
                        </div>
                    ) : (
                        <div className="px-1 py-1">
                            <a
                                href={route('auth.google')}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-2xl bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.97] transition-all"
                            >
                                <LogIn className="w-4 h-4" />
                                {__('Login with Google')}
                            </a>
                        </div>
                    )}

                    <div className="border-t border-border/40 my-2 mx-1" />

                    <div className="flex gap-2 px-1">
                        <Link href={route('contact')} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-muted/50 border border-border/50 px-2 py-2.5 text-[10px] font-bold text-foreground transition-all active:scale-[0.97]">
                                <Mail className="w-3.5 h-3.5" />
                                {__('Contact')}
                            </button>
                        </Link>
                        <Link href={route('cv.index')} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-2 py-2.5 text-[10px] font-bold text-background transition-all active:scale-[0.97]">
                                <Download className="w-3.5 h-3.5" />
                                {__('My CV')}
                            </button>
                        </Link>
                    </div>

                    {/* Language & Theme (Mobile Bottom) */}
                    <div className="mt-4 p-2 bg-muted/20 rounded-2xl border border-border/30">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex p-0.5 bg-background/50 rounded-lg border border-border/50">
                                <button
                                    onClick={() => changeLocale('id')}
                                    className={`text-[9px] font-black px-2.5 py-1.5 rounded-md transition-all ${locale === 'id' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    ID
                                </button>
                                <button
                                    onClick={() => changeLocale('en')}
                                    className={`text-[9px] font-black px-2.5 py-1.5 rounded-md transition-all ${locale === 'en' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    EN
                                </button>
                            </div>

                            <div className="flex p-0.5 bg-background/50 rounded-lg border border-border/50">
                                {[
                                    { id: 'light', icon: Sun },
                                    { id: 'dark', icon: Moon },
                                    { id: 'system', icon: Monitor }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`p-1.5 rounded-md transition-all ${theme === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                                        aria-label={`Set theme to ${t.id}`}
                                    >
                                        <t.icon className="w-3.5 h-3.5" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <main className={`flex-1 ${!overlayHeader ? 'pt-16 md:pt-[72px]' : ''}`}>
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="border-t bg-muted/20 mt-auto">
                <Container className="py-8 md:py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="font-bold text-foreground">farros.space</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {__('A personal digital space to share stories, thoughts, and items for sale.')}
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{__('Pages')}</p>
                            <div className="flex flex-col gap-2">
                                {[
                                    { href: route('landing'), label: 'Home' },
                                    { href: route('threads.index'), label: 'Threads' },
                                    { href: route('marketplace.index'), label: 'Marketplace' },
                                    { href: route('experiences.index'), label: 'Experience' },
                                    { href: route('contact'), label: 'Contact' },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                    >
                                        {__(link.label)}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{__('Contact')}</p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href={route('contact')}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit flex items-center gap-1.5"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    {__('Get in Touch')}
                                </Link>
                                <Link
                                    href={route('age')}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit flex items-center gap-1.5"
                                >
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    {__('Age Calculator')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <Typography variant="small" className="text-muted-foreground text-xs">
                            &copy; {new Date().getFullYear()} farros.space. {__('All rights reserved.')}
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Link href={route('marketplace.index')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" /> {__('Marketplace')}
                            </Link>
                            <Link href={route('threads.index')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> {__('Threads')}
                            </Link>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
