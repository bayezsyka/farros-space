import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
            <Head title={title} />
            
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Container className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Typography variant="large" className="font-bold tracking-tight">
                            farros.space
                        </Typography>
                    </Link>
                    
                    <nav className="flex items-center space-x-6">
                        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                            Home
                        </Link>
                        
                        {(window as any).Inertia?.page?.props?.auth?.user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">{(window as any).Inertia.page.props.auth.user.name}</span>
                                <Link href={route('logout')} method="post" as="button" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <Link href={route('auth.google')} className="flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-zinc-50 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google Login
                            </Link>
                        )}

                        <Link href="/contact">
                            <button className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                                Contact Me
                            </button>
                        </Link>
                    </nav>
                </Container>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="border-t py-6 md:py-0">
                <Container className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <Typography variant="small" className="text-muted-foreground">
                        &copy; {new Date().getFullYear()} farros.space. All rights reserved.
                    </Typography>
                </Container>
            </footer>
        </div>
    );
}
