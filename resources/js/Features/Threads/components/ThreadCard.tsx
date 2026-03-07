import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent } from '@/Components/ui/Card';
import { Typography } from '@/Components/ui/Typography';
import { Badge } from '@/Components/ui/Badge';
import { Heart, MessageCircle, MoreVertical, Trash2, Edit2, X, ImagePlus, Maximize2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { CommentCard } from './CommentCard';

interface Thread {
    id: number;
    slug: string;
    title: string | null;
    content: string;
    image_url: string | null;
    likes_count: number;
    shares_count: number;
    user_id?: number | null;
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

interface ThreadCardProps {
    thread: Thread;
    profile?: any;
    isPublic?: boolean;
}

export const ThreadCard = ({ thread, profile, isPublic = false }: ThreadCardProps) => {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [likes, setLikes] = useState(thread.likes_count);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Edit and Delete states
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(thread.content);
    const [editImage, setEditImage] = useState<File | null>(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const isOwner = user?.id === thread.user_id;
    const isAdmin = user?.is_admin === true;
    const canManage = isOwner || isAdmin;

    const handleLike = async () => {
        if (isSubmittingComment) return;
        setIsSubmittingComment(true);
        try {
            const response = await axios.post(route('threads.like', { thread: thread.slug }));
            setLikes(response.data.count);
            setIsLiked(response.data.status === 'liked');
        } catch (error) {
            console.error('Failed to like', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };


    const toggleComments = async () => {
        if (!thread.allow_comments) return;

        if (!showComments && comments.length === 0) {
            try {
                const response = await axios.get(route('threads.comments.index', { thread: thread.slug }));
                setComments(response.data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            const response = await axios.post(route('threads.comments.store', { thread: thread.slug }), {
                content: newComment
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error: any) {
            if (error.response?.status === 401) {
                window.location.href = route('auth.google');
            } else {
                alert("Gagal mengirim komentar.");
            }
        } finally {
            setIsSubmittingComment(false);
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
        formData.append('_method', 'PUT'); // Spoofing PUT
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

    const commentDeletedHandler = (deletedId: number) => {
        setComments(comments.filter(c => c.id !== deletedId));
    };

    return (
        <div className="w-full px-3 py-3 sm:px-4 sm:py-4 hover:bg-zinc-50/50 transition-colors last:border-b-0">
            <div className="flex gap-2.5 sm:gap-3">
                {/* Left side: Avatar */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-muted border border-border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                            const avatarUrl = isPublic ? thread.user?.avatar : profile?.avatar_url;
                            if (avatarUrl) setPreviewImage(avatarUrl);
                        }}
                    >
                        {isPublic ? (
                            thread.user?.avatar ? (
                                <img src={thread.user.avatar} alt={thread.user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                                    {thread.user?.name?.charAt(0) || 'G'}
                                </div>
                            )
                        ) : profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                                {profile?.full_name?.charAt(0) || 'F'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Content */}
                <div className="flex-grow min-w-0 space-y-1.5 sm:space-y-2 pb-1 sm:pb-2">
                    {/* Header */}
                    <div className="flex items-start sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
                            <span className="font-bold text-[13px] sm:text-[15px] hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-none">
                                {isPublic ? (
                                    thread.user?.id ? (
                                        <Link href={route('threads.user', thread.user.name)} className="hover:text-primary transition-colors">
                                            {thread.user.name || 'Guest'}
                                        </Link>
                                    ) : (
                                        'Guest'
                                    )
                                ) : (
                                    <Link href={route('threads.user', 'owner')} className="hover:text-primary transition-colors">
                                        {profile?.full_name || 'Farros'}
                                    </Link>
                                )}
                            </span>
                            {thread.tags && (
                                <>
                                    <span className="text-muted-foreground hidden sm:inline">·</span>
                                    <span className="text-muted-foreground text-[12px] sm:text-[14px] hover:underline cursor-pointer hidden sm:inline truncate max-w-[100px]">
                                        {thread.tags.split(',')[0]}
                                    </span>
                                </>
                            )}
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-[11px] sm:text-[14px] whitespace-nowrap">
                                {thread.created_at ? formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: id }) : 'baru saja'}
                            </span>
                        </div>

                        {/* Menus */}
                        {canManage && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-8 w-36 bg-popover rounded-xl border border-border shadow-md overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm text-foreground hover:bg-muted/50 transition-colors text-left font-medium"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={handleDeleteThread}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm text-destructive hover:bg-destructive/10 transition-colors text-left font-medium border-t border-border/50"
                                        >
                                            <Trash2 className="w-4 h-4" /> Hapus
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="mt-2 space-y-3 p-3 bg-muted/20 border border-border rounded-xl">
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-[13px] sm:text-[15px] p-0 min-h-[60px] resize-none"
                            />

                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
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
                                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ImagePlus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    {editImage && <span className="text-xs text-primary font-medium">{editImage.name}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setEditImage(null); }}
                                        className="text-xs font-semibold px-3 py-1.5 text-muted-foreground hover:text-foreground"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingEdit}
                                        className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full disabled:opacity-50"
                                    >
                                        {isSubmittingEdit ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="text-[13px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                {thread.content}
                            </div>

                            {/* Image */}
                            {thread.image_url && (
                                <div
                                    className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-muted/20 cursor-pointer group relative"
                                    onClick={() => setPreviewImage(thread.image_url)}
                                >
                                    <img
                                        src={thread.image_url}
                                        alt="Thread attachment"
                                        className="w-full h-auto max-h-[300px] sm:max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                            <Maximize2 className="w-5 h-5 text-foreground" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Full Screen Image Preview Modal */}
                            {previewImage && (
                                <div
                                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    <button
                                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                                        onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    <img
                                        src={previewImage}
                                        className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                                        alt="Full size preview"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 sm:gap-8 pt-1 sm:pt-2">
                        <button className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-red-500 group transition-colors" onClick={handleLike}>
                            <div className={cn("p-1.5 sm:p-2 rounded-full group-hover:bg-red-500/10 transition-colors", isLiked && "text-red-500")}>
                                <Heart className={cn("w-4 h-4 sm:w-[18px] sm:h-[18px]", isLiked && "fill-current")} />
                            </div>
                            {likes > 0 && <span className="text-[11px] sm:text-xs font-medium">{likes}</span>}
                        </button>
                        {thread.allow_comments && (
                            <button className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground hover:text-blue-500 group transition-colors" onClick={toggleComments}>
                                <div className={cn("p-1.5 sm:p-2 rounded-full group-hover:bg-blue-500/10 transition-colors", showComments && "text-blue-500")}>
                                    <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                </div>
                                {(comments.length > 0 ? comments.length : thread.comments_count) > 0 && (
                                    <span className="text-[11px] sm:text-xs font-medium">
                                        {comments.length > 0 ? comments.length : thread.comments_count}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Comments Section */}
                    {showComments && thread.allow_comments && (
                        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Comment Input */}
                            <div className="flex gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold bg-zinc-100 text-zinc-400">
                                            {user ? user.name.charAt(0) : 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0 flex flex-col gap-2">
                                    {user ? (
                                        <form onSubmit={submitComment}>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Tulis komentar..."
                                                className="w-full bg-transparent border-none focus:ring-0 text-[13px] sm:text-[14px] p-0 min-h-[20px] resize-none"
                                                rows={1}
                                                onInput={(e) => {
                                                    const target = e.target as HTMLTextAreaElement;
                                                    target.style.height = 'auto';
                                                    target.style.height = target.scrollHeight + 'px';
                                                }}
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    type="submit"
                                                    disabled={!newComment.trim() || isSubmittingComment}
                                                    className="bg-primary text-primary-foreground text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full disabled:opacity-50"
                                                >
                                                    Balas
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-3 sm:px-4 bg-zinc-50 rounded-xl sm:rounded-2xl border border-dashed border-zinc-200 gap-2 sm:gap-3">
                                            <p className="text-[12px] sm:text-[14px] text-zinc-500 font-medium text-center">Masuk untuk memberikan komentar</p>
                                            <a
                                                href={route('auth.google', { redirect: window.location.href })}
                                                className="flex items-center gap-2 sm:gap-3 bg-white border border-zinc-200 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-[13px] font-bold shadow-sm hover:shadow-md hover:bg-zinc-50 transition-all active:scale-95"
                                            >
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                                Lanjutkan dengan Google
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4 pt-2 divide-y divide-border/50">
                                {comments.map((comment) => (
                                    <CommentCard key={comment.id} comment={comment} onDeleted={commentDeletedHandler} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
