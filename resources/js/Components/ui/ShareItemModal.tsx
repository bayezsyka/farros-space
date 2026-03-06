/**
 * ShareItemModal — Public marketplace item share modal.
 *
 * Generates a 1:1 poster image using the SAME canvas drawing logic as the
 * admin's CollageGenerator (render1Item / single-item layout), so both are
 * always visually consistent.
 *
 * Also produces a ready-to-paste text caption with: name, price, status,
 * description (if any), and the direct link to the item.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Download, Copy, Check, Loader2, Share2 } from 'lucide-react';
import { generateShareBlob, buildShareCaption, formatPrice, ShareableItem } from './shareHelpers';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ShareItem = ShareableItem;

interface ShareItemModalProps {
    item: ShareItem;
    onClose: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ShareItemModal({ item, onClose }: ShareItemModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [generating, setGenerating] = useState(true);
    const [generated, setGenerated] = useState(false);
    const [copied, setCopied] = useState(false);

    const waNumber = item.whatsapp?.replace(/\D/g, '') ?? '';
    const caption = buildShareCaption(item);

    // Lock body scroll
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.setProperty('overflow', 'hidden', 'important');
        return () => { document.body.style.overflow = prev; };
    }, []);

    // ESC to close
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    // Generate poster on mount
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let cancelled = false;
        setGenerating(true); setGenerated(false);

        (async () => {
            const blob = await generateShareBlob(item);
            if (cancelled || !canvas) return;

            // Draw from blob onto canvas for preview
            if (blob) {
                const bmpUrl = URL.createObjectURL(blob);
                const bmp = await new Promise<HTMLImageElement | null>(resolve => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = bmpUrl;
                });
                if (!cancelled && bmp) {
                    canvas.width = bmp.naturalWidth || 1080;
                    canvas.height = bmp.naturalHeight || 1080;
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.drawImage(bmp, 0, 0);
                    URL.revokeObjectURL(bmpUrl);
                }
            }

            if (!cancelled) { setGenerating(false); setGenerated(true); }
        })();

        return () => { cancelled = true; };
    }, [item]);


    // Download
    const handleDownload = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const filename = `${item.slug}-share.png`;
        const click = (href: string) => {
            const a = document.createElement('a');
            a.download = filename; a.href = href;
            document.body.appendChild(a); a.click(); a.remove();
        };
        try {
            const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/png'));
            if (!blob) throw new Error();
            const url = URL.createObjectURL(blob); click(url); URL.revokeObjectURL(url);
        } catch {
            click(canvas.toDataURL('image/png'));
        }
    }, [item.slug]);

    // Copy caption
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    }, [caption]);

    // Native share (mobile)
    const handleNativeShare = useCallback(async () => {
        if (!navigator.share) return;
        try {
            await navigator.share({
                title: item.name,
                text: caption,
                url: `https://farros.space/marketplace/${item.slug}`,
            });
        } catch { /* dismissed */ }
    }, [item, caption]);

    const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="dialog" aria-modal="true" aria-label="Share item"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-zinc-100 max-h-[92vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900">Bagikan Item</h2>
                            <p className="text-xs text-zinc-400 mt-0.5">Poster 1:1 · 1080×1080px</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                        aria-label="Tutup"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                    {/* Poster Preview */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 shadow-lg border border-zinc-200">
                        <canvas ref={canvasRef} className="w-full h-full block" />
                        {generating && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                                <p className="text-xs font-semibold text-zinc-500">Membuat poster...</p>
                            </div>
                        )}
                    </div>
                    <p className="text-[11px] text-zinc-400 text-center">Preview · Output 1080×1080px</p>

                    {/* Caption */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Caption</p>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${copied
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                                    }`}
                            >
                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Tersalin!' : 'Salin'}
                            </button>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                            <pre className="text-sm text-zinc-700 font-sans whitespace-pre-wrap leading-relaxed">
                                {caption}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 px-5 py-4 border-t border-zinc-100 bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                        Tutup
                    </button>

                    <div className="flex-1 flex gap-2 justify-end">
                        {canNativeShare && (
                            <button
                                onClick={handleNativeShare}
                                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        )}
                        <button
                            onClick={handleDownload}
                            disabled={!generated || generating}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download Foto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
