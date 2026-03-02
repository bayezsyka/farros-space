import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { MessageSquare, Package, User, ArrowUpRight } from 'lucide-react';
import { AdminPageHeader } from '@/Components/ui/AdminPageHeader';

interface Props {
    threadCount: number;
}

export default function Dashboard({ threadCount }: Props) {
    return (
        <DashboardLayout header="Overview">
            <Head title="Dashboard" />

            <AdminPageHeader
                title="Overview"
                description="Selamat datang di panel admin. Kelola konten dan data site kamu di sini."
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-zinc-100 p-5">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Thread</p>
                    <p className="text-3xl font-black text-zinc-900 mt-1">{threadCount}</p>
                    <p className="text-xs text-zinc-400 mt-1">postingan dipublikasikan</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={route('dashboard.biodata')} className="group block">
                    <div className="bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-md p-6 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                                <User className="w-5 h-5 text-zinc-600" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-zinc-900 text-[15px]">Biodata</h3>
                        <p className="text-sm text-zinc-400 mt-1">Perbarui info profil yang tampil ke publik.</p>
                    </div>
                </Link>

                <Link href={route('dashboard.threads')} className="group block">
                    <div className="bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-md p-6 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                                <MessageSquare className="w-5 h-5 text-zinc-600" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-zinc-900 text-[15px]">Threads</h3>
                        <p className="text-sm text-zinc-400 mt-1">Tulis, edit, dan kelola postingan thread.</p>
                    </div>
                </Link>

                <Link href={route('dashboard.marketplace.index')} className="group block">
                    <div className="bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-md p-6 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4">
                                <Package className="w-5 h-5 text-zinc-600" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-zinc-900 text-[15px]">Marketplace</h3>
                        <p className="text-sm text-zinc-400 mt-1">Kelola barang yang ditampilkan di marketplace.</p>
                    </div>
                </Link>
            </div>
        </DashboardLayout>
    );
}
