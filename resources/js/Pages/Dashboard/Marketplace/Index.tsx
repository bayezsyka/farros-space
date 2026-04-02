import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
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
    Newspaper,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { AdminPageHeader, AdminActionButton } from '@/Components/ui/AdminPageHeader';
import CollageGenerator from '@/Components/ui/CollageGenerator';
import ProductPosterGenerator from '@/Components/ui/ProductPosterGenerator';

interface FotoDetailItem {
    id: number;
    marketplace_item_id: number;
    foto_path: string;
}

interface MarketplaceItem {
    id: number;
    name: string;
    slug: string;
    image_path: string | null;
    image_cropped_path: string | null;
    status: 'baru' | 'bekas';
    description: string;
    price: string | null;
    whatsapp: string | null;
    foto_detail_items?: FotoDetailItem[];
}

interface Props {
    items: MarketplaceItem[];
    waNumber: string;
}

export default function Index({ items, waNumber }: Props) {
    const { __ } = useTranslation();
    const { locale } = usePage<any>().props;
    const [search, setSearch] = useState('');
    const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

    // Collage selection mode
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [showCollage, setShowCollage] = useState(false);

    // Product Poster
    const [posterItem, setPosterItem] = useState<MarketplaceItem | null>(null);

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
                description={__(":count items listed in catalog", { count: items.length.toString() })}
                icon={<Package className="w-5 h-5" />}
                action={
                    <div className="flex items-center gap-2">
                        {/* Buat Kolase Button */}
                        <button
                            type="button"
                            onClick={toggleSelectMode}
                            className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all flex-1 sm:flex-none ${selectMode
                                ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            {selectMode ? __("Done") : __("Create Collage")}
                        </button>

                        <div className="flex-1 sm:flex-none">
                            <AdminActionButton
                                href={route('dashboard.marketplace.create')}
                                icon={<Plus className="w-4 h-4" />}
                            >
                                {__("Add Item")}
                            </AdminActionButton>
                        </div>
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-5 flex justify-between items-center sm:block shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("Total")}</p>
                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-0 sm:mt-1">{items.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-5 flex justify-between items-center sm:block shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("New")}</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-0 sm:mt-1">{items.filter(i => i.status === 'baru').length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 sm:p-5 flex justify-between items-center sm:block shadow-sm">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("Used")}</p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 mt-0 sm:mt-1">{items.filter(i => i.status === 'bekas').length}</p>
                </div>
            </div>

            {/* Selection Banner */}
            {selectMode && (
                <div className="mb-4 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={toggleAll}
                            className="text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-200 transition-colors"
                            title={allSelected ? __("Cancel select all") : __("Select all")}
                        >
                            {allSelected ? (
                                <CheckSquare className="w-5 h-5" />
                            ) : (
                                <Square className="w-5 h-5" />
                            )}
                        </button>
                        <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">
                            {selectedIds.size > 0
                                ? __(":count items selected", { count: selectedIds.size.toString() })
                                : __("Select items to create collage")}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCollage}
                        disabled={selectedIds.size === 0}
                        className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-sm"
                    >
                        <ImageIcon className="w-4 h-4" />
                        {__("Generate Collage")}
                        {selectedIds.size > 0 && (
                            <span className="bg-white/20 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md">
                                {selectedIds.size}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-zinc-50 dark:border-zinc-800/50">
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            placeholder={__("Search items...")}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-50 dark:border-zinc-800/50">
                                {selectMode && (
                                    <th className="pl-5 py-3.5 w-10">
                                        <button
                                            type="button"
                                            onClick={toggleAll}
                                            className="text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                        >
                                            {allSelected ? (
                                                <CheckSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                            ) : (
                                                <Square className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                )}
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("Item")}</th>
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("Status")}</th>
                                <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{__("Price")}</th>
                                {!selectMode && (
                                    <th className="px-5 py-3.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-right">{__("Action")}</th>
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
                                            className={`border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 transition-colors group ${selectMode
                                                ? isSelected
                                                    ? 'bg-violet-50/60 dark:bg-violet-500/5 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-500/10'
                                                    : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 cursor-pointer'
                                                : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40'
                                                }`}
                                            onClick={selectMode ? () => toggleItem(item.id) : undefined}
                                        >
                                            {selectMode && (
                                                <td className="pl-5 py-4">
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
                                                    )}
                                                </td>
                                            )}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-700">
                                                        {item.image_path ? (
                                                            <img src={item.image_path} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate max-w-[200px]">{item.name}</p>
                                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">/{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${item.status === 'baru' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                                                    {item.status === 'baru' ? __("New") : __("Used")}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-300">
                                                    {item.price ?? <span className="text-zinc-300 dark:text-zinc-700">—</span>}
                                                </span>
                                            </td>
                                            {!selectMode && (
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        <a
                                                            href={route('marketplace.show', item.slug)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                                            title={__("View public")}
                                                        >
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                                                            title={__("Create Product Poster")}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setPosterItem(item);
                                                            }}
                                                        >
                                                            <Newspaper className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all"
                                                            title={__("Create Collage")}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedIds(new Set([item.id]));
                                                                setShowCollage(true);
                                                            }}
                                                        >
                                                            <ImageIcon className="w-4 h-4" />
                                                        </button>
                                                        <Link href={route('dashboard.marketplace.edit', item.slug)}>
                                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all" title={__("Edit")}>
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                            title={__("Delete")}
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
                                            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                                <Package className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                {search ? __("Not found") : __("No items yet")}
                                            </p>
                                            <p className="text-xs text-zinc-400 dark:text-zinc-500">
                                                {search ? __("No results for \":search\"", { search }) : __("Click \"Add Item\" button to start.")}
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl max-w-sm w-full border border-zinc-100 dark:border-zinc-800">
                        <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{__("Delete this item?")}</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{__("This action cannot be undone.")}</p>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => setDeleteSlug(null)}
                                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                {__("Cancel")}
                            </button>
                            <button
                                onClick={() => handleDelete(deleteSlug)}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors shadow-lg shadow-red-500/20"
                            >
                                {__("Delete")}
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
                    lang={locale as any}
                    onClose={() => setShowCollage(false)}
                />
            )}

            {/* Product Poster Modal */}
            {posterItem && (
                <ProductPosterGenerator
                    item={posterItem}
                    lang={locale as any}
                    onClose={() => setPosterItem(null)}
                />
            )}
        </DashboardLayout>
    );
}
