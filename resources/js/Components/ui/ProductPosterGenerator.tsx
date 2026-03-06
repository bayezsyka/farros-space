import { useCallback, useEffect, useRef, useState } from 'react';
import {
    X, Download, RefreshCw, Loader2, FileImage,
    MapPin, Phone, CheckSquare2, Upload, Star, Clock,
} from 'lucide-react';

// ─── Resolution presets ───────────────────────────────────────────────────────

type Resolution = '3:4' | '1:1';

// '3:4' → portrait stacked (3 detail photos, all 1:1 squares)
// '1:1' → 2-column grid: left=main, right=2 detail stacked, bottom=info bar
type Layout = 'portrait' | 'grid2col';

interface RenderConfig {
    W: number; H: number; PAD: number; GAP: number; INFO_H: number;
    layout: Layout;
    R: number;
    nameFs: number; priceFs: number; chipFs: number; chipH: number;
    metaFs: number; QR_SIZE: number;
    detailCount: number; // how many detail photos this layout needs
}

const CONFIGS: Record<Resolution, RenderConfig> = {
    // Portrait: 3 detail photos, all 1:1 cells
    '3:4': {
        W: 900, H: 1380, PAD: 20, GAP: 8, INFO_H: 185,
        layout: 'portrait', R: 14, detailCount: 3,
        nameFs: 42, priceFs: 36, chipFs: 14, chipH: 28, metaFs: 19, QR_SIZE: 160,
    },
    // Square: 2-col grid — left: main, right: 2 details stacked, bottom: info
    '1:1': {
        W: 1080, H: 1080, PAD: 16, GAP: 10, INFO_H: 270,
        layout: 'grid2col', R: 14, detailCount: 2,
        nameFs: 38, priceFs: 32, chipFs: 13, chipH: 26, metaFs: 18, QR_SIZE: 220,
    },
};

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// ─── Types ────────────────────────────────────────────────────────────────────
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
    price: number | string | null;
    whatsapp: string | null;
    foto_detail_items?: FotoDetailItem[];
}

interface ProductPosterGeneratorProps {
    item: MarketplaceItem;
    onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number | string | null): string {
    if (!price && price !== 0) return 'Hubungi kami';
    const n = Number(price);
    if (!Number.isNaN(n)) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
        }).format(n).replace('IDR', 'Rp').trim();
    }
    return String(price);
}

async function loadImage(src: string, ms = 14000): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image();
        let done = false;
        const finish = (r: HTMLImageElement | null) => {
            if (done) return; done = true; img.onload = img.onerror = null; resolve(r);
        };
        const t = window.setTimeout(() => finish(null), ms);
        img.onload = () => { window.clearTimeout(t); finish(img); };
        img.onerror = () => { window.clearTimeout(t); finish(null); };
        if (!src.startsWith('data:') && !src.startsWith('blob:')) img.crossOrigin = 'anonymous';
        img.src = src.startsWith('/') ? new URL(src, window.location.origin).toString() : src;
    });
}

function drawCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number,
) {
    const sw = img.naturalWidth || img.width;
    const sh = img.naturalHeight || img.height;
    if (!sw || !sh || dw <= 0 || dh <= 0) return;
    const srcAR = sw / sh, dstAR = dw / dh;
    let sx = 0, sy = 0, sW = sw, sH = sh;
    if (srcAR > dstAR) { sW = Math.round(sh * dstAR); sx = Math.round((sw - sW) / 2); }
    else { sH = Math.round(sw / dstAR); sy = Math.round((sh - sH) / 2); }
    ctx.drawImage(img, sx, sy, sW, sH, dx, dy, dw, dh);
}

function clipRR(
    ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number,
) {
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(x, y, w, h, r);
    } else {
        r = Math.min(r, w / 2, h / 2);
        ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}

function trunc(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
    if (!text || maxW <= 0) return '';
    if (ctx.measureText(text).width <= maxW) return text;
    const ellW = ctx.measureText('…').width;
    if (ellW > maxW) return '';
    let lo = 0, hi = text.length;
    while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        ctx.measureText(text.slice(0, mid)).width + ellW <= maxW ? (lo = mid) : (hi = mid - 1);
    }
    return text.slice(0, lo) + '…';
}

async function fetchQR(text: string, size: number): Promise<HTMLImageElement | null> {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=1&color=18181b&bgcolor=ffffff`;
    return loadImage(url);
}

// ─── Shared: draw info bar ─────────────────────────────────────────────────────

async function drawInfoBar(
    ctx: CanvasRenderingContext2D,
    item: MarketplaceItem,
    location: string,
    cfg: RenderConfig,
    INFO_X: number, INFO_Y: number, INFO_W: number, INFO_H: number,
) {
    const { nameFs, priceFs, chipFs, chipH, metaFs, QR_SIZE } = cfg;
    const isBaru = item.status === 'baru';

    // QR on the right
    const qrImg = await fetchQR(`https://farros.space/marketplace/${item.slug}`, QR_SIZE);
    const QR_X = INFO_X + INFO_W - QR_SIZE;
    const QR_Y = INFO_Y + Math.round((INFO_H - QR_SIZE - 20) / 2);

    if (qrImg) {
        ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = '#E4E4E7'; ctx.lineWidth = 1;
        clipRR(ctx, QR_X - 6, QR_Y - 6, QR_SIZE + 12, QR_SIZE + 12, 10);
        ctx.fill(); ctx.stroke();
        ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
        ctx.fillStyle = '#B0B0B8';
        ctx.font = `600 12px ${FONT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('Scan untuk detail', QR_X + QR_SIZE / 2, QR_Y + QR_SIZE + 8);
    }

    // Text column left of QR
    const TX = INFO_X;
    const TW = INFO_W - QR_SIZE - 32;

    // Pre-measure name lines for vertical centering
    ctx.font = `800 ${nameFs}px ${FONT}`;
    const nameWords = (item.name || '—').split(' ');
    let nameLine = '';
    const nameLines: string[] = [];
    for (const w of nameWords) {
        const test = nameLine ? `${nameLine} ${w}` : w;
        if (ctx.measureText(test).width > TW && nameLine) {
            nameLines.push(nameLine); nameLine = w;
            if (nameLines.length >= 2) break;
        } else { nameLine = test; }
    }
    if (nameLines.length < 2 && nameLine) nameLines.push(nameLine);
    const actualLines = nameLines.slice(0, 2);

    const totalTextH = (actualLines.length * (nameFs - 2)) + 10 + chipH + 18 + metaFs;
    let iy = INFO_Y + Math.round((INFO_H - totalTextH - 12) / 2);

    // Name
    ctx.fillStyle = '#18181B';
    ctx.font = `800 ${nameFs}px ${FONT}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    actualLines.forEach((l) => {
        ctx.fillText(trunc(ctx, l, TW), TX, iy);
        iy += nameFs - 2;
    });
    iy += 10;

    // Status chip + Price
    ctx.font = `700 ${chipFs}px ${FONT}`;
    const chipTxt = isBaru ? 'Barang Baru' : 'Barang Bekas';
    const chipW = ctx.measureText(chipTxt).width + 24;

    ctx.strokeStyle = '#18181B'; ctx.lineWidth = 1.5;
    clipRR(ctx, TX, iy, chipW, chipH, 6); ctx.stroke();
    ctx.fillStyle = '#18181B';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(chipTxt, TX + chipW / 2, iy + chipH / 2);

    ctx.fillStyle = '#18181B';
    ctx.font = `900 ${priceFs}px ${FONT}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(trunc(ctx, formatPrice(item.price), TW - chipW - 24), TX + chipW + 20, iy + chipH / 2);
    iy += chipH + 18;

    // WA + Lokasi
    const wa = item.whatsapp || 'Hubungi kami';
    ctx.textBaseline = 'top'; ctx.textAlign = 'left';

    ctx.fillStyle = '#71717A'; ctx.font = `600 ${metaFs}px ${FONT}`;
    ctx.fillText('WA', TX, iy);
    const waLW = ctx.measureText('WA').width + 12;
    ctx.fillStyle = '#18181B'; ctx.font = `700 ${metaFs}px ${FONT}`;
    const waMaxW = location ? TW * 0.48 - waLW : TW - waLW;
    ctx.fillText(trunc(ctx, wa, waMaxW), TX + waLW, iy);

    if (location) {
        const sepX = TX + TW * 0.52;
        ctx.fillStyle = '#D4D4D8'; ctx.font = `400 ${metaFs}px ${FONT}`;
        ctx.fillText('|', sepX, iy);
        const locX = sepX + ctx.measureText('| ').width;
        ctx.fillStyle = '#71717A'; ctx.font = `600 ${metaFs}px ${FONT}`;
        ctx.fillText('Lok', locX, iy);
        const locLW = ctx.measureText('Lok').width + 10;
        ctx.fillStyle = '#18181B'; ctx.font = `700 ${metaFs}px ${FONT}`;
        ctx.fillText(trunc(ctx, location, TW - (locX - TX) - locLW), locX + locLW, iy);
    }

    // Branding
    ctx.fillStyle = '#C4C4C8'; ctx.font = `400 10px ${FONT}`;
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText('farros.space', INFO_X + INFO_W, INFO_Y + INFO_H - 6);
}

// ─── Poster: portrait (3:4) ───────────────────────────────────────────────────

async function renderPortrait(
    ctx: CanvasRenderingContext2D,
    item: MarketplaceItem,
    mainImg: HTMLImageElement | null,
    detailImgs: (HTMLImageElement | null)[],
    location: string,
    cfg: RenderConfig,
) {
    const { W, H, PAD, GAP, INFO_H, R } = cfg;
    const INNER_W = W - PAD * 2;

    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);

    // All photo cells are 1:1 squares
    const CW = Math.floor((INNER_W - GAP * 2) / 3);
    const MAIN_H = INNER_W; // square main
    const DETAIL_H = CW;    // square details

    const MAIN_Y = PAD;
    const DETAIL_Y = MAIN_Y + MAIN_H + GAP;
    const DIV_Y = DETAIL_Y + DETAIL_H + PAD;
    const INFO_Y = DIV_Y + 1;

    // Main photo (full width square)
    ctx.save();
    clipRR(ctx, PAD, MAIN_Y, INNER_W, MAIN_H, R); ctx.clip();
    if (mainImg) {
        drawCover(ctx, mainImg, PAD, MAIN_Y, INNER_W, MAIN_H);
    } else {
        ctx.fillStyle = '#F4F4F5'; ctx.fillRect(PAD, MAIN_Y, INNER_W, MAIN_H);
        ctx.fillStyle = '#B0B0B8'; ctx.font = `500 ${Math.round(MAIN_H * 0.065)}px ${FONT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('[ Foto Utama ]', PAD + INNER_W / 2, MAIN_Y + MAIN_H / 2);
    }
    ctx.restore();

    // Status badge
    const isBaru = item.status === 'baru';
    ctx.fillStyle = 'rgba(0,0,0,0.58)';
    clipRR(ctx, PAD + 14, MAIN_Y + 14, 78, 30, 8); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.font = `700 13px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(isBaru ? 'BARU' : 'BEKAS', PAD + 14 + 39, MAIN_Y + 14 + 15);

    // 3 detail squares, evenly spaced
    const xStep = (INNER_W - CW) / 2;
    for (let i = 0; i < 3; i++) {
        const dx = PAD + Math.round(i * xStep);
        ctx.save();
        clipRR(ctx, dx, DETAIL_Y, CW, DETAIL_H, R * 0.6); ctx.clip();
        if (detailImgs[i]) {
            drawCover(ctx, detailImgs[i]!, dx, DETAIL_Y, CW, DETAIL_H);
        } else {
            ctx.fillStyle = '#F4F4F5'; ctx.fillRect(dx, DETAIL_Y, CW, DETAIL_H);
            ctx.fillStyle = '#B0B0B8'; ctx.font = `500 ${Math.round(DETAIL_H * 0.18)}px ${FONT}`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`Foto ${i + 1}`, dx + CW / 2, DETAIL_Y + DETAIL_H / 2);
        }
        ctx.restore();
        ctx.strokeStyle = '#E4E4E7'; ctx.lineWidth = 1;
        clipRR(ctx, dx, DETAIL_Y, CW, DETAIL_H, R * 0.6); ctx.stroke();
    }

    // Divider
    ctx.fillStyle = '#E4E4E7'; ctx.fillRect(PAD, DIV_Y, INNER_W, 1);

    // Info bar
    await drawInfoBar(ctx, item, location, cfg, PAD, INFO_Y, INNER_W, INFO_H);
}

// ─── Poster: 2-column grid (1:1) ─────────────────────────────────────────────

async function renderGrid2Col(
    ctx: CanvasRenderingContext2D,
    item: MarketplaceItem,
    mainImg: HTMLImageElement | null,
    detailImgs: (HTMLImageElement | null)[],
    location: string,
    cfg: RenderConfig,
) {
    const { W, H, PAD, GAP, INFO_H, R } = cfg;
    const INNER_W = W - PAD * 2;

    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);

    // ─── Square Math for 2-column Grid ─────────────────────────────────────
    // To make all 1:1, the width is split into 3 units (2 units for left, 1 for right)
    // plus gaps. INNER_W = (2*S + GAP) + GAP + S  =>  INNER_W = 3*S + 2*GAP
    const S = Math.floor((INNER_W - 2 * GAP) / 3);
    const LEFT_SIZE = 2 * S + GAP; // Large square size
    const RIGHT_SIZE = S;          // Small square size

    const LEFT_X = PAD;
    const RIGHT_X = PAD + LEFT_SIZE + GAP;
    const PHOTO_Y = PAD;

    // Total height of the photo section is same as LEFT_SIZE to keep it square
    const PHOTO_AREA_H = LEFT_SIZE;

    const DIV_Y = PHOTO_Y + PHOTO_AREA_H + GAP + 6; // small extra space before divider
    const INFO_Y = DIV_Y + 1;

    // ─── 1. Main photo (Left Column - Large Square 1:1) ──────────────────────
    ctx.save();
    clipRR(ctx, LEFT_X, PHOTO_Y, LEFT_SIZE, LEFT_SIZE, R); ctx.clip();
    if (mainImg) {
        drawCover(ctx, mainImg, LEFT_X, PHOTO_Y, LEFT_SIZE, LEFT_SIZE);
    } else {
        ctx.fillStyle = '#F4F4F5'; ctx.fillRect(LEFT_X, PHOTO_Y, LEFT_SIZE, LEFT_SIZE);
        ctx.fillStyle = '#B0B0B8'; ctx.font = `500 ${Math.round(LEFT_SIZE * 0.1)}px ${FONT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('[ Utama ]', LEFT_X + LEFT_SIZE / 2, PHOTO_Y + LEFT_SIZE / 2);
    }
    ctx.restore();

    // Status badge
    const isBaru = item.status === 'baru';
    ctx.fillStyle = 'rgba(0,0,0,0.58)';
    clipRR(ctx, LEFT_X + 14, PHOTO_Y + 14, 78, 30, 8); ctx.fill();
    ctx.fillStyle = '#FFF'; ctx.font = `700 13px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(isBaru ? 'BARU' : 'BEKAS', LEFT_X + 14 + 39, PHOTO_Y + 14 + 15);

    // ─── 2 & 3. Two detail photos (Right Column - Small Squares 1:1) ─────────
    for (let i = 0; i < 2; i++) {
        const dy = PHOTO_Y + i * (RIGHT_SIZE + GAP);
        ctx.save();
        clipRR(ctx, RIGHT_X, dy, RIGHT_SIZE, RIGHT_SIZE, R * 0.7); ctx.clip();
        if (detailImgs[i]) {
            drawCover(ctx, detailImgs[i]!, RIGHT_X, dy, RIGHT_SIZE, RIGHT_SIZE);
        } else {
            ctx.fillStyle = '#F4F4F5'; ctx.fillRect(RIGHT_X, dy, RIGHT_SIZE, RIGHT_SIZE);
            ctx.fillStyle = '#B0B0B8'; ctx.font = `500 ${Math.round(RIGHT_SIZE * 0.2)}px ${FONT}`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(`${i + 2}`, RIGHT_X + RIGHT_SIZE / 2, dy + RIGHT_SIZE / 2);
        }
        ctx.restore();
        ctx.strokeStyle = '#E4E4E7'; ctx.lineWidth = 1;
        clipRR(ctx, RIGHT_X, dy, RIGHT_SIZE, RIGHT_SIZE, R * 0.7); ctx.stroke();
    }

    // ─── Divider ─────────────────────────────────────────────────────────────
    ctx.fillStyle = '#E4E4E7'; ctx.fillRect(PAD, DIV_Y, INNER_W, 1);

    // ─── 4. Info bar (Centering text in the remaining space) ──────────────────
    // The available height for info might be slightly larger now
    const actualInfoH = H - INFO_Y - PAD;
    await drawInfoBar(ctx, item, location, cfg, PAD, INFO_Y, INNER_W, actualInfoH);
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

async function renderPoster(
    ctx: CanvasRenderingContext2D,
    item: MarketplaceItem,
    mainImg: HTMLImageElement | null,
    detailImgs: (HTMLImageElement | null)[],
    location: string,
    cfg: RenderConfig,
) {
    if (cfg.layout === 'grid2col') {
        return renderGrid2Col(ctx, item, mainImg, detailImgs, location, cfg);
    }
    return renderPortrait(ctx, item, mainImg, detailImgs, location, cfg);
}

// ─── Photo Picker ─────────────────────────────────────────────────────────────

interface PhotoPickerProps {
    index: number;
    existingPhotos: { id: number; foto_path: string }[];
    selectedSrc: string | null;
    onSelect: (src: string) => void;
    onLocalFile: (src: string) => void;
}

function PhotoPicker({ index, existingPhotos, selectedSrc, onSelect, onLocalFile }: PhotoPickerProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onLocalFile(URL.createObjectURL(file));
        e.target.value = '';
    };

    return (
        <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Foto {index + 1}
                {selectedSrc && <span className="ml-1.5 text-emerald-500 normal-case">✓</span>}
            </p>
            <div className="flex flex-wrap gap-1.5">
                {existingPhotos.map((photo) => {
                    const active = selectedSrc === photo.foto_path;
                    return (
                        <button
                            key={photo.id} type="button"
                            onClick={() => onSelect(active ? '' : photo.foto_path)}
                            className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${active
                                ? 'border-zinc-900 shadow-md'
                                : 'border-zinc-200 hover:border-zinc-400 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img src={photo.foto_path} alt="" className="w-full h-full object-cover" />
                            {active && (
                                <div className="absolute inset-0 bg-zinc-900/20 flex items-center justify-center">
                                    <CheckSquare2 className="w-3.5 h-3.5 text-white drop-shadow" />
                                </div>
                            )}
                        </button>
                    );
                })}
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-12 h-12 rounded-lg border-2 border-dashed border-zinc-200 hover:border-zinc-400 flex items-center justify-center transition-all text-zinc-400 hover:text-zinc-700 shrink-0"
                    title="Upload dari perangkat"
                >
                    <Upload className="w-3.5 h-3.5" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProductPosterGenerator({ item, onClose }: ProductPosterGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const genIdRef = useRef(0);
    const mountedRef = useRef(false);

    const existingPhotos = item.foto_detail_items ?? [];
    const [resolution, setResolution] = useState<Resolution>('3:4');
    const cfg = CONFIGS[resolution];

    // detail srcs: always length 3, but only cfg.detailCount slots are used
    const [detailSrcs, setDetailSrcs] = useState<[string, string, string]>(() => {
        const srcs = existingPhotos.slice(0, 3).map(p => p.foto_path);
        return [srcs[0] ?? '', srcs[1] ?? '', srcs[2] ?? ''] as [string, string, string];
    });
    const [location, setLocation] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        const orig = window.getComputedStyle(document.body).overflow;
        document.body.style.setProperty('overflow', 'hidden', 'important');
        return () => { mountedRef.current = false; document.body.style.overflow = orig; };
    }, []);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    const setDetail = (index: 0 | 1 | 2, src: string) => {
        setDetailSrcs(prev => {
            const next = [...prev] as [string, string, string];
            next[index] = src;
            return next;
        });
    };

    const generate = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const myGen = ++genIdRef.current;
        setGenerating(true); setGenerated(false); setDownloadError(null);
        await new Promise<void>(r => requestAnimationFrame(() => r()));
        if (!mountedRef.current || genIdRef.current !== myGen) return;

        canvas.width = cfg.W;
        canvas.height = cfg.H;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setGenerating(false); return; }
        ctx.imageSmoothingEnabled = true;
        try { (ctx as any).imageSmoothingQuality = 'high'; } catch { }

        try {
            const mainSrc = item.image_path
                ? (item.image_path.startsWith('/') ? new URL(item.image_path, window.location.origin).toString() : item.image_path)
                : null;
            const [mainImg, d0, d1, d2] = await Promise.all([
                mainSrc ? loadImage(mainSrc) : Promise.resolve(null),
                detailSrcs[0] ? loadImage(detailSrcs[0]) : Promise.resolve(null),
                detailSrcs[1] ? loadImage(detailSrcs[1]) : Promise.resolve(null),
                detailSrcs[2] ? loadImage(detailSrcs[2]) : Promise.resolve(null),
            ]);
            if (!mountedRef.current || genIdRef.current !== myGen) return;
            await renderPoster(ctx, item, mainImg, [d0, d1, d2], location, cfg);
            if (mountedRef.current && genIdRef.current === myGen) {
                setGenerating(false); setGenerated(true);
            }
        } catch (err) {
            console.error('[ProductPoster]', err);
            if (mountedRef.current && genIdRef.current === myGen) setGenerating(false);
        }
    }, [item, detailSrcs, location, cfg]);

    useEffect(() => {
        const t = window.setTimeout(() => generate(), 200);
        return () => window.clearTimeout(t);
    }, [generate]);

    const handleDownload = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setDownloadError(null);
        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const safeName = item.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30);
        const filename = `poster-${safeName}-${resolution.replace(':', 'x')}-${stamp}.png`;
        const click = (href: string) => {
            const a = document.createElement('a');
            a.download = filename; a.href = href;
            document.body.appendChild(a); a.click(); a.remove();
        };
        try {
            const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/png'));
            if (!blob) throw new Error('blob null');
            const url = URL.createObjectURL(blob); click(url); URL.revokeObjectURL(url);
        } catch {
            try { click(canvas.toDataURL('image/png')); }
            catch { setDownloadError('Download gagal.'); }
        }
    }, [item.name, resolution]);

    // Preview scale
    const PREVIEW_W = 340;
    const previewW = PREVIEW_W;
    const previewH = Math.round(cfg.H * (PREVIEW_W / cfg.W));
    const isBaru = item.status === 'baru';

    // How many photo pickers to show for current layout
    const detailIndices = Array.from({ length: cfg.detailCount }, (_, i) => i) as (0 | 1 | 2)[];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 touch-none"
            role="dialog" aria-modal="true" aria-label="Generator Poster Produk"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden border border-zinc-200">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center">
                            <FileImage className="w-3.5 h-3.5 text-zinc-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-zinc-900">Generate Poster</h2>
                            <p className="text-[11px] text-zinc-400 truncate max-w-[240px]">
                                {item.name} · {cfg.W}×{cfg.H}px ({resolution})
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose} type="button" aria-label="Tutup"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden min-h-0">

                    {/* ── Sidebar ──────────────────────────────────── */}
                    <div className="w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-zinc-100 p-4 space-y-4 md:overflow-y-auto">

                        {/* Item summary */}
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
                            {item.image_path ? (
                                <img src={item.image_path} alt={item.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0">
                                    <FileImage className="w-4 h-4 text-zinc-400" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {isBaru
                                        ? <><Star className="w-3 h-3 text-zinc-500" /><span className="text-[11px] text-zinc-500">Baru</span></>
                                        : <><Clock className="w-3 h-3 text-zinc-500" /><span className="text-[11px] text-zinc-500">Bekas</span></>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Resolution toggle */}
                        <div>
                            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Resolusi</p>
                            <div className="flex gap-2">
                                {(['3:4', '1:1'] as Resolution[]).map(res => (
                                    <button
                                        key={res} type="button"
                                        onClick={() => setResolution(res)}
                                        className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${resolution === res
                                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'
                                            }`}
                                    >
                                        {res}
                                        <span className="block text-[9px] font-medium opacity-70 mt-0.5">
                                            {res === '3:4' ? '900×1380' : '1080×1080'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {/* Layout hint */}
                            <p className="text-[10px] text-zinc-400 mt-1.5 leading-snug">
                                {cfg.layout === 'grid2col'
                                    ? '2 kolom: foto utama kiri, 2 detail kanan'
                                    : '3 foto detail berjejer di bawah'}
                            </p>
                        </div>

                        {/* Photo pickers — only show detailCount slots */}
                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                                {cfg.detailCount} Foto Detail
                            </p>
                            {detailIndices.map(i => (
                                <PhotoPicker
                                    key={i}
                                    index={i}
                                    existingPhotos={existingPhotos}
                                    selectedSrc={detailSrcs[i] || null}
                                    onSelect={(src) => setDetail(i, src)}
                                    onLocalFile={(src) => setDetail(i, src)}
                                />
                            ))}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                                <MapPin className="w-3 h-3" /> Lokasi
                            </label>
                            <input
                                type="text" value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="cth: Bandung, Jabar"
                                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-300 text-zinc-800 placeholder-zinc-400 transition-all"
                            />
                        </div>

                        {/* WA info */}
                        {item.whatsapp && (
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-zinc-50 border border-zinc-100">
                                <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                                <p className="text-xs text-zinc-600 truncate">{item.whatsapp}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Canvas Preview ───────────────────────────── */}
                    <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 p-5 md:overflow-auto">
                        <div
                            className="relative rounded-xl overflow-hidden shadow-md border border-zinc-200 shrink-0 bg-white"
                            style={{ width: previewW, height: previewH }}
                        >
                            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                            {generating && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                                        <p className="text-xs text-zinc-400">Membuat poster...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-2">
                            Preview · {cfg.W}×{cfg.H}px ({resolution})
                        </p>
                        {downloadError && (
                            <p className="mt-1 text-xs text-red-500 text-center max-w-xs">{downloadError}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-zinc-100 shrink-0">
                    <button
                        type="button" onClick={generate} disabled={generating}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-40"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                        Render Ulang
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="button" onClick={handleDownload} disabled={!generated || generating}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors disabled:opacity-40"
                        >
                            <Download className="w-3.5 h-3.5" /> Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
