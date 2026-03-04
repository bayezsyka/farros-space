import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { ThreadCard } from '../components/ThreadCard';
import { ArrowRight, MessageSquare, Sparkles, Users } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

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

interface ThreadFeedSectionProps {
    threads: Thread[];
    publicThreads: Thread[];
    profile?: any;
}

export const ThreadFeedSection = ({ threads, publicThreads: initialPublicThreads, profile }: ThreadFeedSectionProps) => {
    const { auth } = usePage<PageProps>().props;
    const [publicThreads, setPublicThreads] = useState(initialPublicThreads);

    const handlePublicThreadSuccess = (newThread: Thread) => {
        setPublicThreads([newThread, ...publicThreads]);
    };

    // Mobile: merge & sort by created_at, take 5
    const mixedThreads = [...threads.map(t => ({ ...t, _isOwner: true })), ...publicThreads.map(t => ({ ...t, _isOwner: false }))]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <Section id="threads-feed" spacing="none" className="py-10 sm:py-16 md:py-20 border-t bg-muted/10">
            <Container className="max-w-6xl px-4 sm:px-6 lg:px-8">

                {/* Section header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 border border-border bg-background rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Threads
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                            Pembaruan Terkini
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Apa yang sedang terjadi di sini.
                        </p>
                    </div>
                    <Link
                        href={route('threads.index')}
                        className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        Lihat Semua
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* ── DESKTOP: Two Columns ── */}
                <div className="hidden lg:grid grid-cols-2 gap-5 xl:gap-6 items-start">

                    {/* Owner Threads Column */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <Typography variant="h3" className="text-[15px] font-bold">My Threads</Typography>
                            </div>
                            <Link
                                href={route('threads.owner')}
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                            >
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div>
                            {threads.length > 0 ? (
                                <div className="divide-y divide-border/60">
                                    {threads.slice(0, 4).map((thread) => (
                                        <ThreadCard key={thread.id} thread={thread} profile={profile} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <MessageSquare className="w-9 h-9 text-muted-foreground/25 mb-3" />
                                    <Typography variant="small" className="text-muted-foreground text-sm">
                                        Belum ada thread.
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Public Threads Column */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                                <Typography variant="h3" className="text-[15px] font-bold">Kata Mereka...</Typography>
                            </div>
                            {!auth.user && (
                                <Typography variant="small" className="text-xs text-muted-foreground italic">
                                    Login untuk berbagi
                                </Typography>
                            )}
                        </div>

                        {/* Post form */}
                        <div className="px-5 py-4 border-b border-border">
                            <PublicThreadForm onSuccess={handlePublicThreadSuccess} />
                        </div>

                        <div>
                            {publicThreads.length > 0 ? (
                                <div className="divide-y divide-border/60">
                                    {publicThreads.slice(0, 3).map((thread) => (
                                        <ThreadCard key={thread.id} thread={thread} isPublic />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <Typography variant="small" className="text-muted-foreground text-sm">
                                        Jadilah yang pertama berbagi!
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── MOBILE & TABLET ── */}
                <div className="lg:hidden">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                <Typography variant="h3" className="text-[16px] font-bold">Threads</Typography>
                            </div>
                            <Link
                                href={route('threads.index')}
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                            >
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Post form */}
                        <div className="px-4 py-4 border-b border-border">
                            <PublicThreadForm onSuccess={handlePublicThreadSuccess} />
                        </div>

                        <div>
                            {mixedThreads.length > 0 ? (
                                <div className="divide-y divide-border/60">
                                    {mixedThreads.map((thread) => (
                                        <ThreadCard
                                            key={`${thread._isOwner ? 'o' : 'p'}-${thread.id}`}
                                            thread={thread}
                                            profile={thread._isOwner ? profile : undefined}
                                            isPublic={!thread._isOwner}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <MessageSquare className="w-10 h-10 text-muted-foreground/25 mb-3" />
                                    <Typography variant="small" className="text-muted-foreground">Belum ada thread.</Typography>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 flex items-center justify-center gap-4">
                    <Link
                        href={route('threads.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-all group"
                    >
                        Lihat semua threads
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </Container>
        </Section>
    );
};

// ── Public Thread Form ──
const PublicThreadForm = ({ onSuccess }: { onSuccess: (thread: Thread) => void }) => {
    const { auth } = usePage<PageProps>().props;
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(route('public-threads.store'), {
                content: content
            });
            onSuccess(response.data);
            setContent('');
        } catch (error: any) {
            if (error.response?.status === 401) {
                window.location.href = route('auth.google');
            } else {
                alert("Gagal mengirim thread.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!auth.user) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                    Masuk untuk berbagi cerita kamu.
                </p>
                <a
                    href={route('auth.google', { redirect: typeof window !== 'undefined' ? window.location.href : '' })}
                    className="flex-shrink-0 flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:bg-muted transition-all active:scale-95"
                >
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                    {auth.user.avatar ? (
                        <img src={auth.user.avatar} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-primary/10 text-primary">
                            {auth.user.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-grow min-w-0">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Apa yang ada di pikiran kamu?"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[36px] resize-none placeholder:text-muted-foreground"
                        rows={2}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-1 border-t border-border/40">
                <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || isSubmitting}
                    className="rounded-xl px-5 font-bold text-xs"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </Button>
            </div>
        </form>
    );
};
