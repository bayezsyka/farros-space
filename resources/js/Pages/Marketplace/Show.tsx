import AppLayout from '@/Layouts/AppLayout';
import { Container } from '@/Components/ui/Container';
import { Link, usePage } from '@inertiajs/react';
import SeoHead from '@/Components/SeoHead';
import { createProductJsonLd } from '@/lib/structuredData';
import { ArrowLeft, ShoppingBag, Star, Clock, MessageCircle, Tag, Share2, CheckCircle2, Loader2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { ShareItemModal } from '@/Components/ui/ShareItemModal';
import { useState, useEffect, useCallback } from 'react';
import { generateShareBlob, buildShareCaption, buildImageCaption } from '@/Components/ui/shareHelpers';

interface FotoDetailItem {
    id: number;
    marketplace_item_id: number;
    foto_path: string;
}

interface MarketplaceItem {
    id: number;
    name: string;
    name_id: string | null;
    name_en: string | null;
    slug: string;
    image_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    description_id: string | null;
    description_en: string | null;
    price: number | null;
    whatsapp: string | null;
    created_at: string;
    foto_detail_items?: FotoDetailItem[];
}

interface Props {
    item: MarketplaceItem;
}

export default function Show({ item }: Props) {
    const { __ } = useTranslation();
    const { locale } = usePage<any>().props;

    const waNumber = item.whatsapp?.replace(/\D/g, '') ?? '';
    const waMessage = encodeURIComponent(__('Halo, saya tertarik dengan barang ":name" yang ada di marketplace kamu.', { name: item.name }));
    const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

    // Share state
    const [shareBlob, setShareBlob] = useState<Blob | null>(null);
    const [shareGenerating, setShareGenerating] = useState(true);
    const [showShareModal, setShowShareModal] = useState(false); // fallback for desktop

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

    // ── Pre-generate share poster silently on mount ───────────────────────────
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setShareGenerating(true);
            const blob = await generateShareBlob(item, locale as any);
            if (!cancelled) {
                setShareBlob(blob);
                setShareGenerating(false);
            }
        })();
        return () => { cancelled = true; };
    }, [item, locale]);

    // ── Share handler ─────────────────────────────────────────────────────────
    const handleShare = useCallback(async () => {
        const caption = buildShareCaption(item, locale as any);
        const itemUrl = `https://farros.space/marketplace/${item.slug}`;

        // Share image + short caption → goes into WA's caption field (1 message, not 2)
        if (shareBlob && navigator.share) {
            const file = new File([shareBlob], `${item.slug}.png`, { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        text: buildImageCaption(item, locale as any), // short caption, no URL (QR has it)
                        title: item.name,
                    });
                    return;
                } catch { return; }
            }
        }

        // Fallback: share text + url (no file, e.g. older mobile or no file-share support)
        if (navigator.share) {
            try {
                await navigator.share({ title: item.name, text: caption, url: itemUrl });
                return;
            } catch { return; }
        }

        // Desktop / unsupported → open modal with preview + download
        setShowShareModal(true);
    }, [shareBlob, item]);

    const detailPhotos = item.foto_detail_items ?? [];

    return (
        <AppLayout title={locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name)}>
            <SeoHead 
                title={locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name)}
                description={locale === 'en' ? (item.description_en || item.description || undefined) : (item.description_id || item.description || undefined)}
                image={item.image_path || undefined}
                type="product"
                jsonLd={createProductJsonLd(item, locale)}
            />

            <section className="py-10 md:py-16">
                <Container>
                    {/* Breadcrumb */}
                    <div className="mb-8">
                        <Link
                            href={route('marketplace.index')}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </div>
                            {__('Back to Marketplace')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        {/* Image Gallery */}
                        <div className="lg:sticky lg:top-8 space-y-3">
                            {/* Main Photo */}
                            <button
                                onClick={() => item.image_path && openLightbox(0)}
                                className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 block group ${item.image_path ? 'cursor-zoom-in' : 'cursor-default'}`}
                            >
                                {item.image_path ? (
                                    <>
                                        <img
                                            src={item.image_path}
                                            alt={item.name}
                                            className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                                            fetchPriority="high"
                                            decoding="async"
                                            width="800"
                                            height="800"
                                        />
                                        {/* Zoom hint */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-end p-4">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                                                {__('Tap to enlarge')}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-zinc-300 gap-3">
                                        <ShoppingBag className="w-16 h-16" />
                                        <span className="text-sm font-medium">{__('No image')}</span>
                                    </div>
                                )}

                                {/* Status badge */}
                                <div className="absolute top-4 left-4">
                                    <span className={`
                                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm
                                        ${item.status === 'baru' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}
                                    `}>
                                        {item.status === 'baru' ? (
                                            <><Star className="w-3.5 h-3.5 fill-white" />{__('New Item')}</>
                                        ) : (
                                            <><Clock className="w-3.5 h-3.5" />{__('Used Item')}</>
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
                                                className="relative aspect-square rounded-xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 group cursor-zoom-in transition-all bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:border-zinc-700 dark:focus:border-zinc-600"
                                            >
                                                <img
                                                    src={detail.foto_path}
                                                    alt={__('Detail photo :number', { number: (idx + 1).toString() })}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
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
                                    <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                                        {locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name)}
                                    </h1>
                                    <button
                                        onClick={handleShare}
                                        disabled={shareGenerating}
                                        className="shrink-0 w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-50"
                                        title={shareGenerating ? __('Preparing...') : __('Share')}
                                    >
                                        {shareGenerating
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : <Share2 className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-2 rounded-xl">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-lg font-black">
                                            {new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            }).format(item.price ?? 0).replace('IDR', 'Rp')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Condition Card */}
                            <div className={`
                                flex items-start gap-4 p-4 rounded-2xl border
                                ${item.status === 'baru' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30' : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'}
                            `}>
                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'baru' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
                                    {item.status === 'baru'
                                        ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        : <Clock className="w-5 h-5 text-amber-600" />
                                    }
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${item.status === 'baru' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                        {__('Condition')}: {item.status === 'baru' ? __('New Item') : __('Used Item')}
                                    </p>
                                    <p className={`text-sm mt-0.5 ${item.status === 'baru' ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                                        {item.status === 'baru'
                                            ? __('Product is still new, never used.')
                                            : __('Product is used. Condition details are provided in the description.')}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">{__('Description')}</h2>
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-zinc-700 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap text-sm">
                                        {locale === 'en' ? (item.description_en || item.description) : (item.description_id || item.description)}
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
                                        {__('Contact via WhatsApp')}
                                    </a>
                                ) : (
                                    <div className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-zinc-100 text-zinc-400 font-bold rounded-2xl text-base cursor-default">
                                        <MessageCircle className="w-5 h-5" />
                                        {__('Contact not available')}
                                    </div>
                                )}
                                <Link
                                    href={route('marketplace.index')}
                                    className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-2xl transition-colors text-base border border-zinc-200 dark:border-zinc-800"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {__('See other items')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Lightbox Modal ── */}
            {lightboxIndex !== null && allPhotos.length > 0 && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.92)' }}
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
                        aria-label={__("Close")}
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
                            aria-label={__("Prev")}
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
                            aria-label={__("Next")}
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
                                    <img src={photo} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>

            {/* Share Modal (desktop fallback) */}
            {showShareModal && (
                <ShareItemModal
                    item={item}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </AppLayout>
    );
}
