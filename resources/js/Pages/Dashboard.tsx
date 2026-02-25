import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography } from '@/Components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { MessageSquare, Users, Eye, ArrowUpRight } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

interface Props {
    threadCount: number;
}

export default function Dashboard({ threadCount }: Props) {
    return (
        <DashboardLayout
            header={
                <Typography variant="large" className="font-bold">Overview</Typography>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                {/* Welcome Back */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Typography variant="h2" className="border-none pb-0">Welcome back!</Typography>
                        <Typography variant="muted">Manage your personal space and threads.</Typography>
                    </div>
                    <Link href={route('dashboard.threads')}>
                        <Button className="rounded-xl gap-2">
                            <MessageSquare className="w-4 h-4" /> Create Thread
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white border-none shadow-sm ring-1 ring-zinc-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Threads</CardTitle>
                            <MessageSquare className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{threadCount}</div>
                            <p className="text-xs text-muted-foreground pt-1">
                                All posted threads
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-primary rounded-2xl p-8 text-primary-foreground flex flex-col justify-between h-64 shadow-lg">
                        <div className="space-y-2">
                            <Typography variant="h3" className="text-white">Your Site Profile</Typography>
                            <Typography variant="small" className="text-white/80">Keep your personal information up to date for public visitors.</Typography>
                        </div>
                        <Link href={route('dashboard.biodata')}>
                            <Button variant="secondary" className="w-fit rounded-xl shadow-md font-bold">Update Biodata</Button>
                        </Link>
                    </div>
                    <Link href={route('dashboard.threads')} className="block">
                        <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center space-y-4 h-64 group hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <div>
                                <Typography variant="large" className="font-bold">Create New Thread</Typography>
                                <Typography variant="muted">Share what's on your mind with the world.</Typography>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}

