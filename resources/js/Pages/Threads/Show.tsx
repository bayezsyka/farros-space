import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { PageHeader } from '@/Components/ui/PageHeader';
import { MessageSquare, ArrowLeft, Heart, Edit2, Trash2, MoreVertical, ImagePlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Card } from '@/Components/ui/Card';
import { router } from '@inertiajs/react';
import { CommentCard } from '@/Features/Threads/components/CommentCard';

interface UserLink {
    id: number;
    name: string;
    avatar: string | null;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: UserLink;
}

interface Thread {
    id: number;
    slug: string;
    title: string | null;
    content: string;
    image_url: string | null;
    likes_count: number;
    shares_count: number;
    user_id: number | null;
    user?: UserLink | null;
    tags: string | null;
    created_at: string;
    allow_comments: boolean;
    comments_count: number;
    comments?: Comment[];
}

interface Props {
    thread: Thread;
    profile: any;
}

export default function ThreadShow({ thread: initialThread, profile }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const [thread, setThread] = useState(initialThread);
    const [likes, setLikes] = useState(thread.likes_count);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(thread.content);
    const [editImage, setEditImage] = useState<File | null>(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const isPublic = thread.user_id !== null;
    const isOwner = user?.id === thread.user_id;
    const isAdmin = user?.is_admin === true;
    const canManage = isOwner || isAdmin;

    const handleLike = async () => {
        try {
            const response = await axios.post(route('threads.like', { thread: thread.slug }));
            setLikes(response.data.count);
            setIsLiked(response.data.status === 'liked');
        } catch (error) {
            console.error('Failed to like', error);
        }
    };


    const handleDeleteThread = () => {
        if (!confirm('Apakah Yakin ingin menghapus thread ini?')) return;
        router.delete(route('threads.destroy', { thread: thread.slug }), {
            preserveScroll: true
        });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editContent.trim() && !editImage) return;

        setIsSubmittingEdit(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        if (editContent.trim()) formData.append('content', editContent);
        if (editImage) formData.append('image', editImage);

        router.post(route('threads.update', { thread: thread.slug }), formData as any, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setEditImage(null);
                setIsSubmittingEdit(false);
            },
            onError: () => {
                alert("Gagal menyimpan perubahan.");
                setIsSubmittingEdit(false);
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal adalah 5MB.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        setEditImage(file);
    };

    const handleCommentDeleted = (deletedId: number) => {
        setThread({
            ...thread,
            comments: thread.comments?.filter(c => c.id !== deletedId) || [],
            comments_count: Math.max(0, thread.comments_count - 1),
        });
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await axios.post(route('threads.comments.store', { thread: thread.slug }), {
                content: newComment
            });
            setThread({
                ...thread,
                comments: [response.data, ...(thread.comments || [])],
                comments_count: thread.comments_count + 1
            });
            setNewComment('');
        } catch (error: any) {
            if (error.response?.status === 401) {
                window.location.href = route('auth.google', { redirect: window.location.href });
            } else {
                alert("Gagal mengirim komentar.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout title="Detail Thread">
            <PageHeader
                breadcrumbs={[
                    { label: 'Threads', href: route('threads.index') },
                    { label: 'Detail' }
                ]}
                badge={{ icon: MessageSquare, label: 'Komentar' }}
                title="Percakapan"
                subtitle="Balasan dan dukungan untuk ulasan publik."
            />

            <section className="py-8 md:py-12 relative animate-in fade-in slide-in-from-bottom-6 duration-700">
                <Container className="max-w-2xl px-4 sm:px-6">
                    <Link
                        href={route('threads.index')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>

                    <Card className="rounded-2xl border border-border bg-card overflow-hidden w-full px-5 py-6">
                        <div className="flex gap-3 sm:gap-4">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted border border-border">
                                    {isPublic ? (
                                        thread.user?.avatar ? (
                                            <img src={thread.user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm sm:text-base">
                                                {thread.user?.name?.charAt(0) || 'G'}
                                            </div>
                                        )
                                    ) : profile?.avatar_url ? (
                                        <img src={profile.avatar_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm sm:text-base">
                                            {profile?.full_name?.charAt(0) || 'F'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-grow min-w-0 pb-2">
                                <div className="flex items-center gap-1.5 flex-wrap min-w-0 mb-2">
                                    <span className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer truncate max-w-[150px] sm:max-w-none">
                                        {isPublic ? (
                                            thread.user?.id ? (
                                                <Link href={route('threads.user', thread.user.name)} className="hover:text-primary transition-colors">
                                                    {thread.user.name || 'Guest'}
                                                </Link>
                                            ) : 'Guest'
                                        ) : (
                                            <Link href={route('threads.user', 'owner')} className="hover:text-primary transition-colors">
                                                {profile?.full_name || 'Farros'}
                                            </Link>
                                        )}
                                    </span>
                                    {thread.tags && (
                                        <>
                                            <span className="text-muted-foreground hidden sm:inline">·</span>
                                            <span className="text-muted-foreground text-[14px]">{thread.tags.split(',')[0]}</span>
                                        </>
                                    )}
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-muted-foreground text-[13px] sm:text-[14px]">
                                        {thread.created_at ? formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: localeId }) : 'baru saja'}
                                    </span>
                                </div>

                                {/* Menus */}
                                {canManage && (
                                    <div className="absolute top-6 right-5">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                        {isMenuOpen && (
                                            <div className="absolute right-0 top-10 w-40 bg-popover rounded-xl border border-border shadow-md overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                                <button
                                                    onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors text-left font-medium"
                                                >
                                                    <Edit2 className="w-4 h-4" /> Edit Thread
                                                </button>
                                                <button
                                                    onClick={handleDeleteThread}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium border-t border-border/50"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow min-w-0 pb-2">
                                <div className="text-[14px] sm:text-[16px] leading-relaxed whitespace-pre-wrap break-words">
                                    {isEditing ? (
                                        <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 p-4 bg-muted/20 border border-border rounded-xl">
                                            <textarea
                                                value={editContent}
                                                onChange={e => setEditContent(e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-[14px] sm:text-[16px] p-0 min-h-[80px] resize-none"
                                            />

                                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-2">
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
                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                                    >
                                                        <ImagePlus className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </button>
                                                    {editImage && <span className="text-xs text-primary font-medium">{editImage.name}</span>}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setIsEditing(false); setEditImage(null); }}
                                                        className="text-sm font-semibold px-4 py-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        Batal
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmittingEdit}
                                                        className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full disabled:opacity-50 hover:bg-primary/90"
                                                    >
                                                        {isSubmittingEdit ? 'Menyimpan...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {thread.content}
                                            {thread.image_url && (
                                                <div className="mt-4 rounded-2xl overflow-hidden border border-border bg-muted/20 block">
                                                    <img
                                                        src={thread.image_url}
                                                        alt="Thread attachment"
                                                        className="w-full h-auto object-cover max-h-[500px]"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 pt-4 border-b border-border/40 pb-4 mt-2">
                                    <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 group transition-colors" onClick={handleLike}>
                                        <div className={cn("p-2 rounded-full group-hover:bg-red-500/10 transition-colors", isLiked && "text-red-500")}>
                                            <Heart className={cn("w-[20px] h-[20px]", isLiked && "fill-current")} />
                                        </div>
                                        <span className="text-sm font-medium">{likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-muted-foreground cursor-default transition-colors">
                                        <div className="p-2 rounded-full transition-colors text-blue-500">
                                            <MessageSquare className="w-[20px] h-[20px]" />
                                        </div>
                                        <span className="text-sm font-medium">{thread.comments_count}</span>
                                    </button>
                                </div>

                                {/* Comments List & Form */}
                                {thread.allow_comments && (
                                    <div className="mt-5 space-y-5">
                                        {user ? (
                                            <form onSubmit={submitComment} className="flex gap-3">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                                    {user?.avatar ? (
                                                        <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold bg-primary/10 text-primary">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <textarea
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        placeholder="Tulis balasan..."
                                                        className="w-full bg-transparent border-none focus:ring-0 text-sm sm:text-[15px] p-0 min-h-[40px] resize-none"
                                                        rows={2}
                                                        onInput={(e) => {
                                                            const target = e.target as HTMLTextAreaElement;
                                                            target.style.height = 'auto';
                                                            target.style.height = target.scrollHeight + 'px';
                                                        }}
                                                    />
                                                    <div className="flex justify-end mt-2">
                                                        <button
                                                            type="submit"
                                                            disabled={!newComment.trim() || isSubmitting}
                                                            className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full disabled:opacity-50"
                                                        >
                                                            {isSubmitting ? 'Mengirim...' : 'Balas'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/30 rounded-2xl border border-dashed border-border gap-3">
                                                <span className="text-sm text-muted-foreground font-medium text-center sm:text-left">
                                                    Anda harus masuk terlebih dahulu untuk ikut dalam percakapan.
                                                </span>
                                                <a
                                                    href={route('auth.google', { redirect: window.location.href })}
                                                    className="flex-shrink-0 bg-background border border-border px-5 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow-md hover:bg-muted transition-all"
                                                >
                                                    Masuk
                                                </a>
                                            </div>
                                        )}

                                        <div className="space-y-4 pt-4 divide-y divide-border/40">
                                            {thread.comments?.map((comment: any) => (
                                                <CommentCard key={comment.id} comment={comment} onDeleted={handleCommentDeleted} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </Card>
                </Container>
            </section>
        </AppLayout>
    );
}
