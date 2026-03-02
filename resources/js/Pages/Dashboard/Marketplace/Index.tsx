import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Edit2,
    Trash2,
    Package,
    ArrowUpRight,
    Search,
    LayoutGrid,
    CheckSquare,
    Square,
    ImageIcon,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { AdminPageHeader, AdminActionButton } from '@/Components/ui/AdminPageHeader';
import CollageGenerator from '@/Components/ui/CollageGenerator';

interface MarketplaceItem {
    id: number;
    name: string;
    slug: string;
    image_path: string | null;
    image_cropped_path: string | null;
    status: 'baru' | 'bekas';
    description: string;
    price: string | null;
}

interface Props {
    items: MarketplaceItem[];
    waNumber: string;
}

export default function Index({ items, waNumber }: Props) {
    const [search, setSearch] = useState('');
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

    // Collage selection mode
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [showCollage, setShowCollage] = useState(false);

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (slug: string) => {
        setDeleteSlug(null);
        router.delete(route('dashboard.marketplace.destroy', slug));
    };

    const toggleSelectMode = () => {
        setSelectMode((prev) => {
            if (prev) setSelectedIds(new Set());
            return !prev;
        });
    };

    const toggleItem = useCallback((id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleAll = () => {
        if (selectedIds.size === filtered.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filtered.map((i) => i.id)));
        }
    };

    const selectedItems = items.filter((i) => selectedIds.has(i.id));

    const openCollage = () => {
        if (selectedIds.size === 0) return;
        setShowCollage(true);
    };

    const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;

    return (
        <DashboardLayout header="Marketplace">
            <Head title="Admin Marketplace" />

            <AdminPageHeader
                title="Marketplace"
                description={`${items.length} item terdaftar di katalog`}
                icon={<Package className="w-5 h-5" />}
                action={
                    <div className="flex items-center gap-2">
                        {/* Buat Kolase Button */}
                        <button
                            type="button"
                            onClick={toggleSelectMode}
                            className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all flex-1 sm:flex-none ${selectMode
                                ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            {selectMode ? 'Selesai' : 'Buat Kolase'}
                        </button>

                        <div className="flex-1 sm:flex-none">
                            <AdminActionButton
                                href={route('dashboard.marketplace.create')}
                                icon={<Plus className="w-4 h-4" />}
                            >
                                Tambah Item
                            </AdminActionButton>
                        </div>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex justify-between items-center sm:block">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total</p>
                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-0 sm:mt-1">{items.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex justify-between items-center sm:block">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Baru</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-0 sm:mt-1">{items.filter(i => i.status === 'baru').length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-5 flex justify-between items-center sm:block">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Bekas</p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-0 sm:mt-1">{items.filter(i => i.status === 'bekas').length}</p>
                </div>
            </div>

            {/* Selection Banner */}
            {selectMode && (
                <div className="mb-4 bg-violet-50 border border-violet-200 rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={toggleAll}
                            className="text-violet-600 hover:text-violet-800 transition-colors"
                            title={allSelected ? 'Batal pilih semua' : 'Pilih semua'}
                        >
                            {allSelected ? (
                                <CheckSquare className="w-5 h-5" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                        </button>
                        <p className="text-sm font-semibold text-violet-800">
                            {selectedIds.size > 0
                                ? `${selectedIds.size} item dipilih`
                                : 'Pilih item untuk dibuat kolase'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCollage}
                        disabled={selectedIds.size === 0}
                        className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-sm"
                    >
                        <ImageIcon className="w-4 h-4" />
                        Generate Kolase
                        {selectedIds.size > 0 && (
                            <span className="bg-white/20 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md">
                                {selectedIds.size}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
                <div className="p-4 border-b border-zinc-50">
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari item..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-200 text-zinc-900 placeholder-zinc-400 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-50">
                                {selectMode && (
                                    <th className="pl-5 py-3.5 w-10">
                                        <button
                                            type="button"
                                            onClick={toggleAll}
                                            className="text-zinc-400 hover:text-violet-600 transition-colors"
                                        >
                                            {allSelected ? (
                                                <CheckSquare className="w-4 h-4 text-violet-600" />
                                            ) : (
                                                <Square className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                )}
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Item</th>
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Harga</th>
                                {!selectMode && (
                                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((item) => {
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <tr
                                            key={item.id}
                                            className={`border-b border-zinc-50 last:border-0 transition-colors group ${selectMode
                                                ? isSelected
                                                    ? 'bg-violet-50/60 cursor-pointer hover:bg-violet-50'
                                                    : 'hover:bg-zinc-50/60 cursor-pointer'
                                                : 'hover:bg-zinc-50/60'
                                                }`}
                                            onClick={selectMode ? () => toggleItem(item.id) : undefined}
                                        >
                                            {selectMode && (
                                                <td className="pl-5 py-4">
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-violet-600" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-zinc-300" />
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
                                                        {item.image_path ? (
                                                            <img src={item.image_path} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-4 h-4 text-zinc-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-zinc-900 text-sm truncate max-w-[200px]">{item.name}</p>
                                                        <p className="text-xs text-zinc-400 font-mono">/{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${item.status === 'baru' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {item.status === 'baru' ? 'Baru' : 'Bekas'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-medium text-zinc-800">
                                                    {item.price ?? <span className="text-zinc-300">—</span>}
                                                </span>
                                            </td>
                                            {!selectMode && (
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        <a
                                                            href={route('marketplace.show', item.slug)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                                                            title="Lihat publik"
                                                        >
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                                            title="Buat Kolase"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedIds(new Set([item.id]));
                                                                setShowCollage(true);
                                                            }}
                                                        >
                                                            <ImageIcon className="w-4 h-4" />
                                                        </button>
                                                        <Link href={route('dashboard.marketplace.edit', item.slug)}>
                                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Edit">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                            title="Hapus"
                                                            onClick={() => setDeleteSlug(item.slug)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={selectMode ? 4 : 4} className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2.5">
                                            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
                                                <Package className="w-5 h-5 text-zinc-300" />
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-700">
                                                {search ? 'Tidak ditemukan' : 'Belum ada item'}
                                            </p>
                                            <p className="text-xs text-zinc-400">
                                                {search ? `Tidak ada hasil untuk "${search}"` : 'Klik tombol "Tambah Item" untuk mulai.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteSlug !== null && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full border border-zinc-100">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-base font-bold text-zinc-900">Hapus item ini?</h3>
                        <p className="text-sm text-zinc-500 mt-1">Tindakan ini tidak bisa dibatalkan.</p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setDeleteSlug(null)}
                                className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteSlug)}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Collage Generator Modal */}
            {showCollage && (
                <CollageGenerator
                    items={selectedItems}
                    waNumber={waNumber}
                    onClose={() => setShowCollage(false)}
                />
            )}
        </DashboardLayout>
    );
}
