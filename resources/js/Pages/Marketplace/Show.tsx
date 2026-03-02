import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingBag, Star, Clock, MessageCircle, Tag, Share2, CheckCircle2 } from 'lucide-react';

interface MarketplaceItem {
    id: number;
    name: string;
    slug: string;
    image_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    price: number | null;
    whatsapp: string | null;
    created_at: string;
}

interface Props {
    item: MarketplaceItem;
}

export default function Show({ item }: Props) {
    const waNumber = item.whatsapp?.replace(/\D/g, '');
    const waMessage = encodeURIComponent(`Halo, saya tertarik dengan barang "${item.name}" yang ada di marketplace kamu.`);
    const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: item.name,
                text: item.description ?? '',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <AppLayout title={item.name}>
            <Head title={`${item.name} - Marketplace farros.space`} />

            <section className="py-10 md:py-16">
                <Container>
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link
                            href={route('marketplace.index')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </div>
                            Kembali ke Marketplace
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        {/* Image */}
                        <div className="lg:sticky lg:top-8">
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                                {item.image_path ? (
                                    <img
                                        src={item.image_path}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300 gap-3">
                                        <ShoppingBag className="w-16 h-16" />
                                        <span className="text-sm font-medium">Tidak ada gambar</span>
                                    </div>
                                )}

                                {/* Status badge on image */}
                                <div className="absolute top-4 left-4">
                                    <span className={`
                                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm
                                        ${item.status === 'baru'
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-amber-500 text-white'}
                                    `}>
                                        {item.status === 'baru' ? (
                                            <><Star className="w-3.5 h-3.5 fill-white" />Barang Baru</>
                                        ) : (
                                            <><Clock className="w-3.5 h-3.5" />Barang Bekas</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-8">
                            {/* Header */}
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
                                        {item.name}
                                    </h1>
                                    <button
                                        onClick={handleShare}
                                        className="shrink-0 w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                                        title="Share"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="inline-flex items-center gap-1.5 bg-zinc-900 text-white px-4 py-2 rounded-xl">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-lg font-black">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0
                                            }).format(item.price ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Condition Card */}
                            <div className={`
                                flex items-start gap-4 p-4 rounded-2xl border
                                ${item.status === 'baru'
                                    ? 'bg-emerald-50/50 border-emerald-100'
                                    : 'bg-amber-50/50 border-amber-100'}
                            `}>
                                <div className={`
                                    shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                                    ${item.status === 'baru' ? 'bg-emerald-100' : 'bg-amber-100'}
                                `}>
                                    {item.status === 'baru'
                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        : <Clock className="w-5 h-5 text-amber-600" />
                                    }
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${item.status === 'baru' ? 'text-emerald-700' : 'text-amber-700'}`}>
                                        Kondisi: {item.status === 'baru' ? 'Barang Baru' : 'Barang Bekas'}
                                    </p>
                                    <p className={`text-sm mt-0.5 ${item.status === 'baru' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {item.status === 'baru'
                                            ? 'Produk masih baru, belum pernah digunakan.'
                                            : 'Produk seminimal mungkin bekas pakai. Kondisi dijelaskan di deskripsi.'}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Deskripsi</h2>
                                <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-sm">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="pt-2 space-y-3">
                                {waUrl ? (
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bc5a] text-white font-bold rounded-2xl transition-colors text-base shadow-sm"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Hubungi via WhatsApp
                                    </a>
                                ) : (
                                    <div className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-zinc-100 text-zinc-400 font-bold rounded-2xl text-base cursor-default">
                                        <MessageCircle className="w-5 h-5" />
                                        Kontak belum tersedia
                                    </div>
                                )}
                                <Link
                                    href={route('marketplace.index')}
                                    className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold rounded-2xl transition-colors text-base border border-zinc-200"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Lihat Barang Lain
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </AppLayout>
    );
}
