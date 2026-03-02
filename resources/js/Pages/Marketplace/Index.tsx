import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Badge } from '@/Components/ui/Badge';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Tag, ShoppingBag, Star, Clock } from 'lucide-react';

interface MarketplaceItem {
    id: number;
    name: string;
    slug: string;
    image_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    price: number;
    created_at: string;
}

interface Props {
    items: MarketplaceItem[];
}

export default function Index({ items }: Props) {
    const newItems = items.filter((i) => i.status === 'baru');
    const usedItems = items.filter((i) => i.status === 'bekas');

    return (
        <AppLayout title="Marketplace">
            <Head title="Marketplace - farros.space" />

            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden border-b border-zinc-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#f4f4f5_0%,_transparent_60%)]" />
                <Container>
                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-zinc-100 rounded-full px-4 py-1.5 mb-6">
                            <ShoppingBag className="w-3.5 h-3.5 text-zinc-600" />
                            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Marketplace</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 leading-[1.05] mb-6">
                            Temukan barang
                            <span className="block text-zinc-400">berkualitas.</span>
                        </h1>
                        <p className="text-lg text-zinc-500 max-w-lg leading-relaxed">
                            Koleksi barang pilihan — baru dan bekas — yang sudah diperiksa kondisinya. Siap untuk pindah ke tangan baru.
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mt-10">
                            <div>
                                <p className="text-3xl font-black text-zinc-900">{items.length}</p>
                                <p className="text-sm text-zinc-500 font-medium">Item tersedia</p>
                            </div>
                            <div className="w-px h-10 bg-zinc-200" />
                            <div>
                                <p className="text-3xl font-black text-zinc-900">{newItems.length}</p>
                                <p className="text-sm text-zinc-500 font-medium">Barang baru</p>
                            </div>
                            <div className="w-px h-10 bg-zinc-200" />
                            <div>
                                <p className="text-3xl font-black text-zinc-900">{usedItems.length}</p>
                                <p className="text-sm text-zinc-500 font-medium">Barang bekas</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Items Grid */}
            <section className="py-16 md:py-20">
                <Container>
                    {items.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-bold text-zinc-900">Semua Barang</h2>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <Tag className="w-4 h-4" />
                                    <span>{items.length} item</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {items.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('marketplace.show', item.slug)}
                                        className="group block"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:border-zinc-200 hover:shadow-xl transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden bg-zinc-50">
                                                {item.image_path ? (
                                                    <img
                                                        src={item.image_path}
                                                        alt={item.name}
                                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300 gap-2">
                                                        <ShoppingBag className="w-10 h-10" />
                                                        <span className="text-xs font-medium">No Image</span>
                                                    </div>
                                                )}
                                                {/* Status Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`
                                                        inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold
                                                        ${item.status === 'baru'
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-amber-500 text-white'}
                                                    `}>
                                                        {item.status === 'baru' ? (
                                                            <><Star className="w-3 h-3 mr-1 fill-white" />Baru</>
                                                        ) : (
                                                            <><Clock className="w-3 h-3 mr-1" />Bekas</>
                                                        )}
                                                    </span>
                                                </div>
                                                {/* Arrow overlay */}
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                                        <ArrowRight className="w-4 h-4 text-zinc-900" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <h3 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-zinc-600 transition-colors text-[15px]">
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1.5 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                                <div className="mt-3 pt-3 border-t border-zinc-50">
                                                    <p className="text-sm font-black text-zinc-900">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR',
                                                            minimumFractionDigits: 0
                                                        }).format(item.price ?? 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                                <ShoppingBag className="w-9 h-9 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 mb-2">Belum ada barang</h3>
                            <p className="text-zinc-400 text-sm max-w-sm">
                                Barang akan segera ditambahkan. Cek kembali nanti!
                            </p>
                        </div>
                    )}
                </Container>
            </section>
        </AppLayout>
    );
}
