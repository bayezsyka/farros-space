import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/Components/ui/Card';
import { Typography } from '@/Components/ui/Typography';
import { Badge } from '@/Components/ui/Badge';

interface Thread {
    id: number;
    title: string | null;
    slug: string;
    content: string;
    tags: string | null;
    created_at: string;
}

interface Props {
    threads: Thread[];
}

export const LatestThreads = ({ threads }: Props) => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {threads.length > 0 ? (
                threads.map((thread) => (
                    <Card key={thread.id} className="group hover:border-primary/50 transition-colors flex flex-col">
                        <CardHeader className="flex-none">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">Thread</Badge>
                                {thread.tags && (
                                    <Badge variant="outline" className="opacity-70">
                                        {thread.tags}
                                    </Badge>
                                )}
                            </div>
                            {thread.title && (
                                <CardTitle className="group-hover:text-primary transition-colors text-lg">
                                    {thread.title}
                                </CardTitle>
                            )}
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Typography variant="muted" className="mt-0 line-clamp-4 whitespace-pre-wrap">
                                {thread.content}
                            </Typography>
                        </CardContent>
                        <CardFooter className="flex-none pt-0">
                            <Typography variant="small" className="text-muted-foreground">
                                {new Date(thread.created_at).toLocaleDateString()}
                            </Typography>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Typography variant="muted">No threads found.</Typography>
            )}
        </div>
    );
};
