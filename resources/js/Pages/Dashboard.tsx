import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { Package, User, ArrowUpRight, ShoppingBag, MessageSquare, Briefcase } from 'lucide-react';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';
import useTranslation from '@/Hooks/useTranslation';

export default function Dashboard() {
    const { __ } = useTranslation();
    return (
        <DashboardLayout header={__("Overview")}>
            <Head title={__("Dashboard")} />

            <AdminPageHeader
                title={__("Dashboard")}
                description={__("Welcome back! Here's what's happening on farros.space today.")}
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{__("Marketplace")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">--</span>
                        <span className="text-xs text-zinc-400">{__("items")}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{__("Threads")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">--</span>
                        <span className="text-xs text-zinc-400">{__("posts")}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{__("Experience")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">--</span>
                        <span className="text-xs text-zinc-400">{__("entries")}</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{__("Visitor")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">--</span>
                        <span className="text-xs text-zinc-400">{__("log")}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{__("Quick Access")}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={route('dashboard.biodata')} className="group block">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-md p-6 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                <User className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[15px]">{__("Biodata")}</h3>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">{__("Update profile info shown to the public.")}</p>
                    </div>
                </Link>



                <Link href={route('dashboard.marketplace.index')} className="group block">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-md p-6 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                <Package className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[15px]">{__("Marketplace")}</h3>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">{__("Manage items displayed in the marketplace.")}</p>
                    </div>
                </Link>
            </div>
        </DashboardLayout>
    );
}
