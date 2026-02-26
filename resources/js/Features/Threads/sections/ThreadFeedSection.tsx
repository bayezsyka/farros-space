import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { ThreadCard } from '../components/ThreadCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

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
    const [activeTab, setActiveTab] = useState<'owner' | 'public'>('owner');

    const [pageOwner, setPageOwner] = useState(1);
    const [pagePublic, setPagePublic] = useState(1);
    const perPage = 10;
    
    const totalPagesOwner = Math.ceil(threads.length / perPage);
    const totalPagesPublic = Math.ceil(publicThreads.length / perPage);
    
    const paginatedOwnerThreads = threads.slice((pageOwner - 1) * perPage, pageOwner * perPage);
    const paginatedPublicThreads = publicThreads.slice((pagePublic - 1) * perPage, pagePublic * perPage);

    const handlePublicThreadSuccess = (newThread: Thread) => {
        setPublicThreads([newThread, ...publicThreads]);
    };

    return (
        <Section id="threads-feed" spacing="lg">
            <Container className="max-w-6xl px-4 lg:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Owner Threads Column */}
                    <div className="border border-border/50 rounded-2xl bg-background overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-4 border-b border-border/50 bg-zinc-50/50">
                            <Typography variant="h3" className="text-[18px] font-bold">Threads</Typography>
                        </div>
                        
                        <div className="flex-grow">
                            {threads.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {paginatedOwnerThreads.map((thread) => (
                                        <ThreadCard key={thread.id} thread={thread} profile={profile} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Typography variant="small" className="text-muted-foreground">Belum ada thread.</Typography>
                                </div>
                            )}
                        </div>

                        {totalPagesOwner > 1 && (
                            <div className="p-4 border-t border-border/50 flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPageOwner(p => Math.max(1, p - 1))}
                                    disabled={pageOwner === 1}
                                    className="gap-1 px-2"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Button>
                                <span className="text-xs font-medium text-muted-foreground"> {pageOwner} of {totalPagesOwner} </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPageOwner(p => Math.min(totalPagesOwner, p + 1))}
                                    disabled={pageOwner === totalPagesOwner}
                                    className="gap-1 px-2"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Public Threads Column (Kata Mereka...) */}
                    <div className="border border-border/50 rounded-2xl bg-background overflow-hidden flex flex-col min-h-[600px]">
                        <div className="p-4 border-b border-border/50 bg-zinc-50/50 flex items-center justify-between">
                            <Typography variant="h3" className="text-[18px] font-bold">Kata Mereka...</Typography>
                            {!auth.user && (
                                <Typography variant="small" className="text-xs text-muted-foreground italic">Login untuk berbagi</Typography>
                            )}
                        </div>

                        {/* Public Thread Input Form */}
                        <div className="p-4 border-b border-border/50">
                            <PublicThreadForm onSuccess={handlePublicThreadSuccess} />
                        </div>
                        
                        <div className="flex-grow">
                            {publicThreads.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {paginatedPublicThreads.map((thread) => (
                                        <ThreadCard key={thread.id} thread={thread} isPublic />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Typography variant="small" className="text-muted-foreground">Jadilah yang pertama berbagi!</Typography>
                                </div>
                            )}
                        </div>

                        {totalPagesPublic > 1 && (
                            <div className="p-4 border-t border-border/50 flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPagePublic(p => Math.max(1, p - 1))}
                                    disabled={pagePublic === 1}
                                    className="gap-1 px-2"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </Button>
                                <span className="text-xs font-medium text-muted-foreground"> {pagePublic} of {totalPagesPublic} </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPagePublic(p => Math.min(totalPagesPublic, p + 1))}
                                    disabled={pagePublic === totalPagesPublic}
                                    className="gap-1 px-2"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
};

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
            <div className="flex flex-col items-center justify-center py-4 px-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 gap-3">
                <Typography variant="small" className="text-[13px] text-zinc-500 font-medium">Masuk untuk berbagi cerita kamu</Typography>
                <a 
                    href={route('auth.google', { redirect: window.location.href })}
                    className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-full text-[12px] font-bold shadow-sm hover:shadow-md hover:bg-zinc-50 transition-all active:scale-95"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Lanjutkan dengan Google
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {auth.user.avatar ? (
                        <img src={auth.user.avatar} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                            {auth.user.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Apa yang ada di pikiran kamu?"
                        className="w-full bg-transparent border-none focus:ring-0 text-[15px] p-0 min-h-[40px] resize-none"
                        rows={2}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                </div>
            </div>
            <div className="flex justify-end pt-1">
                <Button 
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || isSubmitting}
                    className="rounded-full px-6 font-bold"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </Button>
            </div>
        </form>
    );
};
