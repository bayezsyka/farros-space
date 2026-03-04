import { Link, Head, usePage } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, MessageSquare, Mail, LayoutDashboard } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for subtle header shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
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

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: route('threads.index'), label: 'Threads', icon: MessageSquare },
        { href: route('marketplace.index'), label: 'Marketplace', icon: ShoppingBag },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            <Head title={title} />

            {/* ── Header ── */}
            <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
                <Container className="flex h-14 md:h-[60px] items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 z-50 group flex-shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center group-hover:opacity-80 transition-opacity">
                            <span className="text-background text-xs font-black">F</span>
                        </div>
                        <Typography variant="large" className="font-bold tracking-tight text-sm md:text-base hidden sm:block">
                            farros.space
                        </Typography>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                            >
                                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {user.is_admin && (
                                    <Link
                                        href={route('dashboard')}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        Dashboard
                                    </Link>
                                )}
                                <div className="flex items-center gap-2 pl-2 border-l border-border ml-1">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            </>
                        ) : null}

                        <Link href="/contact">
                            <button className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-80 active:scale-95">
                                <Mail className="w-3.5 h-3.5" />
                                Contact
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden z-50 p-2 -mr-1 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </Container>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-[57px] right-0 z-40 w-full max-w-[280px] h-[calc(100dvh-57px)] bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <nav className="flex flex-col p-4 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">Menu</p>

                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.icon && <link.icon className="w-4 h-4 text-muted-foreground" />}
                            {link.label}
                        </Link>
                    ))}

                    {user && (
                        <>
                            <div className="border-t border-border/50 my-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-1 pb-1">Akun</p>

                            {user.is_admin && (
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium rounded-xl hover:bg-muted transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                                    Dashboard
                                </Link>
                            )}

                            <div className="flex items-center gap-3 px-3 py-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">Masuk</p>
                                </div>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center px-3 py-3 text-[15px] font-medium text-destructive rounded-xl hover:bg-destructive/5 transition-colors w-full text-left"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Logout
                            </Link>
                        </>
                    )}

                    <div className="border-t border-border/50 my-2" />
                    <div className="px-2 pt-1">
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-80">
                                <Mail className="w-4 h-4" />
                                Hubungi Saya
                            </button>
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="border-t bg-muted/20 mt-auto">
                <Container className="py-8 md:py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
                                    <span className="text-background text-xs font-black">F</span>
                                </div>
                                <span className="font-bold text-foreground">farros.space</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ruang digital pribadi untuk berbagi cerita, pikiran, dan barang-barang yang ingin dijual.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Halaman</p>
                            <div className="flex flex-col gap-2">
                                {[
                                    { href: '/', label: 'Home' },
                                    { href: route('threads.index'), label: 'Threads' },
                                    { href: route('marketplace.index'), label: 'Marketplace' },
                                    { href: '/contact', label: 'Contact' },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Kontak</p>
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/contact"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit flex items-center gap-1.5"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    Get in Touch
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <Typography variant="small" className="text-muted-foreground text-xs">
                            &copy; {new Date().getFullYear()} farros.space. All rights reserved.
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Link href={route('marketplace.index')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3" /> Marketplace
                            </Link>
                            <Link href={route('threads.index')} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" /> Threads
                            </Link>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
