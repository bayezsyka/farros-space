import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Typography } from '@/Components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import React, { useState, useRef } from 'react';
import Modal from '@/Components/Modal';
import { AdminPageHeader, AdminActionButton } from '@/Components/ui/AdminPageHeader';
import {
    Image as ImageIcon,
    X,
    ChevronDown,
    Smile,
    Users,
    User,
    MapPin,
    MoreHorizontal,
    Type,
    FileImage,
    MessageCircle,
    PenSquare,
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface Thread {
    id: number;
    title: string | null;
    content: string;
    visibility: 'public' | 'private';
    allow_comments: boolean;
    tags: string | null;
    created_at: string;
    image_url: string | null;
}

interface Props {
    threads: Thread[];
    profile: any;
}

export default function Index({ threads, profile }: Props) {
    const { auth } = usePage().props as any;
    const [isCreating, setIsCreating] = useState(false);
    const [editingThread, setEditingThread] = useState<Thread | null>(null);
    const [threadComments, setThreadComments] = useState<Record<number, any[]>>({});
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        title: '',
        content: '',
        visibility: 'public' as 'public' | 'private',
        allow_comments: true,
        tags: '',
        image: null as File | null,
        _method: 'POST' as 'POST' | 'PUT',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingThread) {
            post(route('dashboard.threads.update', editingThread.id), {
                forceFormData: true,
                onSuccess: () => {
                    setEditingThread(null);
                    setIsCreating(false);
                    reset();
                },
            });
        } else {
            post(route('dashboard.threads.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                },
            });
        }
    };

    const startEdit = (thread: Thread) => {
        setEditingThread(thread);
        setData({
            title: thread.title || '',
            content: thread.content,
            visibility: thread.visibility,
            allow_comments: thread.allow_comments,
            tags: thread.tags || '',
            image: null,
            _method: 'PUT',
        });
        setIsCreating(true);
    };

    const cancel = () => {
        setIsCreating(false);
        setEditingThread(null);
        reset();
    };

    const toggleThreadComments = async (threadId: number) => {
        if (expandedComments[threadId]) {
            setExpandedComments({ ...expandedComments, [threadId]: false });
            return;
        }

        if (!threadComments[threadId]) {
            try {
                const response = await axios.get(route('threads.comments.index', threadId));
                setThreadComments({ ...threadComments, [threadId]: response.data });
            } catch (error) {
                console.error("Gagal mengambil komentar", error);
            }
        }
        setExpandedComments({ ...expandedComments, [threadId]: true });
    };

    const deleteComment = async (commentId: number, threadId: number) => {
        if (!confirm('Hapus komentar ini?')) return;

        try {
            await axios.delete(route('dashboard.comments.destroy', commentId));
            setThreadComments({
                ...threadComments,
                [threadId]: threadComments[threadId].filter(c => c.id !== commentId)
            });
        } catch (error) {
            alert('Gagal menghapus komentar');
        }
    };

    return (
        <DashboardLayout header="Threads">
            <Head title="Kelola Thread" />

            <AdminPageHeader
                title="Threads"
                description="Tulis, edit, dan kelola postingan thread kamu."
                icon={<MessageCircle className="w-5 h-5" />}
                action={
                    <AdminActionButton
                        onClick={() => setIsCreating(true)}
                        icon={<PenSquare className="w-4 h-4" />}
                    >
                        Buat Thread
                    </AdminActionButton>
                }
            />

            <div className="mx-auto max-w-2xl space-y-6">

                <Card className="rounded-2xl shadow-sm border-none ring-1 ring-zinc-100 bg-gradient-to-br from-white to-zinc-50/30 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-zinc-100 shrink-0">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold text-2xl uppercase">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Typography variant="large" className="font-bold text-zinc-900">
                                        {profile?.full_name || auth.user.name}
                                    </Typography>
                                    <Badge variant="outline" className="text-[10px] bg-zinc-100/50 border-zinc-200">Identitas Publik</Badge>
                                </div>
                                <Typography variant="small" className="text-zinc-500 mt-0.5">
                                    {profile?.headline || 'Penulis di Farros Space'}
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* FB-Style Creation Card */}
                <Card className="rounded-xl shadow-sm border-none ring-1 ring-zinc-200 overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex-shrink-0 overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="flex-grow bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-full px-4 text-left text-zinc-500 text-[15px]"
                            >
                                Apa yang Anda pikirkan, {auth.user.name.split(' ')[0]}?
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-zinc-100 grid grid-cols-1">
                            <button
                                onClick={() => {
                                    setIsCreating(true);
                                }}
                                className="flex items-center justify-center gap-2 hover:bg-zinc-100 py-2 rounded-lg transition-colors"
                            >
                                <ImageIcon className="w-6 h-6 text-green-500" />
                                <span className="text-zinc-600 font-semibold text-sm">Foto</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Modal Post Creator */}
                <Modal show={isCreating} onClose={cancel} maxWidth="md">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-zinc-50 font-bold">
                            <div className="w-8" /> {/* spacer */}
                            <Typography variant="h3" className="text-lg tracking-tight">
                                {editingThread ? 'Perbarui Postingan' : 'Buat Postingan Baru'}
                            </Typography>
                            <button
                                onClick={cancel}
                                className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex-shrink-0 overflow-hidden shadow-sm">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300 font-bold text-lg uppercase">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="font-bold text-zinc-900 text-[15px]">{auth.user.name}</div>
                                    <div className="flex gap-2 mt-1.5 font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setData('visibility', data.visibility === 'public' ? 'private' : 'public')}
                                            className="bg-zinc-50 border border-zinc-100 px-3 py-1 rounded-lg flex items-center gap-1.5 text-[11px] text-zinc-600 hover:bg-zinc-100 transition-colors"
                                        >
                                            <Users className="w-3 h-3" />
                                            {data.visibility === 'public' ? 'Publik' : 'Privat'}
                                            <ChevronDown className="w-3 h-3 text-zinc-300" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('allow_comments', !data.allow_comments)}
                                            className={cn(
                                                "px-3 py-1 rounded-lg flex items-center gap-1.5 text-[11px] transition-all",
                                                data.allow_comments
                                                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                    : "bg-zinc-50 text-zinc-400 border border-zinc-100"
                                            )}
                                        >
                                            <MessageCircle className="w-3 h-3" />
                                            {data.allow_comments ? 'Komentar Aktif' : 'Komentar Nonaktif'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder={`Ketuk untuk mulai menulis, ${auth.user.name.split(' ')[0]}...`}
                                className="w-full text-lg border-none focus:ring-0 p-0 mb-6 min-h-[120px] bg-transparent resize-none overflow-hidden placeholder-zinc-300 text-zinc-800 leading-relaxed"
                                required
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                }}
                            />

                            <div className="mb-6 relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300">
                                    <span className="font-bold text-lg">#</span>
                                </div>
                                <input
                                    type="text"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="tambahkan, tag, baru..."
                                    className="w-full pl-8 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-zinc-100 transition-all font-medium"
                                />
                            </div>

                            {/* Image Preview / Upload Area */}
                            <div className="mb-8 group">
                                {data.image || editingThread?.image_url ? (
                                    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-zinc-100 h-64">
                                        <img
                                            src={data.image ? URL.createObjectURL(data.image) : editingThread?.image_url!}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setData('image', null);
                                            }}
                                            className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-10 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center gap-3 text-zinc-300 hover:border-zinc-200 hover:bg-zinc-50 transition-all font-bold"
                                    >
                                        <ImageIcon className="w-10 h-10" />
                                        <span className="text-xs uppercase tracking-widest">Tambahkan Foto</span>
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData('image', e.target.files[0]);
                                        }
                                    }}
                                    accept="image/*"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                className="w-full py-7 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base shadow-lg shadow-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={processing}
                            >
                                {editingThread ? 'Simpan Perubahan' : 'Bagikan Sekarang'}
                            </Button>
                        </form>
                    </div>
                </Modal>

                {/* Feed of Threads */}
                <div className="space-y-4">
                    {threads.map((thread) => (
                        <Card key={thread.id} className="rounded-xl shadow-sm border-none ring-1 ring-zinc-200">
                            <CardHeader className="pb-2 p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">F</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-[15px]">{profile?.full_name || 'Farros'}</div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-zinc-500">
                                                    {new Date(thread.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-zinc-300">·</span>
                                                <Badge variant={thread.visibility === 'public' ? 'default' : 'secondary'} className="text-[10px] px-1 py-0 h-4">
                                                    {thread.visibility === 'public' ? 'Publik' : 'Privat'}
                                                </Badge>
                                                {!thread.allow_comments && (
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 text-zinc-400">
                                                        Komentar Mati
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => startEdit(thread)}
                                            className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 transition-colors"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Hapus postingan ini?')) {
                                                    destroy(route('dashboard.threads.destroy', thread.id));
                                                }
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <Typography variant="p" className="text-[15px] leading-relaxed whitespace-pre-wrap mt-0">
                                    {thread.content}
                                </Typography>
                                {thread.image_url && (
                                    <div className="mt-3 rounded-xl overflow-hidden border border-zinc-100">
                                        <img src={thread.image_url} className="w-full h-auto object-cover max-h-[500px]" />
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-zinc-100">
                                    <button
                                        onClick={() => toggleThreadComments(thread.id)}
                                        className="text-xs font-bold text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {expandedComments[thread.id] ? 'Sembunyikan Komentar' : 'Lihat Komentar'}
                                    </button>

                                    {expandedComments[thread.id] && (
                                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {threadComments[thread.id]?.length === 0 ? (
                                                <p className="text-xs text-zinc-400 text-center py-2">Belum ada komentar.</p>
                                            ) : (
                                                threadComments[thread.id]?.map((comment) => (
                                                    <div key={comment.id} className="flex gap-3 items-start group">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0">
                                                            {comment.user.avatar ? (
                                                                <img src={comment.user.avatar} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                                                                    {comment.user.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow bg-zinc-50 rounded-2xl p-3 relative">
                                                            <div className="font-bold text-[13px]">{comment.user.name}</div>
                                                            <p className="text-[13px] text-zinc-700">{comment.content}</p>

                                                            <button
                                                                onClick={() => deleteComment(comment.id, thread.id)}
                                                                className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-white shadow-sm border border-zinc-100 items-center justify-center text-red-500 hover:bg-red-50 hidden group-hover:flex transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
