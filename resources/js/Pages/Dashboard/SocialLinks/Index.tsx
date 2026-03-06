import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Plus, Trash2, Edit2, Check, X, Github, Instagram, Linkedin, Twitter, Link as LinkIcon, Facebook, Youtube } from 'lucide-react';

interface SocialLink {
    id: number;
    platform: string;
    url: string;
    username: string | null;
    is_active: boolean;
}

interface Props {
    socialLinks: SocialLink[];
}

const PLATFORMS = [
    { id: 'github', label: 'GitHub', icon: Github, baseUrl: 'https://github.com/' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, baseUrl: 'https://www.instagram.com/' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, baseUrl: 'https://www.linkedin.com/in/' },
    { id: 'twitter', label: 'Twitter / X', icon: Twitter, baseUrl: 'https://twitter.com/' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, baseUrl: 'https://www.facebook.com/' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, baseUrl: 'https://www.youtube.com/@' },
    { id: 'other', label: 'Other', icon: LinkIcon, baseUrl: '' },
];

export default function Index({ socialLinks }: Props) {
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data: createData, setData: setCreateData, post, processing: createProcessing, reset: resetCreate, errors: createErrors } = useForm({
        platform: 'github',
        url: '',
        username: '',
        is_active: true,
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, reset: resetEdit, errors: editErrors } = useForm({
        platform: '',
        url: '',
        username: '',
        is_active: true,
    });

    const updateCreateUrl = (platformId: string, username: string) => {
        const platform = PLATFORMS.find(p => p.id === platformId);
        if (platform && platform.id !== 'other') {
            const cleanUsername = username.replace(/^@/, '');
            setCreateData(prev => ({
                ...prev,
                platform: platformId,
                username: username,
                url: platform.baseUrl + cleanUsername
            }));
        } else {
            setCreateData(prev => ({ ...prev, platform: platformId, username: username }));
        }
    };

    const updateEditUrl = (platformId: string, username: string) => {
        const platform = PLATFORMS.find(p => p.id === platformId);
        if (platform && platform.id !== 'other') {
            const cleanUsername = username.replace(/^@/, '');
            setEditData(prev => ({
                ...prev,
                platform: platformId,
                username: username,
                url: platform.baseUrl + cleanUsername
            }));
        } else {
            setEditData(prev => ({ ...prev, platform: platformId, username: username }));
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('dashboard.social-links.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreating(false);
                resetCreate();
            },
        });
    };

    const startEdit = (link: SocialLink) => {
        setIsEditing(link.id);
        setEditData({
            platform: link.platform,
            url: link.url,
            username: link.username || '',
            is_active: link.is_active,
        });
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        put(route('dashboard.social-links.update', id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus tautan ini?')) {
            router.delete(route('dashboard.social-links.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const getIcon = (platformId: string) => {
        const plat = PLATFORMS.find(p => p.id === platformId);
        const Icon = plat ? plat.icon : LinkIcon;
        return <Icon className="w-5 h-5 text-zinc-500" />;
    };

    return (
        <DashboardLayout header="Media Sosial">
            <Head title="Media Sosial" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Typography variant="h3" className="font-bold tracking-tight text-zinc-900">
                            Tautan Media Sosial
                        </Typography>
                        <p className="text-zinc-500 text-sm mt-1">
                            Kelola tautan media sosial yang akan ditampilkan pada Hero Section.
                        </p>
                    </div>
                    {!isCreating && (
                        <Button onClick={() => setIsCreating(true)} className="gap-2 rounded-xl">
                            <Plus className="w-4 h-4" /> Tambah Baru
                        </Button>
                    )}
                </div>

                {isCreating && (
                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <Typography variant="large" className="font-semibold mb-4">Tambahkan Tautan Baru</Typography>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Platform</label>
                                    <select
                                        value={createData.platform}
                                        onChange={e => updateCreateUrl(e.target.value, createData.username)}
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500"
                                    >
                                        {PLATFORMS.map(p => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                    {createErrors.platform && <p className="text-red-500 text-xs mt-1">{createErrors.platform}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Username / ID</label>
                                    <input
                                        type="text"
                                        value={createData.username}
                                        onChange={e => updateCreateUrl(createData.platform, e.target.value)}
                                        className="w-full rounded-lg border-zinc-300 shadow-sm focus:border-zinc-500 focus:ring-zinc-500"
                                        placeholder="username_anda"
                                    />
                                    {createErrors.username && <p className="text-red-500 text-xs mt-1">{createErrors.username}</p>}
                                </div>
                                <div className="hidden">
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">URL Publik (Otomatis)</label>
                                    <input
                                        type="url"
                                        value={createData.url}
                                        readOnly
                                        className="w-full rounded-lg border-zinc-300 bg-zinc-50 shadow-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createData.is_active}
                                            onChange={e => setCreateData('is_active', e.target.checked)}
                                            className="rounded border-zinc-300 text-primary shadow-sm focus:ring-primary"
                                        />
                                        <span className="text-sm text-zinc-700 font-medium">Tampilkan di Hero Section</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100">
                                <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={createProcessing} className="rounded-xl">
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-zinc-900">Platform</th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900">URL / Username</th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {socialLinks.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                            Belum ada tautan sosial yang ditambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    socialLinks.map((link) => (
                                        <tr key={link.id} className="hover:bg-zinc-50/50 transition-colors">
                                            {isEditing === link.id ? (
                                                <td colSpan={4} className="px-6 py-4">
                                                    <form onSubmit={(e) => handleUpdate(e, link.id)} className="space-y-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-zinc-700 mb-1 uppercase tracking-wider">Platform</label>
                                                                <select
                                                                    value={editData.platform}
                                                                    onChange={e => updateEditUrl(e.target.value, editData.username)}
                                                                    className="w-full rounded-lg border-zinc-300 shadow-sm text-sm"
                                                                >
                                                                    {PLATFORMS.map(p => (
                                                                        <option key={p.id} value={p.id}>{p.label}</option>
                                                                    ))}
                                                                </select>
                                                                {editErrors.platform && <p className="text-red-500 text-xs mt-1">{editErrors.platform}</p>}
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-zinc-700 mb-1 uppercase tracking-wider">Username</label>
                                                                <input
                                                                    type="text"
                                                                    value={editData.username}
                                                                    onChange={e => updateEditUrl(editData.platform, e.target.value)}
                                                                    className="w-full rounded-lg border-zinc-300 shadow-sm text-sm"
                                                                />
                                                            </div>
                                                            <div className="hidden">
                                                                <label className="block text-xs font-semibold text-zinc-700 mb-1 uppercase tracking-wider">URL</label>
                                                                <input
                                                                    type="url"
                                                                    value={editData.url}
                                                                    readOnly
                                                                    className="w-full rounded-lg border-zinc-300 bg-zinc-50 shadow-sm text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-2">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editData.is_active}
                                                                    onChange={e => setEditData('is_active', e.target.checked)}
                                                                    className="rounded border-zinc-300 text-primary shadow-sm"
                                                                />
                                                                <span className="text-sm font-medium text-zinc-700">Tampil (Aktif)</span>
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(null)} className="rounded-lg h-9">
                                                                    <X className="w-4 h-4 mr-1" /> Batal
                                                                </Button>
                                                                <Button type="submit" size="sm" disabled={editProcessing} className="rounded-lg h-9">
                                                                    <Check className="w-4 h-4 mr-1" /> Simpan
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                                                {getIcon(link.platform)}
                                                            </div>
                                                            <div className="font-semibold text-zinc-900 capitalize">
                                                                {link.platform}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-zinc-900 font-medium">{link.username || '-'}</div>
                                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline max-w-[200px] truncate block">
                                                            {link.url}
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${link.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                                                            {link.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => startEdit(link)}
                                                                className="p-2 text-zinc-400 hover:text-primary hover:bg-zinc-100 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(link.id)}
                                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
