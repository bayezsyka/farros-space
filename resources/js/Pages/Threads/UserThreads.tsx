import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { ThreadCard } from '@/Features/Threads/components/ThreadCard';
import { ChevronLeft, ChevronRight, ArrowLeft, User, MessageSquare } from 'lucide-react';

interface Thread {
    id: number;
    title: string | null;
    content: string;
    image_url: string | null;
    likes_count: number;
    shares_count: number;
    user_id: number | null;
    user?: {
        id: number;
        name: string;
        avatar: string | null;
    };
    tags: string | null;
    created_at: string;
    allow_comments: boolean;
    comments_count: number;
}

interface ThreadUser {
    id: number | null;
    name: string;
    avatar: string | null;
}

interface Props {
    threads: Thread[];
    profile: any;
    threadUser: ThreadUser;
}

export default function UserThreads({ threads, profile, threadUser }: Props) {
    const [page, setPage] = useState(1);
    const perPage = 15;
    
    const totalPages = Math.ceil(threads.length / perPage);
    const paginatedThreads = threads.slice((page - 1) * perPage, page * perPage);

    const isOwner = threadUser.id === null;

    return (
        <AppLayout title={`Threads oleh ${threadUser.name}`}>
            <Section id="user-threads" spacing="none" className="py-6 sm:py-10 md:py-16 lg:py-20">
                <Container className="max-w-3xl px-4 sm:px-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link 
                            href={route('threads.index')} 
                            className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 transition-colors flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted border-2 border-primary/20 flex-shrink-0">
                                {threadUser.avatar ? (
                                    <img src={threadUser.avatar} alt={threadUser.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-base sm:text-lg">
                                        {threadUser.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <Typography variant="h2" className="text-lg sm:text-xl font-bold truncate">
                                    {threadUser.name}
                                </Typography>
                                <Typography variant="small" className="text-muted-foreground text-xs sm:text-sm">
                                    {threads.length} thread{threads.length !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* Thread List */}
                    <div className="border border-border/50 rounded-2xl bg-background overflow-hidden">
                        <div className="divide-y divide-border/50">
                            {paginatedThreads.length > 0 ? (
                                paginatedThreads.map((thread) => (
                                    <ThreadCard 
                                        key={thread.id} 
                                        thread={thread} 
                                        profile={isOwner ? profile : undefined}
                                        isPublic={!isOwner}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                                    <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/30 mb-3 sm:mb-4" />
                                    <Typography variant="small" className="text-muted-foreground text-xs sm:text-sm">
                                        Belum ada thread dari {threadUser.name}.
                                    </Typography>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="p-3 sm:p-4 border-t border-border/50 flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="gap-1 px-2 text-xs sm:text-sm"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Prev
                                </Button>
                                <span className="text-[11px] sm:text-xs font-medium text-muted-foreground"> {page} of {totalPages} </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="gap-1 px-2 text-xs sm:text-sm"
                                >
                                    Next <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Back to all threads */}
                    <div className="mt-4 sm:mt-6 text-center">
                        <Link 
                            href={route('threads.index')}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:underline transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Kembali ke semua threads
                        </Link>
                    </div>
                </Container>
            </Section>
        </AppLayout>
    );
}
