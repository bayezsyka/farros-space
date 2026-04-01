import React, { useState, Suspense, lazy } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { PageHeader } from '@/Components/ui/PageHeader';
import { ThreadCard } from '@/Features/Threads/components/ThreadCard';
import { MessageSquare, Users, Sparkles, TrendingUp } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

// Lazy load the public thread form
const PublicThreadForm = lazy(() => import('@/Features/Threads/components/PublicThreadForm'));

interface Thread {
    id: number;
    slug: string;
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

interface PaginatedThreads {
    data: Thread[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    threads: PaginatedThreads;
    profile: any;
}

export default function ThreadsIndex({ threads, profile }: Props) {
    const { auth } = usePage<PageProps>().props;
    const { __ } = useTranslation();

    const handlePublicThreadSuccess = (newThread: Thread) => {
        // Since we are using pagination, we'll just reload to see the new thread at the top
        window.location.reload();
    };

    return (
        <AppLayout title="Threads">
            <PageHeader
                breadcrumbs={[{ label: __('Threads') }]}
                badge={{ icon: MessageSquare, label: __('Threads') }}
                title={__('All Threads')}
                subtitle={__('A place to share stories, thoughts, and conversations from everyone.')}
                stats={[
                    { icon: MessageSquare, value: threads.total, label: __('Threads') },
                ]}
            />

            {/* ── Main Content ── */}
            <section className="py-8 md:py-12">
                <Container>
                    <div className="max-w-2xl">
                        {/* Post thread box */}
                    <div className="mb-6">
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <Typography variant="h3" className="text-[14px] font-bold text-foreground">
                                    {__('Share your story')}
                                </Typography>
                            </div>
                            <div className="p-4 sm:p-5">
                                <Suspense fallback={<div className="h-20 animate-pulse bg-muted rounded-xl" />}>
                                    <PublicThreadForm onSuccess={handlePublicThreadSuccess} />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Section header for thread list */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-foreground">
                                {threads.total} {__('threads')}
                            </h2>
                            {threads.last_page > 1 && (
                                <span className="text-xs text-muted-foreground">
                                    · {__('page :page of :total', { page: threads.current_page.toString(), total: threads.last_page.toString() })}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Thread list */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="divide-y divide-border/60">
                            {threads.data.length > 0 ? (
                                threads.data.map((thread) => (
                                    <ThreadCard
                                        key={thread.id}
                                        thread={thread}
                                        profile={thread.user_id === null ? profile : undefined}
                                        isPublic={thread.user_id !== null}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border">
                                        <MessageSquare className="w-7 h-7 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">{__('No threads yet.')}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{__('Be the first to share a story!')}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {threads.last_page > 1 && (
                            <div className="p-4 border-t border-border flex flex-wrap items-center justify-center gap-2 bg-muted/20">
                                {threads.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            link.active 
                                                ? 'bg-primary text-primary-foreground shadow-sm' 
                                                : link.url 
                                                    ? 'text-muted-foreground hover:bg-muted hover:text-foreground' 
                                                    : 'text-muted-foreground/40 cursor-not-allowed'
                                        }`}
                                        preserveScroll
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
