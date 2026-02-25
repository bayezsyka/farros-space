import React, { useState } from 'react';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { ThreadCard } from '../components/ThreadCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Thread {
    id: number;
    title: string | null;
    content: string;
    image_url: string | null;
    likes_count: number;
    shares_count: number;
    tags: string | null;
    created_at: string;
    allow_comments: boolean;
    comments_count: number;
}

interface ThreadFeedSectionProps {
    threads: Thread[];
    profile?: any;
}

export const ThreadFeedSection = ({ threads, profile }: ThreadFeedSectionProps) => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const totalPages = Math.ceil(threads.length / perPage);
    
    const paginatedThreads = threads.slice((page - 1) * perPage, page * perPage);

    return (
        <Section id="threads-feed" spacing="lg">
            <Container className="max-w-2xl px-0 border-x border-border/50 bg-background min-h-screen">
                {threads.length > 0 ? (
                    <div className="space-y-0">
                        <div className="divide-y divide-border/50">
                            {paginatedThreads.map((thread) => (
                                <ThreadCard key={thread.id} thread={thread} profile={profile} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-8 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </Button>
                                <div className="text-sm font-medium">
                                    Page {page} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="gap-2"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                        <Typography variant="large" className="text-muted-foreground">
                            No threads found.
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground mt-2">
                            Check back later for new updates!
                        </Typography>
                    </div>
                )}
            </Container>
        </Section>
    );
};
