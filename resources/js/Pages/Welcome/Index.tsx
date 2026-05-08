import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import SeoHead from '@/Components/SeoHead';
import { createWebsiteJsonLd, createPersonJsonLd } from '@/lib/structuredData';
import { HeroSection } from '@/Features/Home/sections/HeroSection';
import { Container } from '@/Components/ui/Container';
import { Typography } from '@/Components/ui/Typography';
import { Link, usePage } from '@inertiajs/react';
import { 
    Briefcase, 
    ShoppingBag, 
    ArrowRight, 
    ChevronRight, 
    Star, 
    Clock,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

import { PageProps } from '@/types';
import useTranslation from '@/Hooks/useTranslation';

interface Props {
    profile: any;
    experiences: any[];
    marketplaceItems: any[];
}

export default function Index({ profile, experiences, marketplaceItems }: Props) {
    const { auth, locale } = usePage<PageProps>().props;
    const { __ } = useTranslation();
    


    return (
        <AppLayout title={__('Home')} overlayHeader={true}>
            <SeoHead 
                title={__('Farros Space — Digital Portfolio & Marketplace')}
                description={locale === 'en' 
                    ? "Welcome to Farros Space. Explorations in web development, professional experiences, and a curated marketplace of items." 
                    : "Selamat datang di Farros Space. Eksplorasi pengembangan web, pengalaman profesional, dan marketplace barang pilihan."}
                jsonLd={[createWebsiteJsonLd(), createPersonJsonLd(profile)]}
            />
            <HeroSection profile={profile} />

            <div className="relative z-20 pb-20 bg-background rounded-t-[3rem] border-t border-border/50 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">
                <Container className="max-w-2xl px-6 pt-12">
                    
                    {/* ── Experience Section ── */}
                    <div className="mb-14">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <Typography variant="h3" className="text-lg font-black tracking-tight">{__('Recent Experience')}</Typography>
                            </div>
                            <Link href={route('experiences.index', { locale: locale })} className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                                {__('View All')} <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {(experiences || []).length > 0 ? (experiences || []).slice(0, 3).map((exp) => (
                                <Link 
                                    key={exp.id} 
                                    href={route('experiences.show', { locale: locale, experience: exp.slug })}
                                    className="group flex items-center justify-between p-4 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform">
                                            {exp.type === 'work' ? <Briefcase className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{exp.role}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{exp.company_or_event_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="hidden sm:flex flex-col items-end mr-2">
                                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">{__('Stories')}</span>
                                            <span className="text-[11px] font-bold text-foreground">{exp.updates_count || 0}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-3xl">{__('No experiences listed yet.')}</p>
                            )}
                        </div>
                    </div>

                    {/* ── Marketplace Section ── */}
                    <div className="mb-14">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                    <ShoppingBag className="w-4 h-4" />
                                </div>
                                <Typography variant="h3" className="text-lg font-black tracking-tight">{__('Marketplace')}</Typography>
                            </div>
                            <Link href={route('marketplace.index', { locale: locale })} className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                                {__('Explore')} <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {(marketplaceItems || []).length > 0 ? (marketplaceItems || []).slice(0, 4).map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={route('marketplace.show', { locale: locale, marketplaceItem: item.slug })}
                                    className="group relative bg-muted/20 border border-border/50 rounded-3xl overflow-hidden hover:bg-muted/40 transition-all active:scale-[0.98]"
                                >
                                    <div className="aspect-[4/3] bg-muted/50 relative overflow-hidden">
                                        {item.image_path ? (
                                            <img 
                                                src={item.image_cropped_path || item.image_path || ''} 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                                loading="lazy" 
                                                decoding="async" 
                                                width="200" 
                                                height="150" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm ${item.status === 'baru' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                                {__(item.status === 'baru' ? 'New' : 'Second')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">{item.name}</p>
                                        <p className="text-[11px] font-black text-foreground/80">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0
                                            }).format(item.price ?? 0)}
                                        </p>
                                    </div>
                                </Link>
                            )) : (
                                <div className="col-span-2 text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-3xl">{__('Coming soon.')}</div>
                            )}
                        </div>
                    </div>



                    <div className="mt-16 text-center">
                        <Link href={route('contact', { locale: locale })}>
                            <button className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-8 py-3 text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-foreground/10 active:scale-95">
                                {__('CONTACT ME')} <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </Link>
                    </div>

                </Container>
            </div>

            {/* Aesthetic Background Decoration */}
            <div className="fixed top-1/2 -right-20 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/3 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-0 -left-20 w-60 h-60 rounded-full bg-blue-500/3 blur-[100px] pointer-events-none z-0"></div>

        </AppLayout>
    );
}
