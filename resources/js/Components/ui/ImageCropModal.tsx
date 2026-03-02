import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Crop, Check } from 'lucide-react';

interface ImageCropModalProps {
    /** Object URL or data URL of the original image */
    src: string;
    onConfirm: (croppedFile: File, croppedPreview: string) => void;
    onCancel: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export default function ImageCropModal({ src, onConfirm, onCancel }: ImageCropModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // pan offset (px, relative to canvas center)
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [ready, setReady] = useState(false);

    // drag state stored in ref to avoid stale closures
    const drag = useRef<{ active: boolean; startX: number; startY: number; startOffX: number; startOffY: number }>({
        active: false, startX: 0, startY: 0, startOffX: 0, startOffY: 0,
    });

    // ── Load image ──────────────────────────────────────────────────────────
    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            imgRef.current = img;
            setReady(true);
            // Auto-fit zoom so image fills the square preview
            const canvas = canvasRef.current;
            if (!canvas) return;
            const size = canvas.width;   // canvas is always square
            const fitZoom = Math.max(size / img.naturalWidth, size / img.naturalHeight);
            setZoom(Math.max(MIN_ZOOM, fitZoom));
            setOffset({ x: 0, y: 0 });
        };
        img.src = src;
    }, [src]);

    // ── Draw ─────────────────────────────────────────────────────────────────
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = canvas.width;
        ctx.clearRect(0, 0, size, size);

        const drawW = img.naturalWidth * zoom;
        const drawH = img.naturalHeight * zoom;
        const dx = size / 2 - drawW / 2 + offset.x;
        const dy = size / 2 - drawH / 2 + offset.y;

        ctx.drawImage(img, dx, dy, drawW, drawH);
    }, [zoom, offset]);

    useEffect(() => {
        if (ready) draw();
    }, [ready, draw]);

    // ── Clamp offset so image always fills the crop square ──────────────────
    const clampOffset = useCallback((ox: number, oy: number, z: number): { x: number; y: number } => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return { x: ox, y: oy };
        const size = canvas.width;
        const drawW = img.naturalWidth * z;
        const drawH = img.naturalHeight * z;

        // Max pan: edges of the image must still touch the canvas edges
        const maxX = Math.max(0, (drawW - size) / 2);
        const maxY = Math.max(0, (drawH - size) / 2);
        return {
            x: Math.max(-maxX, Math.min(maxX, ox)),
            y: Math.max(-maxY, Math.min(maxY, oy)),
        };
    }, []);

    // ── Pointer events ────────────────────────────────────────────────────────
    const onPointerDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { active: true, startX: e.clientX, startY: e.clientY, startOffX: offset.x, startOffY: offset.y };
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current.active) return;
        const dx = e.clientX - drag.current.startX;
        const dy = e.clientY - drag.current.startY;
        const clamped = clampOffset(drag.current.startOffX + dx, drag.current.startOffY + dy, zoom);
        setOffset(clamped);
    };
    const onPointerUp = () => { drag.current.active = false; };

    // ── Scroll / pinch zoom (Manual listener for non-passive behavior) ────────────────
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -e.deltaY * 0.002;
            setZoom((prev) => {
                const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta * prev));
                setOffset((off) => clampOffset(off.x, off.y, next));
                return next;
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [clampOffset]);

    const changeZoom = (factor: number) => {
        setZoom((prev) => {
            const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * factor));
            setOffset((off) => clampOffset(off.x, off.y, next));
            return next;
        });
    };

    const resetView = () => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img) return;
        const size = canvas.width;
        const fitZoom = Math.max(size / img.naturalWidth, size / img.naturalHeight);
        setZoom(Math.max(MIN_ZOOM, fitZoom));
        setOffset({ x: 0, y: 0 });
    };

    // ── Confirm: output 1:1 cropped blob ─────────────────────────────────────
    const confirm = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Export at 800×800 for collage use
        const OUTPUT = 800;
        const out = document.createElement('canvas');
        out.width = OUTPUT;
        out.height = OUTPUT;
        const ctx = out.getContext('2d');
        if (!ctx) return;
        // Scale from preview canvas (canvas.width) to output size
        const scale = OUTPUT / canvas.width;
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.width, 0, 0, OUTPUT, OUTPUT);
        out.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `crop_${Date.now()}.webp`, { type: 'image/webp' });
            const previewUrl = URL.createObjectURL(blob);
            onConfirm(file, previewUrl);
        }, 'image/webp', 0.88);
    };

    // Determine canvas display size (dynamic for mobile)
    const [displaySize, setDisplaySize] = useState(420);
    const CANVAS_ACTUAL = 840; // 2x for retina

    useEffect(() => {
        const updateSize = () => {
            if (!containerRef.current) return;
            const parent = containerRef.current.parentElement;
            if (parent) {
                const parentW = parent.clientWidth;
                // Leave some padding for the modal edges
                const available = Math.min(420, parentW);
                setDisplaySize(available);
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col border border-zinc-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Crop className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-900">Sesuaikan Foto</h3>
                            <p className="text-xs text-zinc-400">Drag untuk menggeser · Scroll untuk zoom · Rasio 1:1</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="flex flex-col items-center gap-4 p-4 sm:p-6">
                    {/* Canvas wrapper */}
                    <div
                        ref={containerRef}
                        className="relative select-none overflow-hidden rounded-2xl border-2 border-violet-200 shadow-lg"
                        style={{ width: displaySize, height: displaySize, cursor: 'grab' }}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                    >
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_ACTUAL}
                            height={CANVAS_ACTUAL}
                            style={{ width: displaySize, height: displaySize, display: 'block' }}
                        />

                        {/* Grid overlay */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            backgroundImage: 'linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)',
                            backgroundSize: `${displaySize / 3}px ${displaySize / 3}px`,
                        }} />

                        {/* Corner markers */}
                        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                            <div key={i} className={`absolute ${pos} w-6 h-6 pointer-events-none`}>
                                <div className={`absolute w-5 h-[2px] bg-violet-500 ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
                                <div className={`absolute h-5 w-[2px] bg-violet-500 ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
                            </div>
                        ))}

                        {!ready && (
                            <div className="absolute inset-0 bg-zinc-50 flex items-center justify-center rounded-2xl">
                                <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Zoom controls */}
                    <div className="flex items-center gap-3 w-full px-2">
                        <button
                            onClick={() => changeZoom(0.8)}
                            className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-all shrink-0"
                        >
                            <ZoomOut className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex-1">
                            <input
                                type="range"
                                min={100}
                                max={500}
                                value={Math.round(zoom * 100)}
                                onChange={(e) => {
                                    const z = Number(e.target.value) / 100;
                                    setZoom(z);
                                    setOffset((off) => clampOffset(off.x, off.y, z));
                                }}
                                className="w-full accent-violet-600"
                            />
                        </div>

                        <button
                            onClick={() => changeZoom(1.25)}
                            className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-all shrink-0"
                        >
                            <ZoomIn className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={resetView}
                            title="Reset"
                            className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-all shrink-0"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 -mt-1">
                        Zoom {Math.round(zoom * 100)}% · Foto asli tetap tersimpan penuh
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50/60">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-white transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={confirm}
                        disabled={!ready}
                        className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 inline-flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Gunakan Foto Ini
                    </button>
                </div>
            </div>
        </div>
    );
}
