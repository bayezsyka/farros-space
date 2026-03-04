import React from 'react';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Link } from '@inertiajs/react';
import { Mail, Phone, ArrowRight, ChevronDown, ShoppingBag, MessageSquare } from 'lucide-react';

interface HeroSectionProps {
    profile: {
        full_name?: string;
        headline?: string;
        email?: string;
        phone?: string;
    };
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
    return (
        <Section spacing="none" className="relative overflow-hidden border-b bg-background">
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />
            {/* Radial highlight top-left */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            {/* Radial highlight bottom-right */}
            <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center min-h-[85vh] py-20 lg:py-0">

                    {/* Left: Text content */}
                    <div className="space-y-7 lg:space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 border border-border bg-muted/50 rounded-full px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Available & Open
                        </div>

                        {/* Name */}
                        <div className="space-y-3">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.0] tracking-tight">
                                {profile.full_name || 'Farros Space'}
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-md">
                                {profile.headline || 'Welcome to my digital space.'}
                            </p>
                        </div>

                        {/* Contact chips */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                            {profile.email && (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="inline-flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-all group"
                                >
                                    <Mail className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <span className="truncate max-w-[200px]">{profile.email}</span>
                                </a>
                            )}
                            {profile.phone && (
                                <a
                                    href={`https://wa.me/${profile.phone.replace(/^0/, '62')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:border-foreground/20 transition-all group"
                                >
                                    <Phone className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <span>{profile.phone}</span>
                                </a>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <Link href="/contact">
                                <Button size="lg" className="rounded-xl font-bold px-7 gap-2">
                                    Get in Touch <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-xl px-7 font-semibold"
                                onClick={() => document.getElementById('threads-feed')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Read Threads
                            </Button>
                        </div>

                        {/* Feature links */}
                        <div className="flex items-center gap-6 pt-2 border-t border-border/50">
                            <Link
                                href={route('marketplace.index')}
                                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <ShoppingBag className="w-4 h-4 group-hover:text-foreground transition-colors" />
                                Marketplace
                            </Link>
                            <div className="w-px h-4 bg-border" />
                            <Link
                                href={route('threads.index')}
                                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <MessageSquare className="w-4 h-4 group-hover:text-foreground transition-colors" />
                                Threads
                            </Link>
                        </div>
                    </div>

                    {/* Right: Decorative card panel */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative w-full max-w-sm">
                            {/* Main card */}
                            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-foreground/5">
                                {/* Card inner accent */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-3xl overflow-hidden">
                                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full" />
                                </div>

                                <div className="relative space-y-6">
                                    {/* Avatar placeholder */}
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-black text-primary">
                                        {(profile.full_name || 'F').charAt(0)}
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                                            Personal Space
                                        </p>
                                        <h3 className="text-2xl font-black text-foreground leading-tight">
                                            {profile.full_name || 'Farros Space'}
                                        </h3>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/50 rounded-2xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market</span>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground/80">Jual & Beli</p>
                                        </div>
                                        <div className="bg-muted/50 rounded-2xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Thread</span>
                                            </div>
                                            <p className="text-sm font-semibold text-foreground/80">Berbagi Cerita</p>
                                        </div>
                                    </div>

                                    {/* CTA mini */}
                                    <Link href="/contact" className="block">
                                        <div className="flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-5 py-3.5 font-bold text-sm group hover:opacity-90 transition-opacity">
                                            <span>Hubungi Saya</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Floating decorative card - top right */}
                            <div className="absolute -top-5 -right-5 bg-card border border-border rounded-2xl p-3.5 shadow-lg">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground">Status</p>
                                        <p className="text-xs font-bold text-foreground">Open to connect</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative card - bottom left */}
                            <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl p-3.5 shadow-lg">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-muted-foreground">Kontak</p>
                                        <p className="text-xs font-bold text-foreground truncate max-w-[100px]">{profile.email || 'farros.space'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground animate-bounce">
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </Container>
        </Section>
    );
};
