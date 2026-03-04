import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShoppingBag, Star, Clock, MessageCircle, Tag, Share2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

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
    status: 'baru' | 'bekas';
    description: string | null;
    price: number | null;
    whatsapp: string | null;
    created_at: string;
    foto_detail_items?: FotoDetailItem[];
}

interface Props {
    item: MarketplaceItem;
}

export default function Show({ item }: Props) {
    const waNumber = item.whatsapp?.replace(/\D/g, '');
    const waMessage = encodeURIComponent(`Halo, saya tertarik dengan barang "${item.name}" yang ada di marketplace kamu.`);
    const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

    // Build a unified gallery: main photo first, then detail photos
    const allPhotos: string[] = [
        ...(item.image_path ? [item.image_path] : []),
        ...(item.foto_detail_items?.map(f => f.foto_path) ?? []),
    ];

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prev = useCallback(() => {
        setLightboxIndex(i => (i !== null ? (i - 1 + allPhotos.length) % allPhotos.length : null));
    }, [allPhotos.length]);

    const next = useCallback(() => {
        setLightboxIndex(i => (i !== null ? (i + 1) % allPhotos.length : null));
    }, [allPhotos.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, prev, next]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: item.name, text: item.description ?? '', url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const detailPhotos = item.foto_detail_items ?? [];

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
                        {/* Image Gallery */}
                        <div className="lg:sticky lg:top-8 space-y-3">
                            {/* Main Photo */}
                            <button
                                onClick={() => item.image_path && openLightbox(0)}
                                className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 block group ${item.image_path ? 'cursor-zoom-in' : 'cursor-default'}`}
                            >
                                {item.image_path ? (
                                    <>
                                        <img
                                            src={item.image_path}
                                            alt={item.name}
                                            className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                                        />
                                        {/* Zoom hint */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-end p-4">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                                                Tap untuk perbesar
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300 gap-3">
                                        <ShoppingBag className="w-16 h-16" />
                                        <span className="text-sm font-medium">Tidak ada gambar</span>
                                    </div>
                                )}

                                {/* Status badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`
                                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm
                                        ${item.status === 'baru' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}
                                    `}>
                                        {item.status === 'baru' ? (
                                            <><Star className="w-3.5 h-3.5 fill-white" />Barang Baru</>
                                        ) : (
                                            <><Clock className="w-3.5 h-3.5" />Barang Bekas</>
                                        )}
                                    </span>
                                </div>

                                {/* Photo count badge */}
                                {allPhotos.length > 1 && (
                                    <div className="absolute bottom-4 right-4">
                                        <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-xl">
                                            1 / {allPhotos.length}
                                        </span>
                                    </div>
                                )}
                            </button>

                            {/* Detail Photo Thumbnails */}
                            {detailPhotos.length > 0 && (
                                <div className={`grid gap-2 ${detailPhotos.length === 1 ? 'grid-cols-1' : detailPhotos.length === 2 ? 'grid-cols-2' : detailPhotos.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                    {detailPhotos.map((detail, idx) => {
                                        // lightbox index: main photo (if exists) is 0, details start from offset
                                        const lbIdx = (item.image_path ? 1 : 0) + idx;
                                        return (
                                            <button
                                                key={detail.id}
                                                onClick={() => openLightbox(lbIdx)}
                                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-zinc-100 hover:border-zinc-400 group cursor-zoom-in transition-all bg-zinc-50 focus:outline-none focus:border-zinc-700"
                                            >
                                                <img
                                                    src={detail.foto_path}
                                                    alt={`Detail foto ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                                <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                                                        {lbIdx + 1} / {allPhotos.length}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
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
                                                minimumFractionDigits: 0,
                                            }).format(item.price ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Condition Card */}
                            <div className={`
                                flex items-start gap-4 p-4 rounded-2xl border
                                ${item.status === 'baru' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}
                            `}>
                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'baru' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
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

            {/* ── Lightbox Modal ── */}
            {lightboxIndex !== null && allPhotos.length > 0 && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.92)' }}
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                        aria-label="Tutup"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Counter */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
                        <span className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                            {lightboxIndex + 1} / {allPhotos.length}
                        </span>
                    </div>

                    {/* Prev button */}
                    {allPhotos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 md:left-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                            aria-label="Sebelumnya"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative max-w-4xl max-h-[85vh] w-full mx-16 md:mx-24 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            key={lightboxIndex}
                            src={allPhotos[lightboxIndex]}
                            alt={`Foto ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none"
                            style={{ animation: 'fadeIn 0.2s ease' }}
                        />
                    </div>

                    {/* Next button */}
                    {allPhotos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 md:right-8 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                            aria-label="Berikutnya"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    {allPhotos.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 max-w-sm overflow-x-auto">
                            {allPhotos.map((photo, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                                    className={`shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:border-white/70 opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={photo} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
        </AppLayout>
    );
}
