import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Download,
    Github,
    Instagram,
    Linkedin,
    Twitter,
    Facebook,
    Youtube,
    Link as LinkIcon,
    X,
    Maximize2
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface HeroSectionProps {
    profile: {
        full_name?: string;
        headline?: string;
        email?: string;
        phone?: string;
    };
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
    const [mounted, setMounted] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { social_links } = usePage<any>().props;
    const name = profile?.full_name || 'Farros';

    const getIcon = (platformId: string) => {
        switch (platformId) {
            case 'github': return Github;
            case 'instagram': return Instagram;
            case 'linkedin': return Linkedin;
            case 'twitter': return Twitter;
            case 'facebook': return Facebook;
            case 'youtube': return Youtube;
            default: return LinkIcon;
        }
    };

    return (
        // h-screen + flex-col → children can use flex-grow to claim remaining space
        <section
            className="relative overflow-hidden bg-background flex flex-col"
            style={{ height: '100svh', minHeight: '600px' }}
        >
            {/* ─── Grid overlay ─── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `
                        linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                        linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
            {/* ─── Ambient blobs ─── */}
            <div className="pointer-events-none absolute -top-60 -left-40 w-[700px] h-[700px] rounded-full bg-primary/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

            {/* ══════════════════════════════════════════════════════════
                 MOBILE + TABLET (< 1024px)
                 flex-col: content shrinks, photo-wrapper grows to fill rest
                 ══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 flex flex-col h-full lg:hidden">

                {/* ── Content block (fixed height, at the top) ── */}
                <div
                    className="flex flex-col items-center px-6 pt-20 md:pt-24 flex-shrink-0"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    {/* Name */}
                    <div className="w-full text-center space-y-1">
                        <p className="text-3xl md:text-4xl font-bold text-foreground">Hy! I Am</p>
                        <p className="text-4xl md:text-5xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                            {name}.
                        </p>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed font-medium text-center max-w-sm md:max-w-md">
                        {profile?.headline ?? 'I build beautifully simple things, and I love what I do.'}
                    </p>

                    {/* Buttons */}
                    <div className="mt-5 w-full max-w-xs md:max-w-sm flex flex-col gap-2.5">
                        <Link href="/contact" className="block">
                            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-sm md:text-base font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                Get in Touch <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                        <Link href="/cv" className="block">
                            <button className="w-full flex items-center justify-center gap-2 border border-border bg-background/60 backdrop-blur-sm text-foreground rounded-xl px-6 py-3 text-sm font-semibold hover:bg-muted transition-all">
                                <Download className="w-4 h-4" />
                                Download CV
                            </button>
                        </Link>
                    </div>

                    {/* Social links */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        {social_links?.map((link: any) => {
                            const Icon = getIcon(link.platform);
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.username || link.platform}
                                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all"
                                >
                                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* ── Photo wrapper: flex-1 = takes all remaining height.
                     min-h-0 = allows the flex child to shrink (critical!).
                     items-end = photo sticks to bottom of this container.
                     The container's bottom IS the section's bottom. ── */}
                <div
                    className="flex-1 min-h-0 flex items-end justify-center overflow-hidden cursor-pointer group/mobile relative"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}
                    onClick={() => setPreviewImage('/images/hero-foto-saya.png')}
                >
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-[72vw] max-w-[340px] md:w-[50vw] md:max-w-[420px] max-h-full h-auto object-contain object-bottom block transition-transform duration-500 group-hover/mobile:scale-[1.03]"
                        draggable={false}
                    />
                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover/mobile:opacity-100 transition-opacity">
                        <div className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-xl">
                            <Maximize2 className="w-5 h-5 text-foreground" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                 DESKTOP (≥ 1024px) — 3-column grid
                 Center column: flex items-end so photo is at the bottom
                 ══════════════════════════════════════════════════════════ */}
            <div
                className="relative z-10 hidden lg:grid h-full w-full max-w-7xl mx-auto px-12"
                style={{ gridTemplateColumns: '1fr 380px 1fr' }}
            >
                {/* LEFT — name */}
                <div
                    className="flex flex-col justify-center pr-10"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="space-y-1">
                        <p className="text-4xl font-bold text-foreground">Hy! I Am</p>
                        <p className="text-5xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                            {name}.
                        </p>
                    </div>
                </div>

                {/* CENTER — photo at bottom of column */}
                <div
                    className="flex items-end justify-center overflow-hidden cursor-pointer group relative"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1.2s ease 0.3s' }}
                    onClick={() => setPreviewImage('/images/hero-foto-saya.png')}
                >
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-full h-auto object-contain object-bottom block transition-transform duration-700 group-hover:scale-[1.02]"
                        style={{ maxHeight: '82vh' }}
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-2xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                            <Maximize2 className="w-6 h-6 text-foreground" />
                        </div>
                    </div>
                </div>

                {/* RIGHT — bio + button + socials */}
                <div
                    className="flex flex-col justify-center pl-10 text-right space-y-4"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
                    }}
                >
                    <p className="text-xl text-muted-foreground leading-snug font-medium">
                        {profile?.headline
                            ? profile.headline
                            : <>I build beautifully simple things,<br />and I love what I do.</>
                        }
                    </p>

                    <div className="flex flex-col items-end gap-2.5">
                        <Link href="/contact">
                            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                Get in Touch <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                        <Link href="/cv">
                            <button className="flex items-center justify-center gap-2 border border-border bg-background/60 backdrop-blur-sm text-foreground rounded-xl px-6 py-3 text-sm font-semibold hover:bg-muted transition-all">
                                <Download className="w-4 h-4" />
                                Download CV
                            </button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        {social_links?.map((link: any) => {
                            const Icon = getIcon(link.platform);
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.username || link.platform}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                        onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                    >
                        <X className="w-7 h-7" />
                    </button>
                    <img
                        src={previewImage}
                        className="max-w-[95vw] max-h-[90vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                        alt="Full size preview"
                        draggable={false}
                    />
                </div>
            )}
        </section>
    );
};
