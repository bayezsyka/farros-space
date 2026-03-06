import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Download, RefreshCw, Loader2, Layers, MapPin } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MarketplaceItem {
    id: number; name: string; slug: string;
    image_path: string | null; image_cropped_path: string | null;
    status: 'baru' | 'bekas'; description: string; price: string | null;
}

interface CollageGeneratorProps {
    items: MarketplaceItem[];
    waNumber: string;
    onClose: () => void;
}

type ResolutionKey = '1:1' | '4:3' | '3:4' | '9:16';

interface ResolutionPreset {
    key: ResolutionKey;
    label: string;
    width: number;
    height: number;
    maxItems: number;
    hasFixedQR: boolean;         // 4:3 and 3:4 always have QR
    hasConditionalQR: boolean;   // 1:1 and 9:16 get QR when items = max-1
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const RESOLUTIONS: ResolutionPreset[] = [
    { key: '1:1', label: '1:1 Square', width: 1080, height: 1080, maxItems: 4, hasFixedQR: false, hasConditionalQR: true },
    { key: '4:3', label: '4:3 Landscape', width: 1200, height: 900, maxItems: 5, hasFixedQR: true, hasConditionalQR: false },
    { key: '3:4', label: '3:4 Portrait', width: 900, height: 1200, maxItems: 5, hasFixedQR: true, hasConditionalQR: false },
    { key: '9:16', label: '9:16 Story', width: 1080, height: 1920, maxItems: 6, hasFixedQR: false, hasConditionalQR: true },
];

const FONT_FAMILY = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';
const BG_COLOR = '#FFFFFF';

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

function formatPrice(price: string | null): string {
    if (!price) return 'Hubungi kami';
    const n = Number(price);
    if (!Number.isNaN(n))
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
            .format(n).replace('IDR', 'Rp').trim();
    return price;
}

// ─── Canvas drawing helpers ───────────────────────────────────────────────────

function resolveImageSrc(src: string): string {
    try { return new URL(src, window.location.origin).toString(); } catch { return src; }
}

async function loadImage(src: string, ms = 12000): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
        const img = new Image();
        let done = false;
        const finish = (r: HTMLImageElement | null) => { if (done) return; done = true; img.onload = null; img.onerror = null; resolve(r); };
        const t = window.setTimeout(() => finish(null), ms);
        img.onload = () => { window.clearTimeout(t); finish(img); };
        img.onerror = () => { window.clearTimeout(t); finish(null); };
        if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
        img.src = src;
    });
}

/** Cover-fit image into destination rectangle */
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

function truncate(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
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

// ─── QR Code (via API) ────────────────────────────────────────────────────────

const QR_URL = 'https://farros.space/marketplace';

async function fetchQRCode(text: string, size: number): Promise<HTMLImageElement | null> {
    const api = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&margin=1`;
    return loadImage(api);
}

async function drawQRCode(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, size: number,
) {
    const qrImg = await fetchQRCode(QR_URL, Math.round(size));
    if (qrImg) {
        ctx.drawImage(qrImg, x, y, size, size);
    } else {
        // Fallback: simplified placeholder if API fails
        ctx.fillStyle = '#F44336';
        ctx.fillRect(x, y, size, size);
    }
}

// ─── Draw photo cell with bottom overlay ──────────────────────────────────────

function drawPhotoCell(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    item: MarketplaceItem,
    x: number, y: number, w: number, h: number,
) {
    // Draw photo (cover-fit)
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    if (img) {
        drawCover(ctx, img, x, y, w, h);
    } else {
        // Placeholder gradient
        const g = ctx.createLinearGradient(x, y, x + w, y + h);
        g.addColorStop(0, '#E4E4E7');
        g.addColorStop(1, '#D4D4D8');
        ctx.fillStyle = g;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#A1A1AA';
        ctx.font = `700 ${Math.round(Math.min(w, h) * 0.2)}px ${FONT_FAMILY}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📦', x + w / 2, y + h / 2);
    }

    // Bottom shadow overlay for name + price
    const overlayH = Math.round(h * 0.28);
    const grad = ctx.createLinearGradient(x, y + h - overlayH * 1.5, x, y + h);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y + h - overlayH * 1.5, w, overlayH * 1.5);

    // Status Badge (Bottom Left)
    const badgeW = Math.max(34, Math.round(w * 0.22));
    const badgeH = Math.max(14, Math.round(badgeW * 0.35));
    const badgeX = x + Math.round(w * 0.04);
    const badgeY = y + h - overlayH - Math.round(badgeH * 0.4);

    ctx.fillStyle = item.status === 'baru' ? '#10B981' : '#F59E0B'; // emerald-500 : amber-500
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(badgeX, badgeY, badgeW, badgeH, 4);
        ctx.fill();
    } else {
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(7, Math.round(badgeH * 0.65))}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.status === 'baru' ? 'BARU' : 'BEKAS', badgeX + badgeW / 2, badgeY + badgeH / 2);

    // Name
    const pad = Math.round(w * 0.05);
    const nameFontSz = Math.max(12, Math.round(Math.min(w, h) * 0.065));
    const priceFontSz = Math.max(10, Math.round(nameFontSz * 0.85));
    const nameY = y + h - overlayH + Math.round(overlayH * 0.2);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${nameFontSz}px ${FONT_FAMILY}`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(truncate(ctx, item.name, w - pad * 2), x + pad, nameY);

    // Price
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 ${priceFontSz}px ${FONT_FAMILY}`;
    ctx.fillText(truncate(ctx, formatPrice(item.price), w - pad * 2), x + pad, nameY + nameFontSz + 4);

    ctx.restore();
}

// ─── Draw QR + Info panel ─────────────────────────────────────────────────────

async function drawQRPanel(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    address: string, waNumber: string,
) {
    // 1. Background - Premium white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, w, h);

    const padding = Math.round(Math.min(w, h) * 0.1);
    const innerW = w - padding * 2;
    const innerH = h - padding * 2;
    const centerX = x + w / 2;

    // 2. QR code - centered
    const qrSize = Math.min(innerW * 0.7, innerH * 0.55);
    const qrX = centerX - qrSize / 2;
    const qrY = y + padding + (innerH * 0.05);

    await drawQRCode(ctx, qrX, qrY, qrSize);

    // 3. Text content
    let nextY = qrY + qrSize + Math.round(innerH * 0.08);

    // Label: "Scan untuk lebih detailnya"
    const labelSz = Math.max(9, Math.round(qrSize * 0.1));
    ctx.fillStyle = '#71717A'; // Monochrome grey
    ctx.font = `600 ${labelSz}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('Scan untuk lebih detailnya', centerX, nextY);

    nextY += labelSz + Math.round(innerH * 0.05);

    // Address: "Lokasi: [address]"
    const addrSz = Math.max(9, Math.round(qrSize * 0.11));
    const lineH = addrSz + 4;

    if (address) {
        ctx.fillStyle = '#18181B'; // Monochrome black
        ctx.font = `700 ${addrSz}px ${FONT_FAMILY}`;

        const fullAddr = `Lokasi: ${address}`;
        const words = fullAddr.split(' ');
        let line = '';
        for (const word of words) {
            const testLine = line ? `${line} ${word}` : word;
            if (ctx.measureText(testLine).width > innerW && line) {
                ctx.fillText(line, centerX, nextY);
                line = word;
                nextY += lineH;
            } else {
                line = testLine;
            }
        }
        if (line) {
            ctx.fillText(line, centerX, nextY);
            nextY += lineH;
        }
        nextY += Math.round(innerH * 0.02);
    }

    // WA Table (Monochrome)
    if (waNumber) {
        const waSz = Math.max(9, Math.round(qrSize * 0.11));
        ctx.fillStyle = '#18181B';
        ctx.font = `800 ${waSz}px ${FONT_FAMILY}`;
        ctx.fillText(`WA: ${waNumber}`, centerX, nextY);
    }
}

// ─── Layout: Address + WA footer bar for non-QR collages ──────────────────────

function drawAddressBar(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    address: string, waNumber: string,
) {
    // Monochrome bar
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, w, h);

    // Subtle divider
    ctx.fillStyle = '#E4E4E7';
    ctx.fillRect(x, y, w, 1);

    const pad = Math.round(w * 0.03);
    const fontSize = Math.max(10, Math.round(h * 0.35));
    const centerY = y + h / 2;

    // Address on left
    if (address) {
        ctx.fillStyle = '#18181B';
        ctx.font = `700 ${fontSize}px ${FONT_FAMILY}`;
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        const maxAddrW = waNumber ? w * 0.55 : w - pad * 2;
        ctx.fillText(truncate(ctx, `Lokasi: ${address}`, maxAddrW), x + pad, centerY);
    }

    // WA on right
    if (waNumber) {
        ctx.fillStyle = '#18181B';
        ctx.font = `800 ${fontSize}px ${FONT_FAMILY}`;
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(truncate(ctx, `WA: ${waNumber}`, w * 0.4), x + w - pad, centerY);
    }
}

// ─── Layout renderers ─────────────────────────────────────────────────────────

/** 1 item layout — full canvas, gradient overlay, localized QR + WA + Address inside the photo */
async function render1Item(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    item: MarketplaceItem, img: HTMLImageElement | null,
    address: string, waNumber: string
) {
    // 1. Image cover
    if (img) {
        drawCover(ctx, img, 0, 0, W, H);
    } else {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, '#E4E4E7');
        g.addColorStop(1, '#D4D4D8');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#A1A1AA';
        ctx.font = `700 ${Math.round(W * 0.2)}px ${FONT_FAMILY}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('📦', W / 2, H / 2);
    }

    // 3. Info layout
    const pad = Math.round(Math.min(W, H) * 0.05);

    // 1-item status badge
    const badgeW = Math.max(60, Math.round(W * 0.1));
    const badgeH = Math.max(24, Math.round(badgeW * 0.4));
    ctx.fillStyle = item.status === 'baru' ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(pad, pad, badgeW, badgeH, 8);
        ctx.fill();
    } else {
        ctx.fillRect(pad, pad, badgeW, badgeH);
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${Math.max(10, Math.round(badgeH * 0.5))}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(item.status === 'baru' ? 'BARU' : 'BEKAS', pad + badgeW / 2, pad + badgeH / 2);

    // 2. Bottom shadow vignette (taller)
    const overlayH = Math.max(Math.round(H * 0.35), 300);
    const grad = ctx.createLinearGradient(0, H - overlayH, 0, H);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.3, 'rgba(0,0,0,0.5)');
    grad.addColorStop(1, 'rgba(0,0,0,0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - overlayH, W, overlayH);

    // 3. Info layout (already declared above)


    // --- 3. QR & Info (Right Side) ---
    const qrSize = Math.min(Math.round(W * 0.18), 180);
    const textSz = Math.max(10, Math.round(qrSize * 0.1));
    const lineH = textSz + 6;

    // Virtual panel box for location
    const panelW = qrSize + 24;
    const panelX = W - pad - panelW;
    const centerX = panelX + panelW / 2;

    let contentH = qrSize + 8;
    if (address) contentH += lineH;
    if (waNumber) contentH += lineH;

    const panelY = H - pad - contentH;

    // QR Background square (white) - essential for scanning on photos
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(centerX - qrSize / 2 - 4, panelY - 4, qrSize + 8, qrSize + 8, 8);
        ctx.fill();
    } else {
        ctx.fillRect(centerX - qrSize / 2 - 4, panelY - 4, qrSize + 8, qrSize + 8);
    }

    // Draw QR Code
    const itemUrl = `https://farros.space/marketplace/${item.slug}`;
    const qrImg = await fetchQRCode(itemUrl, qrSize);
    if (qrImg) {
        ctx.drawImage(qrImg, centerX - qrSize / 2, panelY, qrSize, qrSize);
    }

    // Draw Text beneath QR (White text)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let nextY = panelY + qrSize + 10;

    if (address) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `700 ${textSz}px ${FONT_FAMILY}`;
        ctx.fillText(truncate(ctx, `Lokasi: ${address}`, panelW + 30), centerX, nextY);
        nextY += lineH;
    }
    if (waNumber) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `800 ${textSz}px ${FONT_FAMILY}`;
        ctx.fillText(`WA: ${waNumber}`, centerX, nextY);
    }

    // --- 4. Item Info (Left Side) ---
    const nameSz = Math.max(24, Math.round(Math.min(W, H) * 0.055));
    const priceSz = Math.max(20, Math.round(nameSz * 0.8));
    const infoMaxW = panelX - pad * 2; // Space left of QR panel

    const priceY = H - pad - priceSz;
    const nameY = priceY - nameSz - Math.round(H * 0.01);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${nameSz}px ${FONT_FAMILY}`;
    ctx.fillText(truncate(ctx, item.name, infoMaxW), pad, nameY);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `700 ${priceSz}px ${FONT_FAMILY}`;
    ctx.fillText(truncate(ctx, formatPrice(item.price), infoMaxW), pad, priceY);
}

/** 2 item layout — split 50/50 dynamically based on orientation */
async function render2Items(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    items: MarketplaceItem[], images: (HTMLImageElement | null)[],
    address: string, waNumber: string
) {
    const isHorizontalSplit = W >= H;
    const barH = Math.round(H * (isHorizontalSplit ? 0.05 : 0.035));
    const contentH = H - barH;

    const cellW = isHorizontalSplit ? Math.floor(W / 2) : W;
    const cellH = isHorizontalSplit ? contentH : Math.floor(contentH / 2);

    for (let i = 0; i < 2; i++) {
        const cx = isHorizontalSplit ? i * cellW : 0;
        const cy = isHorizontalSplit ? 0 : i * cellH;
        drawPhotoCell(ctx, images[i], items[i], cx, cy, cellW, cellH);
    }

    // Divider
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    if (isHorizontalSplit) {
        ctx.fillRect(cellW - 1, 0, 2, contentH);
    } else {
        ctx.fillRect(0, cellH - 1, W, 2);
    }

    // Bottom bar
    drawAddressBar(ctx, 0, contentH, W, barH, address, waNumber);
}

/** 1:1 — 2×2 grid. If 3 items, 4th cell = QR panel */
async function render1x1(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    items: MarketplaceItem[], images: (HTMLImageElement | null)[],
    address: string, waNumber: string,
) {
    const count = items.length;
    const showQR = count === 3; // max-1 = 3
    const barH = showQR ? 0 : Math.round(H * 0.05); // No bar if address/WA are in QR panel
    const contentH = H - barH;

    const totalCells = showQR ? 4 : Math.min(count, 4);
    const cols = 2;
    const rows = Math.ceil(totalCells / cols);
    const cellW = Math.floor(W / cols);
    const cellH = Math.floor(contentH / rows);

    for (let i = 0; i < totalCells; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * cellW;
        const cy = row * cellH;
        const cw = col === cols - 1 ? W - cx : cellW;
        const ch = row === rows - 1 ? contentH - cy : cellH;

        if (showQR && i === 3) {
            await drawQRPanel(ctx, cx, cy, cw, ch, address, waNumber);
        } else if (i < count) {
            drawPhotoCell(ctx, images[i], items[i], cx, cy, cw, ch);
        }
    }

    // Address bar at bottom (only if no QR panel)
    if (!showQR) {
        drawAddressBar(ctx, 0, contentH, W, barH, address, waNumber);
    }
}

/** 4:3 — 5 photos + QR always. Layout: top row 3 photos, bottom row 2 photos + QR panel */
async function render4x3(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    items: MarketplaceItem[], images: (HTMLImageElement | null)[],
    address: string, waNumber: string,
) {
    const count = Math.min(items.length, 5);

    // Layout: top row = 3 cells, bottom row = 3 cells (2 photos + 1 QR)
    const topRowH = Math.floor(H * 0.55);
    const bottomRowH = H - topRowH;

    // Top row: up to 3 photos
    const topCount = Math.min(count, 3);
    const topCellW = Math.floor(W / topCount);
    for (let i = 0; i < topCount; i++) {
        const cx = i * topCellW;
        const cw = i === topCount - 1 ? W - cx : topCellW;
        drawPhotoCell(ctx, images[i], items[i], cx, 0, cw, topRowH);
    }

    // Bottom row: remaining photos + QR panel
    const bottomPhotos = count - topCount; // 0, 1, or 2
    const bottomCols = bottomPhotos + 1; // photos + QR
    const bottomCellW = Math.floor(W / bottomCols);

    for (let i = 0; i < bottomPhotos; i++) {
        const idx = topCount + i;
        const cx = i * bottomCellW;
        const cw = bottomCellW;
        drawPhotoCell(ctx, images[idx], items[idx], cx, topRowH, cw, bottomRowH);
    }

    // QR panel in the last cell of bottom row
    const qrX = bottomPhotos * bottomCellW;
    const qrW = W - qrX;
    await drawQRPanel(ctx, qrX, topRowH, qrW, bottomRowH, address, waNumber);

    // Thin grid lines for visual separation
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    // Horizontal line between rows
    ctx.fillRect(0, topRowH - 1, W, 2);
    // Vertical lines top row
    for (let i = 1; i < topCount; i++) {
        ctx.fillRect(i * topCellW - 1, 0, 2, topRowH);
    }
    // Vertical lines bottom row
    for (let i = 1; i <= bottomCols - 1; i++) {
        ctx.fillRect(i * bottomCellW - 1, topRowH, 2, bottomRowH);
    }
}

/** 3:4 — 5 photos + QR always. Layout: 2 columns, left=3 photos stacked, right=2 photos + QR stacked */
async function render3x4(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    items: MarketplaceItem[], images: (HTMLImageElement | null)[],
    address: string, waNumber: string,
) {
    const count = Math.min(items.length, 5);

    // Layout: left column 55% width with 3 photos, right column 45% with 2 photos + QR
    const leftW = Math.floor(W * 0.55);
    const rightW = W - leftW;

    // Left column: up to 3 photos stacked
    const leftCount = Math.min(count, 3);
    const leftCellH = Math.floor(H / leftCount);
    for (let i = 0; i < leftCount; i++) {
        const cy = i * leftCellH;
        const ch = i === leftCount - 1 ? H - cy : leftCellH;
        drawPhotoCell(ctx, images[i], items[i], 0, cy, leftW, ch);
    }

    // Right column: remaining photos + QR
    const rightPhotos = count - leftCount; // 0, 1, or 2
    const rightSlots = rightPhotos + 1; // +1 for QR
    const rightCellH = Math.floor(H / rightSlots);

    for (let i = 0; i < rightPhotos; i++) {
        const idx = leftCount + i;
        const cy = i * rightCellH;
        const ch = rightCellH;
        drawPhotoCell(ctx, images[idx], items[idx], leftW, cy, rightW, ch);
    }

    // QR panel
    const qrY = rightPhotos * rightCellH;
    const qrH = H - qrY;
    await drawQRPanel(ctx, leftW, qrY, rightW, qrH, address, waNumber);

    // Thin grid lines
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    // Vertical divider
    ctx.fillRect(leftW - 1, 0, 2, H);
    // Left horizontal lines
    for (let i = 1; i < leftCount; i++) {
        ctx.fillRect(0, i * leftCellH - 1, leftW, 2);
    }
    // Right horizontal lines
    for (let i = 1; i <= rightSlots - 1; i++) {
        ctx.fillRect(leftW, i * rightCellH - 1, rightW, 2);
    }
}

/** 9:16 — 2×3 vertical. If 5 items, 6th cell = QR panel */
async function render9x16(
    ctx: CanvasRenderingContext2D, W: number, H: number,
    items: MarketplaceItem[], images: (HTMLImageElement | null)[],
    address: string, waNumber: string,
) {
    const count = items.length;
    const showQR = count === 5; // max-1 = 5
    const barH = showQR ? 0 : Math.round(H * 0.035); // No bar if address/WA are in QR panel
    const contentH = H - barH;

    const totalCells = showQR ? 6 : Math.min(count, 6);
    const cols = 2;
    const rows = Math.ceil(totalCells / cols);
    const cellW = Math.floor(W / cols);
    const cellH = Math.floor(contentH / rows);

    for (let i = 0; i < totalCells; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = col * cellW;
        const cy = row * cellH;
        const cw = col === cols - 1 ? W - cx : cellW;
        const ch = row === rows - 1 ? contentH - cy : cellH;

        if (showQR && i === 5) {
            await drawQRPanel(ctx, cx, cy, cw, ch, address, waNumber);
        } else if (i < count) {
            drawPhotoCell(ctx, images[i], items[i], cx, cy, cw, ch);
        }
    }

    // Grid lines between cells
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    // Vertical center line
    ctx.fillRect(cellW - 1, 0, 2, contentH);
    // Horizontal lines
    for (let r = 1; r < rows; r++) {
        ctx.fillRect(0, r * cellH - 1, W, 2);
    }

    // Address bar at bottom (only if no QR panel)
    if (!showQR) {
        drawAddressBar(ctx, 0, contentH, W, barH, address, waNumber);
    }
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function CollageGenerator({ items, waNumber, onClose }: CollageGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const genIdRef = useRef(0);
    const mountedRef = useRef(false);
    const imageCacheRef = useRef<Map<string, Promise<HTMLImageElement | null>>>(new Map());

    const [selectedRes, setSelectedRes] = useState<ResolutionPreset>(RESOLUTIONS[0]);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [address, setAddress] = useState('');
    const [downloadError, setDownloadError] = useState<string | null>(null);

    // Limit items to the max for the selected resolution
    const visibleItems = useMemo(
        () => items.slice(0, selectedRes.maxItems),
        [items, selectedRes]
    );

    const showQR = useMemo(() => {
        if (selectedRes.hasFixedQR) return true;
        if (selectedRes.hasConditionalQR && visibleItems.length === selectedRes.maxItems - 1) return true;
        return false;
    }, [selectedRes, visibleItems]);

    useEffect(() => {
        mountedRef.current = true;

        // Body scroll lock
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.setProperty('overflow', 'hidden', 'important');

        return () => {
            mountedRef.current = false;
            genIdRef.current++;
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const getCachedImage = useCallback((src: string) => {
        const resolved = resolveImageSrc(src);
        const cache = imageCacheRef.current;
        if (!cache.has(resolved)) cache.set(resolved, loadImage(resolved));
        return cache.get(resolved)!;
    }, []);

    // Adaptive preview scale
    const PREVIEW_SCALE = useMemo(() => {
        const MAX_H = 520, MAX_W = 500;
        return Math.min(MAX_H / selectedRes.height, MAX_W / selectedRes.width);
    }, [selectedRes]);

    const previewW = useMemo(() => Math.round(selectedRes.width * PREVIEW_SCALE), [selectedRes, PREVIEW_SCALE]);
    const previewH = useMemo(() => Math.round(selectedRes.height * PREVIEW_SCALE), [selectedRes, PREVIEW_SCALE]);

    const generateCollage = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const myGen = ++genIdRef.current;
        setGenerating(true); setGenerated(false); setDownloadError(null);
        await nextFrame();
        if (!mountedRef.current || genIdRef.current !== myGen) return;

        const W = selectedRes.width, H = selectedRes.height;
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setGenerating(false); return; }

        ctx.imageSmoothingEnabled = true;
        try { (ctx as any).imageSmoothingQuality = 'high'; } catch { /* noop */ }

        try {
            // White background
            ctx.fillStyle = BG_COLOR;
            ctx.fillRect(0, 0, W, H);

            if (visibleItems.length === 0) {
                ctx.fillStyle = '#A1A1AA';
                ctx.font = `600 ${Math.max(14, Math.round(H * 0.02))}px ${FONT_FAMILY}`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('Tidak ada item.', W / 2, H / 2);
                setGenerating(false); setGenerated(true); return;
            }

            // Load images (prefer cropped)
            const images = await Promise.all(
                visibleItems.map(item => {
                    const src = item.image_cropped_path ?? item.image_path;
                    return src ? getCachedImage(src) : Promise.resolve(null);
                })
            );
            if (!mountedRef.current || genIdRef.current !== myGen) return;

            if (visibleItems.length === 1) {
                await render1Item(ctx, W, H, visibleItems[0], images[0], address, waNumber);
            } else if (visibleItems.length === 2) {
                await render2Items(ctx, W, H, visibleItems, images, address, waNumber);
            } else {
                // Render based on resolution
                switch (selectedRes.key) {
                    case '1:1':
                        await render1x1(ctx, W, H, visibleItems, images, address, waNumber);
                        break;
                    case '4:3':
                        await render4x3(ctx, W, H, visibleItems, images, address, waNumber);
                        break;
                    case '3:4':
                        await render3x4(ctx, W, H, visibleItems, images, address, waNumber);
                        break;
                    case '9:16':
                        await render9x16(ctx, W, H, visibleItems, images, address, waNumber);
                        break;
                }
            }

            if (mountedRef.current && genIdRef.current === myGen) {
                setGenerating(false); setGenerated(true);
            }
        } catch (err) {
            console.error('[CollageGenerator]', err);
            if (mountedRef.current && genIdRef.current === myGen) {
                setGenerating(false); setGenerated(false);
            }
        }
    }, [visibleItems, selectedRes, address, waNumber, getCachedImage]);

    // Auto-generate on changes
    useEffect(() => {
        const t = window.setTimeout(() => generateCollage(), 150);
        return () => window.clearTimeout(t);
    }, [generateCollage]);

    // Download
    const handleDownload = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        setDownloadError(null);
        const now = new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        const filename = `kolase-${selectedRes.key.replace(':', 'x')}-${stamp}.png`;
        const click = (href: string) => { const a = document.createElement('a'); a.download = filename; a.href = href; document.body.appendChild(a); a.click(); a.remove(); };
        try {
            const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/png'));
            if (!blob) throw new Error('blob null');
            const url = URL.createObjectURL(blob); click(url); URL.revokeObjectURL(url);
        } catch {
            try { click(canvas.toDataURL('image/png')); }
            catch (e) { setDownloadError('Download gagal. Pastikan gambar di-host di domain yang sama (CORS).'); }
        }
    }, [selectedRes]);

    // ESC to close
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    // ─── UI ────────────────────────────────────────────────────────────────────

    const itemCountInfo = `${visibleItems.length}/${selectedRes.maxItems} item`;
    const qrInfo = showQR ? ' · QR aktif' : '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 touch-none" role="dialog" aria-modal="true" aria-label="Generator Kolase">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-zinc-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-zinc-900">Generator Kolase</h2>
                            <p className="text-xs text-zinc-400 mt-0.5">{itemCountInfo}{qrInfo}</p>
                        </div>
                    </div>
                    <button onClick={onClose} type="button" aria-label="Tutup" className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Warn if items exceed max */}
                {items.length > selectedRes.maxItems && (
                    <div className="mx-6 mt-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-2.5 shrink-0">
                        <span className="text-amber-500 mt-0.5">⚠</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Resolusi <span className="font-semibold">{selectedRes.key}</span> maksimal <span className="font-semibold">{selectedRes.maxItems} item</span>.
                            {items.length - selectedRes.maxItems} item tidak ditampilkan.
                        </p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden min-h-0">
                    {/* Sidebar */}
                    <div className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-zinc-100 p-4 md:p-5 space-y-4 md:space-y-5 md:overflow-y-auto">

                        {/* Resolution buttons */}
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2.5">Resolusi</label>
                            <div className="grid grid-cols-2 gap-2">
                                {RESOLUTIONS.map(r => (
                                    <button
                                        key={r.key}
                                        type="button"
                                        onClick={() => setSelectedRes(r)}
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${selectedRes.key === r.key
                                            ? 'bg-violet-50 border-violet-200 text-violet-700 ring-1 ring-violet-200'
                                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <span className="block text-sm font-bold">{r.key}</span>
                                            <span className="block text-[10px] text-zinc-400 mt-0.5">max {r.maxItems}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-2">{selectedRes.width} × {selectedRes.height}px</p>
                        </div>

                        {/* Address input */}
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                Alamat Kolase
                            </label>
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Masukkan alamat singkat..."
                                rows={2}
                                className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 text-zinc-800 placeholder-zinc-400 transition-all resize-none"
                            />
                        </div>

                        {/* WA Number display */}
                        {waNumber && (
                            <div className="bg-violet-50/60 border border-violet-100 rounded-xl px-3 py-2.5">
                                <p className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold">No. WhatsApp</p>
                                <p className="text-sm font-bold text-violet-700 mt-0.5">{waNumber}</p>
                            </div>
                        )}

                        {/* Item list */}
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Item ({visibleItems.length})</label>
                            <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                {visibleItems.map((item, idx) => (
                                    <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-zinc-50">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-100 overflow-hidden shrink-0 text-xs font-bold text-zinc-300 flex items-center justify-center">
                                            {(item.image_cropped_path ?? item.image_path) ? (
                                                <img src={item.image_cropped_path ?? item.image_path!} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{idx + 1}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-zinc-800 truncate">{item.name}</p>
                                            <p className="text-[10px] text-zinc-400">{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR indicator */}
                        {showQR && (
                            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2.5">
                                <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">QR Code</p>
                                <p className="text-xs text-emerald-700 mt-0.5 break-all">{QR_URL}</p>
                            </div>
                        )}
                    </div>

                    {/* Canvas Preview */}
                    <div className="md:flex-1 shrink-0 flex flex-col items-center justify-start md:justify-center bg-zinc-50/60 p-6 pb-12 md:p-6 md:overflow-auto">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-zinc-200/60 flex shrink-0" style={{ width: '100%', maxWidth: previewW, aspectRatio: `${selectedRes.width}/${selectedRes.height}` }}>
                            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
                            {generating && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                                        <p className="text-xs font-semibold text-zinc-500">Membuat kolase...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-3">Preview · Output {selectedRes.width}×{selectedRes.height}px</p>
                        {downloadError && <p className="mt-2 text-xs text-rose-600 max-w-md text-center leading-relaxed">{downloadError}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-100 shrink-0 bg-white">
                    <button type="button" onClick={generateCollage} disabled={generating} title="Refresh"
                        className="p-2 sm:px-4 sm:py-2.5 rounded-xl border border-transparent sm:border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                        <RefreshCw className={`w-5 h-5 sm:w-4 sm:h-4 ${generating ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <div className="flex gap-2 flex-1 sm:flex-none justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                            Batal
                        </button>
                        <button type="button" onClick={handleDownload} disabled={!generated || generating}
                            className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 shadow-sm">
                            <Download className="w-4 h-4 shrink-0" /> Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}