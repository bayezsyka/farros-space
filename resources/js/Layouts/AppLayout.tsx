import { Link, Head, usePage } from '@inertiajs/react';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { PageProps } from '@/types';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

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
