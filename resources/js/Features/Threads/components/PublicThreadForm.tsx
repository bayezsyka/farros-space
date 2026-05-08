import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/Button';
import { ImagePlus, X, Sparkles } from 'lucide-react';
import axios from 'axios';
import useTranslation from '@/Hooks/useTranslation';

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

const PublicThreadForm = ({ onSuccess }: { onSuccess: (thread: Thread) => void }) => {
    const { auth, locale } = usePage<PageProps>().props;
    const { __ } = useTranslation();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert(__('Max image size is 5MB.'));
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

            await axios.post(route('threads.store', { locale: locale || 'id' }), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

        } catch (error: any) {
            console.error(error);
            alert(__('Failed to post thread.'));
        } finally {
            setIsSubmitting(false);
            window.location.reload();
        }
    };

    if (!auth.user) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <p className="text-sm text-muted-foreground">
                    {__('Log in to share your story with everyone.')}
                </p>
                <a
                    href={route('auth.google', { locale: locale || 'id', redirect: typeof window !== 'undefined' ? window.location.href : '' })}
                    className="flex-shrink-0 flex items-center gap-2 bg-background border border-border px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:bg-muted transition-all active:scale-95"
                >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {__('Sign in with Google')}
                </a>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border">
                    {auth.user.avatar ? (
                        <img src={auth.user.avatar.replace('=s96-c', '=s60-c')} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                        placeholder={__("What's on your mind?")}
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
                        title={__('Upload Image (Max 5MB)')}
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
                    {isSubmitting ? __('Sending...') : __('Post Thread')}
                </Button>
            </div>
        </form>
    );
};

export default PublicThreadForm;
