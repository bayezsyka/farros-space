/**
 * shareHelpers.ts
 *
 * Shared utilities used by both ShareItemModal and the inline share handler
 * in Show.tsx. Drawing logic is pixel-perfect identical to CollageGenerator's
 * render1Item (single-item, 1:1 square layout).
 */

const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';
const CANVAS_SIZE = 1080;

// ── Formatting ─────────────────────────────────────────────────────────────────

export function formatPrice(price: number | null): string {
    if (price === null) return 'Hubungi kami';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp').trim();
}

export interface ShareableItem {
    name: string;
    slug: string;
    image_path: string | null;
    status: 'baru' | 'bekas';
    description: string | null;
    price: number | null;
    whatsapp: string | null;
}

/** Full caption with link — used for text-only share (no file) */
export function buildShareCaption(item: ShareableItem): string {
    const lines: string[] = [];
    lines.push(`*${item.name}*`);
    lines.push(`Status: ${item.status === 'baru' ? '✨ Barang Baru' : '🔄 Barang Bekas'}`);
    lines.push(`Harga: ${formatPrice(item.price)}`);
    if (item.description?.trim()) {
        lines.push('');
        lines.push(item.description.trim());
    }
    lines.push('');
    lines.push(`🔗 https://farros.space/marketplace/${item.slug}`);
    return lines.join('\n');
}

/**
 * Short caption for photo share (no URL — QR code on the image already has it).
 * Goes into WhatsApp's "Add a message..." / caption field alongside the photo.
 */
export function buildImageCaption(item: ShareableItem): string {
    const lines: string[] = [];
    lines.push(`*${item.name}*`);
    lines.push(`${item.status === 'baru' ? '✨ Barang Baru' : '🔄 Barang Bekas'} · ${formatPrice(item.price)}`);
    if (item.description?.trim()) {
        lines.push('');
        lines.push(item.description.trim());
    }
    return lines.join('\n');
}

// ── Canvas helpers (mirror of CollageGenerator) ────────────────────────────────

async function loadImg(src: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image();
        let done = false;
        const finish = (r: HTMLImageElement | null) => { if (done) return; done = true; resolve(r); };
        const t = window.setTimeout(() => finish(null), 12000);
        img.onload = () => { window.clearTimeout(t); finish(img); };
        img.onerror = () => { window.clearTimeout(t); finish(null); };
        if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
        try { img.src = new URL(src, window.location.origin).toString(); } catch { img.src = src; }
    });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number) {
    const sw = img.naturalWidth || img.width;
    const sh = img.naturalHeight || img.height;
    if (!sw || !sh || dw <= 0 || dh <= 0) return;
    const srcAR = sw / sh, dstAR = dw / dh;
    let sx = 0, sy = 0, sW = sw, sH = sh;
    if (srcAR > dstAR) { sW = Math.round(sh * dstAR); sx = Math.round((sw - sW) / 2); }
    else { sH = Math.round(sw / dstAR); sy = Math.round((sh - sH) / 2); }
    ctx.drawImage(img, sx, sy, sW, sH, dx, dy, dw, dh);
}

function trunc(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
    if (maxW <= 0 || !text) return '';
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

async function fetchQR(url: string, size: number): Promise<HTMLImageElement | null> {
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=1`;
    return loadImg(api);
}

/** Identical to CollageGenerator render1Item */
async function drawPoster(ctx: CanvasRenderingContext2D, W: number, H: number, item: ShareableItem, photoImg: HTMLImageElement | null) {
    const pad = Math.round(Math.min(W, H) * 0.05);
    const waNumber = item.whatsapp?.replace(/\D/g, '') ?? '';

    // 1. Photo background
    if (photoImg) {
        drawCover(ctx, photoImg, 0, 0, W, H);
    } else {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, '#E4E4E7'); g.addColorStop(1, '#D4D4D8');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#A1A1AA';
        ctx.font = `700 ${Math.round(W * 0.2)}px ${FONT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📦', W / 2, H / 2);
    }

    // 2. Status badge (top-left)
    const badgeW = Math.max(60, Math.round(W * 0.1));
    const badgeH = Math.max(24, Math.round(badgeW * 0.4));
    ctx.fillStyle = item.status === 'baru' ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(pad, pad, badgeW, badgeH, 8); ctx.fill();
    } else { ctx.fillRect(pad, pad, badgeW, badgeH); }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(10, Math.round(badgeH * 0.5))}px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.status === 'baru' ? 'BARU' : 'BEKAS', pad + badgeW / 2, pad + badgeH / 2);

    // 3. Bottom dark vignette
    const overlayH = Math.max(Math.round(H * 0.35), 300);
    const grad = ctx.createLinearGradient(0, H - overlayH, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.3, 'rgba(0,0,0,0.5)');
    grad.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = grad; ctx.fillRect(0, H - overlayH, W, overlayH);

    // 4. QR code (bottom-right)
    const qrSize = Math.min(Math.round(W * 0.18), 180);
    const textSz = Math.max(10, Math.round(qrSize * 0.1));
    const lineH = textSz + 6;
    const panelW = qrSize + 24;
    const panelX = W - pad - panelW;
    const centerX = panelX + panelW / 2;
    let contentH = qrSize + 8;
    if (waNumber) contentH += lineH;
    const panelY = H - pad - contentH;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(centerX - qrSize / 2 - 4, panelY - 4, qrSize + 8, qrSize + 8, 8); ctx.fill();
    } else { ctx.fillRect(centerX - qrSize / 2 - 4, panelY - 4, qrSize + 8, qrSize + 8); }

    const itemUrl = `https://farros.space/marketplace/${item.slug}`;
    const qrImg = await fetchQR(itemUrl, qrSize);
    if (qrImg) ctx.drawImage(qrImg, centerX - qrSize / 2, panelY, qrSize, qrSize);

    let nextY = panelY + qrSize + 10;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (waNumber) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `800 ${textSz}px ${FONT}`;
        ctx.fillText(`WA: ${waNumber}`, centerX, nextY);
    }

    // 5. Name + price (bottom-left)
    const nameSz = Math.max(24, Math.round(Math.min(W, H) * 0.055));
    const priceSz = Math.max(20, Math.round(nameSz * 0.8));
    const infoMaxW = panelX - pad * 2;
    const priceY = H - pad - priceSz;
    const nameY = priceY - nameSz - Math.round(H * 0.01);

    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${nameSz}px ${FONT}`;
    ctx.fillText(trunc(ctx, item.name, infoMaxW), pad, nameY);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `700 ${priceSz}px ${FONT}`;
    ctx.fillText(trunc(ctx, formatPrice(item.price), infoMaxW), pad, priceY);
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Generate a 1080×1080 poster as a Blob.
 * Returns null if canvas is not available (SSR) or generation fails.
 */
export async function generateShareBlob(item: ShareableItem): Promise<Blob | null> {
    if (typeof document === 'undefined') return null;
    try {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_SIZE; canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.imageSmoothingEnabled = true;
        try { (ctx as any).imageSmoothingQuality = 'high'; } catch { /* noop */ }

        const photoImg = item.image_path ? await loadImg(item.image_path) : null;
        await drawPoster(ctx, CANVAS_SIZE, CANVAS_SIZE, item, photoImg);

        return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    } catch {
        return null;
    }
}
