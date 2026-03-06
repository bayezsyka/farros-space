import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Github,
    Instagram,
    Linkedin,
    Twitter,
    Facebook,
    Youtube,
    Link as LinkIcon,
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

    const socialLinksJSX = (size: 'sm' | 'md', justify: 'center' | 'end') => (
        <div className={`flex flex-wrap gap-3 justify-${justify}`}>
            {social_links?.map((link: any) => {
                const Icon = getIcon(link.platform);
                const s = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';
                return (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.username || link.platform}
                        className={`${s} rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all`}
                    >
                        <Icon className="w-4 h-4" />
                    </a>
                );
            })}
        </div>
    );

    return (
        <section className="relative min-h-screen overflow-hidden bg-background flex flex-col">

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

            {/* ══════════════════════════════════════════════
                 MOBILE LAYOUT (< 768px)
                 Stacked: name → bio → button → socials → photo
                 ══════════════════════════════════════════════ */}
            <div
                className="relative z-10 flex flex-col items-center px-6 pt-24 pb-0 md:hidden"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
            >
                {/* 1. Name */}
                <div className="w-full text-center space-y-1">
                    <p className="text-3xl font-bold text-foreground">Hy! I Am</p>
                    <p className="text-4xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                        {name}.
                    </p>
                </div>

                {/* 2. Bio */}
                <p className="mt-5 text-base text-muted-foreground leading-relaxed font-medium text-center max-w-sm">
                    {profile?.headline ?? 'I build beautifully simple things, and I love what I do.'}
                </p>

                {/* 3. Get in Touch */}
                <div className="mt-6 w-full max-w-xs">
                    <Link href="/contact" className="block">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                            Get in Touch <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                {/* 4. Social links */}
                <div className="mt-5">{socialLinksJSX('md', 'center')}</div>

                {/* 5. Photo */}
                <div
                    className="mt-8 w-full flex justify-center"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}
                >
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-[85%] max-w-[380px] h-auto object-contain"
                        draggable={false}
                    />
                </div>
            </div>

            {/* ══════════════════════════════════════════════
                 TABLET / DESKTOP LAYOUT (≥ 768px)
                 3-column grid: LEFT text | CENTER photo | RIGHT text
                 Photo is in normal flow → never floats
                 ══════════════════════════════════════════════ */}
            <div className="relative z-10 flex-1 hidden md:grid min-h-screen w-full max-w-7xl mx-auto px-6 lg:px-12"
                style={{ gridTemplateColumns: '1fr minmax(200px, 380px) 1fr' }}
            >
                {/* ── LEFT: name ── */}
                <div
                    className="flex flex-col justify-center pr-6 lg:pr-10"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="space-y-1">
                        <p className="text-3xl lg:text-4xl font-bold text-foreground">Hy! I Am</p>
                        <p className="text-4xl lg:text-5xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                            {name}.
                        </p>
                    </div>
                </div>

                {/* ── CENTER: photo — always at the bottom of its column ── */}
                <div className="flex items-end justify-center overflow-hidden">
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-full h-auto object-contain object-bottom max-h-[80vh]"
                        draggable={false}
                        style={{
                            opacity: mounted ? 1 : 0,
                            transition: 'opacity 1.2s ease 0.3s',
                        }}
                    />
                </div>

                {/* ── RIGHT: bio + button + socials ── */}
                <div
                    className="flex flex-col justify-center pl-6 lg:pl-10 text-right space-y-4"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
                    }}
                >
                    <p className="text-lg lg:text-xl text-muted-foreground leading-snug font-medium">
                        {profile?.headline ? profile.headline : <>I build beautifully simple things,<br />and I love what I do.</>}
                    </p>

                    <div className="flex items-center gap-3 justify-end">
                        <Link href="/contact">
                            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 lg:px-6 py-2.5 lg:py-3 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                Get in Touch <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    {socialLinksJSX('sm', 'end')}
                </div>
            </div>
        </section>
    );
};
