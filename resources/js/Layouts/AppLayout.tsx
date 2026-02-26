import { Link, Head, usePage } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change / resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            <Head title={title} />
            
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Container className="flex h-14 md:h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 z-50">
                        <Typography variant="large" className="font-bold tracking-tight text-base md:text-lg">
                            farros.space
                        </Typography>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        <Link href={route('threads.index')} className="text-sm font-medium transition-colors hover:text-primary">
                            Threads
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.is_admin && (
                                    <Link href={route('dashboard')} className="text-sm font-medium hover:text-primary transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
                                <Link href={route('logout')} method="post" as="button" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Logout
                                </Link>
                            </div>
                        ) : null}

                        <Link href="/contact">
                            <button className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                Contact Me
                            </button>
                        </Link>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden z-50 p-2 -mr-2 rounded-lg hover:bg-zinc-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </Container>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-[57px] right-0 z-40 w-full max-w-[300px] h-[calc(100dvh-57px)] bg-background border-l shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <nav className="flex flex-col p-6 space-y-1">
                    <Link 
                        href="/" 
                        className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link 
                        href={route('threads.index')} 
                        className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Threads
                    </Link>
                    
                    {user ? (
                        <>
                            <div className="border-t border-border/50 my-3" />
                            {user.is_admin && (
                                <Link 
                                    href={route('dashboard')} 
                                    className="flex items-center px-4 py-3 text-[15px] font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-muted-foreground">{user.name}</span>
                            </div>
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="flex items-center px-4 py-3 text-[15px] font-medium text-red-500 rounded-xl hover:bg-red-50/50 transition-colors w-full text-left"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Logout
                            </Link>
                        </>
                    ) : null}

                    <div className="border-t border-border/50 my-3" />
                    <div className="px-4 pt-2">
                        <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                                Contact Me
                            </button>
                        </Link>
                    </div>
                </nav>
            </div>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t py-6 md:py-0">
                <Container className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <Typography variant="small" className="text-muted-foreground text-center">
                        &copy; {new Date().getFullYear()} farros.space. All rights reserved.
                    </Typography>
                </Container>
            </footer>
        </div>
    );
}
