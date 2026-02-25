import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { Typography } from '@/Components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Badge } from '@/Components/ui/Badge';
import React, { useState } from 'react';

interface Thread {
    id: number;
    title: string | null;
    content: string;
    visibility: 'public' | 'private';
    tags: string | null;
    created_at: string;
}

interface Props {
    threads: Thread[];
}

export default function Index({ threads }: Props) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingThread, setEditingThread] = useState<Thread | null>(null);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        title: '',
        content: '',
        visibility: 'public' as 'public' | 'private',
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

    return (
        <DashboardLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <Typography variant="large" className="font-bold">
                        Manage Threads
                    </Typography>
                    <Button onClick={() => setIsCreating(true)} disabled={isCreating} className="rounded-xl">
                        Create New Thread
                    </Button>
                </div>
            }
        >
            <Head title="Manage Threads" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {isCreating && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{editingThread ? 'Edit Thread' : 'Create New Thread'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Title (Optional)</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
                                        />
                                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Content</label>
                                        <textarea
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
                                            required
                                        />
                                        {errors.content && <div className="text-red-500 text-xs mt-1">{errors.content}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image (Optional)</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            accept="image/*"
                                        />
                                        {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Visibility</label>
                                            <select
                                                value={data.visibility}
                                                onChange={(e) => setData('visibility', e.target.value as 'public' | 'private')}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
                                            >
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tags/Mood</label>
                                            <input
                                                type="text"
                                                value={data.tags}
                                                onChange={(e) => setData('tags', e.target.value)}
                                                placeholder="e.g. coding, happy"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-background"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button variant="ghost" type="button" onClick={cancel}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            {editingThread ? 'Update Thread' : 'Post Thread'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-6">
                        {threads.map((thread) => (
                            <Card key={thread.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant={thread.visibility === 'public' ? 'default' : 'secondary'}>
                                                {thread.visibility}
                                            </Badge>
                                            {thread.tags && (
                                                <Badge variant="outline" className="opacity-70">
                                                    {thread.tags}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" onClick={() => startEdit(thread)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this thread?')) {
                                                        destroy(route('dashboard.threads.destroy', thread.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                    {thread.title && <CardTitle className="mt-2 text-xl">{thread.title}</CardTitle>}
                                </CardHeader>
                                <CardContent>
                                    <Typography variant="p" className="whitespace-pre-wrap mt-0">
                                        {thread.content}
                                    </Typography>
                                    <Typography variant="small" className="text-muted-foreground mt-4 block">
                                        Posted on {new Date(thread.created_at).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
