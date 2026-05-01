import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Head, Link } from '@inertiajs/react';
import { PageHeader } from '@/Components/ui/PageHeader';
import { ArrowRight, Tag, ShoppingBag, Star, Clock, Package, Sparkles, Search } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';
import SeoHead from '@/Components/SeoHead';
import { createBreadcrumbJsonLd } from '@/lib/structuredData';

interface MarketplaceItem {
    id: number;
    name: string;
    name_id: string | null;
    name_en: string | null;
    slug: string;
    image_path: string | null;
    image_cropped_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    description_id: string | null;
    description_en: string | null;
    price: number;
    created_at: string;
}

interface Props {
    items: MarketplaceItem[];
}

export default function Index({ items }: Props) {
    const { locale } = usePage<any>().props;
    const { __ } = useTranslation();

    const newItems = items.filter((i) => i.status === 'baru');
    const usedItems = items.filter((i) => i.status === 'bekas');

    const [activeFilter, setActiveFilter] = useState<'semua' | 'baru' | 'bekas'>('semua');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = items.filter((item) => {
        const itemName = locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name);
        const itemDesc = locale === 'en' ? (item.description_en || item.description) : (item.description_id || item.description);
        
        const matchFilter = activeFilter === 'semua' || item.status === activeFilter;
        const matchSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (itemDesc || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });

    const filters: { key: 'semua' | 'baru' | 'bekas'; label: string; count: number }[] = [
        { key: 'semua', label: __('All'), count: items.length },
        { key: 'baru', label: __('New'), count: newItems.length },
        { key: 'bekas', label: __('Used'), count: usedItems.length },
    ];

    return (
        <AppLayout title={__('Marketplace')}>
            <SeoHead 
                title={__('Marketplace')} 
                description={__('Curated collection — new and used — quality checked for you.')}
                jsonLd={createBreadcrumbJsonLd([{ name: __('Marketplace'), url: route('marketplace.index', { locale: locale }) }])}
            />

            <PageHeader
                breadcrumbs={[{ label: __('Marketplace') }]}
                badge={{ icon: ShoppingBag, label: __('Marketplace') }}
                title={locale === 'en' ? <>Discover quality<span className="block text-muted-foreground/50">products.</span></> : <>Temukan barang<span className="block text-muted-foreground/50">berkualitas.</span></>}
                subtitle={__('Curated collection — new and used — quality checked for you.')}
                stats={[
                    { icon: Package, value: items.length, label: __('Total items') },
                    { icon: Sparkles, value: newItems.length, label: __('New items') },
                    { icon: Clock, value: usedItems.length, label: __('Used items') },
                ]}
            />

            {/* ── Filter & Search Bar ── */}
            <section className="sticky top-[57px] md:top-[65px] z-30 border-b bg-background/90 backdrop-blur-md">
                <Container>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-3">
                        {/* Search */}
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="text"
                                placeholder={__('Search items...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filter tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-muted/50 border border-border rounded-xl">
                            {filters.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setActiveFilter(f.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeFilter === f.key
                                        ? 'bg-background border border-border shadow-sm text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {f.label}
                                    <span
                                        className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${activeFilter === f.key
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {f.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Items Grid ── */}
            <section className="py-10 md:py-14">
                <Container>
                    {filteredItems.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {filteredItems.length} {__('items found')}
                                    {searchQuery && <span className="ml-1">{__('for')} "<span className="font-semibold text-foreground">{searchQuery}</span>"</span>}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                {filteredItems.map((item) => (
                                    <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-5 border border-border">
                                <ShoppingBag className="w-9 h-9 text-muted-foreground/40" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                                {searchQuery ? __('Not found') : __('No items yet')}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                {searchQuery
                                    ? __('No items match your search ":query"', { query: searchQuery })
                                    : __('Items will be added soon. Check back later!')}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                                >
                                    {__('Clear search')}
                                </button>
                            )}
                        </div>
                    )}
                </Container>
            </section>
        </AppLayout>
    );
}

// ── Item Card Component ──
function ItemCard({ item }: { item: MarketplaceItem }) {
    const { locale } = usePage<any>().props;
    const { __ } = useTranslation();
    return (
        <Link
            href={route('marketplace.show', { locale: locale, marketplaceItem: item.slug })}
            className="group block"
        >
            <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-foreground/20 hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                    {item.image_path ? (
                        <img
                            src={item.image_cropped_path || item.image_path || ''}
                            alt={item.name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            width="300"
                            height="300"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground/30 gap-2">
                            <ShoppingBag className="w-9 h-9" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                        <span className={`
                            inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm
                            ${item.status === 'baru'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-amber-500 text-white'}
                        `}>
                            {item.status === 'baru' ? (
                                <><Star className="w-2.5 h-2.5 fill-white" />{__('New')}</>
                            ) : (
                                <><Clock className="w-2.5 h-2.5" />{__('Used')}</>
                            )}
                        </span>
                    </div>

                    {/* Arrow on hover */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
                        <div className="w-7 h-7 bg-background rounded-full flex items-center justify-center shadow-md border border-border">
                            <ArrowRight className="w-3.5 h-3.5 text-foreground" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-foreground/70 transition-colors text-[13px] sm:text-[14px]">
                        {locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name)}
                    </h3>
                    {(item.description_en || item.description_id || item.description) && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {locale === 'en' ? (item.description_en || item.description) : (item.description_id || item.description)}
                        </p>
                    )}
                    <div className="mt-2.5 pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-foreground">
                            {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(item.price ?? 0)}
                        </p>
                        <Tag className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
