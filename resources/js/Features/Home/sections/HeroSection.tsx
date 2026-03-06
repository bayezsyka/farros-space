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

            {/* ══════════════════════════════════════════════════════════
                 MOBILE LAYOUT (< 768px)
                 Stacked: name → bio → button → socials → photo
                 ══════════════════════════════════════════════════════════ */}
            <div
                className="relative z-10 flex flex-col items-center px-6 pt-24 pb-0 md:hidden"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
            >
                <div className="w-full text-center space-y-1">
                    <p className="text-3xl font-bold text-foreground">Hy! I Am</p>
                    <p className="text-4xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                        {name}.
                    </p>
                </div>

                <p className="mt-5 text-base text-muted-foreground leading-relaxed font-medium text-center max-w-sm">
                    {profile?.headline ?? 'I build beautifully simple things, and I love what I do.'}
                </p>

                <div className="mt-6 w-full max-w-xs">
                    <Link href="/contact" className="block">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3.5 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                            Get in Touch <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                    {social_links?.map((link: any) => {
                        const Icon = getIcon(link.platform);
                        return (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                title={link.username || link.platform}
                                className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all">
                                <Icon className="w-4 h-4" />
                            </a>
                        );
                    })}
                </div>

                <div className="mt-8 w-full flex justify-center"
                    style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.9s ease 0.3s' }}>
                    <img src="/images/hero-foto-saya.png" alt={name}
                        className="w-[85%] max-w-[380px] h-auto object-contain" draggable={false} />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                 TABLET LAYOUT (768px – 1023px)  md: only
                 2-column: [left: all content] [right: photo bottom-aligned]
                 ══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 hidden md:grid lg:hidden flex-1 min-h-screen w-full max-w-5xl mx-auto px-10"
                style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}>

                {/* LEFT — name + bio + button + socials, vertically centered */}
                <div
                    className="flex flex-col justify-center py-24 pr-8 space-y-5"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-foreground">Hy! I Am</p>
                        <p className="text-4xl font-extrabold" style={{ color: 'hsl(var(--primary))' }}>
                            {name}.
                        </p>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed font-medium max-w-xs">
                        {profile?.headline ?? 'I build beautifully simple things, and I love what I do.'}
                    </p>

                    <div>
                        <Link href="/contact">
                            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                Get in Touch <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {social_links?.map((link: any) => {
                            const Icon = getIcon(link.platform);
                            return (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    title={link.username || link.platform}
                                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT — photo anchored to bottom of column */}
                <div className="flex items-end justify-center overflow-hidden">
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-full max-w-[320px] h-auto object-contain object-bottom"
                        draggable={false}
                        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1.2s ease 0.3s', maxHeight: '80vh' }}
                    />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                 DESKTOP LAYOUT (≥ 1024px)  lg:
                 3-column: [left: name] [center: photo bottom] [right: bio+btn+socials]
                 ══════════════════════════════════════════════════════════ */}
            <div className="relative z-10 hidden lg:grid flex-1 min-h-screen w-full max-w-7xl mx-auto px-12"
                style={{ gridTemplateColumns: '1fr 380px 1fr', alignItems: 'stretch' }}>

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

                {/* CENTER — photo anchored to bottom */}
                <div className="flex items-end justify-center overflow-hidden">
                    <img
                        src="/images/hero-foto-saya.png"
                        alt={name}
                        className="w-full h-auto object-contain object-bottom"
                        draggable={false}
                        style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1.2s ease 0.3s', maxHeight: '80vh' }}
                    />
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
                        {profile?.headline ? profile.headline : <>I build beautifully simple things,<br />and I love what I do.</>}
                    </p>

                    <div className="flex items-center justify-end">
                        <Link href="/contact">
                            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                Get in Touch <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        {social_links?.map((link: any) => {
                            const Icon = getIcon(link.platform);
                            return (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    title={link.username || link.platform}
                                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};
