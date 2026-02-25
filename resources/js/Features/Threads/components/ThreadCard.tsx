import React, { useState } from 'react';
import { Card, CardContent } from '@/Components/ui/Card';
import { Typography } from '@/Components/ui/Typography';
import { Badge } from '@/Components/ui/Badge';
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface Thread {
    id: number;
    title: string | null;
    content: string;
    image_url: string | null;
    likes_count: number;
    shares_count: number;
    tags: string | null;
    created_at: string;
}

interface ThreadCardProps {
    thread: Thread;
    profile?: any;
}

export const ThreadCard = ({ thread, profile }: ThreadCardProps) => {
    const [likes, setLikes] = useState(thread.likes_count);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleLike = async () => {
        if (isSubmittingComment) return; // Using isSubmittingComment as a general busy flag
        setIsSubmittingComment(true); // Temporarily use this for like to prevent double click
        try {
            const response = await axios.post(route('threads.like', thread.id));
            setLikes(response.data.count);
            setIsLiked(response.data.status === 'liked');
        } catch (error) {
            console.error('Failed to like', error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleShare = async () => {
        try {
            const response = await axios.post(route('threads.share', thread.id));
            // You might want to update local state if you show share count
        } catch (error) {
            console.error('Failed to share', error);
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            try {
                const response = await axios.get(route('threads.comments.index', thread.id));
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
            const response = await axios.post(route('threads.comments.store', thread.id), {
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

    return (
        <div className="w-full px-4 py-4 hover:bg-zinc-50/50 transition-colors last:border-b-0">
            <div className="flex gap-3">
                {/* Left side: Avatar */}
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                                {profile?.full_name?.charAt(0) || 'F'}
                            </div>
                        )}
                    </div>
                    {/* Only show line if there's more below (optional) */}
                    {/* <div className="flex-grow w-px bg-border/50 my-2" /> */}
                </div>

                {/* Right side: Content */}
                <div className="flex-grow space-y-2 pb-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[15px] hover:underline cursor-pointer">
                                {profile?.full_name || 'Farros'}
                            </span>
                            {thread.tags && (
                                <>
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-muted-foreground text-[14px] hover:underline cursor-pointer">
                                        {thread.tags.split(',')[0]}
                                    </span>
                                </>
                            )}
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-[14px]">
                                {thread.created_at ? formatDistanceToNow(new Date(thread.created_at), { addSuffix: true, locale: id }) : 'baru saja'}
                            </span>
                        </div>
                        <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {thread.content}
                    </div>

                    {/* Image */}
                    {thread.image_url && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-border bg-muted/20">
                            <img 
                                src={thread.image_url} 
                                alt="Thread attachment" 
                                className="w-full h-auto max-h-[500px] object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-8 pt-2">
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-red-500 group transition-colors" onClick={handleLike}>
                            <div className={cn("p-2 rounded-full group-hover:bg-red-500/10 transition-colors", isLiked && "text-red-500")}>
                                <Heart className={cn("w-[18px] h-[18px]", isLiked && "fill-current")} />
                            </div>
                            {likes > 0 && <span className="text-xs font-medium">{likes}</span>}
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-500 group transition-colors" onClick={toggleComments}>
                            <div className={cn("p-2 rounded-full group-hover:bg-blue-500/10 transition-colors", showComments && "text-blue-500")}>
                                <MessageCircle className="w-[18px] h-[18px]" />
                            </div>
                            {comments.length > 0 && <span className="text-xs font-medium">{comments.length}</span>}
                        </button>
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-blue-400 group transition-colors" onClick={handleShare}>
                            <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                <Send className="w-[18px] h-[18px]" />
                            </div>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <form onSubmit={submitComment} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                    {(window as any).Inertia?.page?.props?.auth?.user?.avatar ? (
                                        <img src={(window as any).Inertia.page.props.auth.user.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">U</div>
                                    )}
                                </div>
                                <div className="flex-grow flex flex-col gap-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Tulis komentar..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-[14px] p-0 min-h-[20px] resize-none"
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = target.scrollHeight + 'px';
                                        }}
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            type="submit"
                                            disabled={!newComment.trim() || isSubmittingComment}
                                            className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full disabled:opacity-50"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="space-y-4 pt-2 divide-y divide-border/50">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 pt-4 first:pt-0">
                                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                            {comment.user.avatar ? (
                                                <img src={comment.user.avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                                                    {comment.user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-[14px]">{comment.user.name}</span>
                                                <span className="text-muted-foreground text-xs">·</span>
                                                <span className="text-muted-foreground text-xs">
                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-foreground/90">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
