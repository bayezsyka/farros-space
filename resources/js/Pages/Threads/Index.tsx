import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { PageHeader } from '@/Components/ui/PageHeader';
import { ThreadCard } from '@/Features/Threads/components/ThreadCard';
import { ChevronLeft, ChevronRight, MessageSquare, Users, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';

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

interface Props {
    threads: Thread[];
    profile: any;
}

export default function ThreadsIndex({ threads: initialThreads, profile }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [threads, setThreads] = useState(initialThreads);
    const [page, setPage] = useState(1);
    const perPage = 15;

    const totalPages = Math.ceil(threads.length / perPage);
    const paginatedThreads = threads.slice((page - 1) * perPage, page * perPage);

    const handlePublicThreadSuccess = (newThread: Thread) => {
        setThreads([newThread, ...threads]);
        setPage(1);
    };

    // Stats
    const totalLikes = threads.reduce((sum, t) => sum + t.likes_count, 0);
    const totalComments = threads.reduce((sum, t) => sum + t.comments_count, 0);

    return (
        <AppLayout title="Threads">
            <PageHeader
                breadcrumbs={[{ label: 'Threads' }]}
                badge={{ icon: MessageSquare, label: 'Threads' }}
                title="Semua Threads"
                subtitle="Tempat berbagi cerita, pikiran, dan percakapan dari semua orang."
                stats={[
                    { icon: MessageSquare, value: threads.length, label: 'Threads' },
                    { icon: TrendingUp, value: totalLikes, label: 'Likes' },
                    { icon: Users, value: totalComments, label: 'Komentar' },
                ]}
            />

            {/* ── Main Content ── */}
            <section className="py-8 md:py-12">
                <Container className="max-w-3xl px-4 sm:px-6">
                    {/* Post thread box */}
                    <div className="mb-6">
                        <div className="rounded-2xl border border-border bg-card overflow-hidden">
                            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border bg-muted/30 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <Typography variant="h3" className="text-[14px] font-bold text-foreground">
                                    Berbagi cerita kamu
                                </Typography>
                            </div>
                            <div className="p-4 sm:p-5">
                                <PublicThreadForm onSuccess={handlePublicThreadSuccess} />
                            </div>
                        </div>
                    </div>

                    {/* Section header for thread list */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold text-foreground">
                                {threads.length} thread
                            </h2>
                            {totalPages > 1 && (
                                <span className="text-xs text-muted-foreground">
                                    · halaman {page} dari {totalPages}
                                </span>
                            )}
                        </div>
                        {page > 1 && (
                            <button
                                onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="text-xs font-semibold text-primary hover:underline"
                            >
                                Ke halaman pertama
                            </button>
                        )}
                    </div>

                    {/* Thread list */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="divide-y divide-border/60">
                            {paginatedThreads.length > 0 ? (
                                paginatedThreads.map((thread) => (
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
                                    <p className="text-sm text-muted-foreground font-medium">Belum ada thread.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Jadilah yang pertama berbagi cerita!</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={page === 1}
                                    className="gap-1.5 rounded-xl text-xs font-semibold"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" /> Prev
                                </Button>

                                {/* Page numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNum = totalPages <= 5 ? i + 1
                                            : page <= 3 ? i + 1
                                                : page >= totalPages - 2 ? totalPages - 4 + i
                                                    : page - 2 + i;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === pageNum
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    disabled={page === totalPages}
                                    className="gap-1.5 rounded-xl text-xs font-semibold"
                                >
                                    Next <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}

// ── Public Thread Form ──
import { ImagePlus, X } from 'lucide-react';

const PublicThreadForm = ({ onSuccess }: { onSuccess: (thread: Thread) => void }) => {
    const { auth } = usePage<PageProps>().props;
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran client-side (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal adalah 5MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !image) return;
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (content.trim()) formData.append('content', content);
            if (image) formData.append('image', image);

            await axios.post(route('threads.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // If we're using Inertia, the page might reload automatically if we used useForm, 
            // but since we are using axios, we can just trigger an Inertia reload to get the fresh data
            // Or we can rely on Inertia's router directly instead of axios. Let's redirect using Inertia router.

        } catch (error: any) {
            console.error(error);
            alert("Gagal mengirim thread.");
        } finally {
            setIsSubmitting(false);
            // Instead of onSuccess, let's reload the page to get the fresh feed from server since we just stored it
            window.location.reload();
        }
    };

    if (!auth.user) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <p className="text-sm text-muted-foreground">
                    Masuk untuk berbagi cerita kamu dengan semua orang.
                </p>
                <a
                    href={route('auth.google', { redirect: typeof window !== 'undefined' ? window.location.href : '' })}
                    className="flex-shrink-0 flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:bg-muted transition-all active:scale-95"
                >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Masuk dengan Google
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                    {auth.user.avatar ? (
                        <img src={auth.user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-primary/10 text-primary">
                            {auth.user.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-grow min-w-0 space-y-3">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Apa yang ada di pikiran kamu?"
                        className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[40px] resize-none placeholder:text-muted-foreground"
                        rows={2}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />

                    {imagePreview && (
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="Preview" className="max-h-60 rounded-xl border border-border object-cover" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                        title="Upload Gambar (Max 5MB)"
                    >
                        <ImagePlus className="w-5 h-5" />
                    </button>
                    <span className={`text-xs ${content.length > 5000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {content.length} / 5000
                    </span>
                </div>
                <Button
                    type="submit"
                    size="sm"
                    disabled={(!content.trim() && !image) || isSubmitting || content.length > 5000}
                    className="rounded-xl px-5 font-bold text-xs"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Thread'}
                </Button>
            </div>
        </form>
    );
};

// re-export Thread type so ThreadCard can still use it
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
