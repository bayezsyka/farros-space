import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

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

interface CommentCardProps {
    comment: Comment;
    onDeleted?: (id: number) => void;
}

export const CommentCard = ({ comment, onDeleted }: CommentCardProps) => {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const isOwner = user?.id === comment.user.id;
    const isAdmin = user?.is_admin === true;
    const canManage = isOwner || isAdmin;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Apakah Yakin ingin menghapus komentar ini?')) return;
        setIsDeleting(true);
        try {
            // Using axios because comments are often loaded dynamically in ThreadCard
            // But we can also use Inertia if it's on the show page. We will use axios
            // as ThreadCard uses axios to fetch them initially.
            await axios.delete(route('threads.comments.destroy', comment.id));
            if (onDeleted) onDeleted(comment.id);
        } catch (error) {
            console.error(error);
            alert("Gagal menghapus komentar");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 first:pt-0 group relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                {comment.user.avatar ? (
                    <img src={comment.user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                        {comment.user.name.charAt(0)}
                    </div>
                )}
            </div>
            <div className="flex-grow min-w-0 space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <span className="font-bold text-[12px] sm:text-[14px]">{comment.user.name}</span>
                    <span className="text-muted-foreground text-[10px] sm:text-xs">·</span>
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: localeId })}
                    </span>
                </div>
                <p className="text-[12px] sm:text-[14px] text-foreground/90 break-words">{comment.content}</p>
            </div>

            {canManage && (
                <div className="absolute right-0 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-6 mt-1 w-32 bg-popover rounded-xl border border-border shadow-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                {isDeleting ? 'Menghapus...' : 'Hapus'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
