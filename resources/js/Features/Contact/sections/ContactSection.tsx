import React from 'react';
import { Container } from '@/Components/ui/Container';
import { Section } from '@/Components/ui/Section';
import { Typography } from '@/Components/ui/Typography';
import { Button } from '@/Components/ui/Button';
import { Mail, Phone, MapPin, GraduationCap, ExternalLink, MessageSquare, Home, ArrowRight, Calendar } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface ContactSectionProps {
    profile: {
        full_name?: string;
        email?: string;
        phone?: string;
        birth_place?: string;
        birth_date?: string;
    };
    education: any[];
}

export const ContactSection = ({ profile, education = [] }: ContactSectionProps) => {
    const whatsappNumber = profile.phone?.replace(/^0/, '62').replace(/\D/g, '');
    const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

    // Anti-duplikasi: memastikan riwayat pendidikan tidak muncul ganda
    const uniqueEducation = education.filter((edu, index, self) =>
        index === self.findIndex((t) => (
            t.program_major === edu.program_major && t.institution === edu.institution
        ))
    );

    const birthDate = profile.birth_date
        ? new Date(profile.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <Section spacing="none" className="bg-background">
            {/* ── Hero Banner ── */}
            <div className="relative border-b overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute top-0 right-0 w-96 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <Container className="relative py-12 md:py-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Contact</span>
                    </div>

                    <div className="inline-flex items-center gap-2 border border-border bg-muted/50 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Get in Touch
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.05] mb-3">
                        Hubungi Saya
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-lg">
                        Terbuka untuk proyek baru, kolaborasi kreatif, atau sekadar sapa. Jangan sungkan untuk menghubungi.
                    </p>
                </Container>
            </div>

            {/* ── Main Content ── */}
            <Container className="py-10 md:py-14 lg:py-16">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-6xl">

                    {/* ── Left Column: Contact Info ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Contact Cards */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                Kontak
                            </p>

                            {/* Email */}
                            {profile.email && (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/30 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Email</p>
                                        <p className="text-sm font-semibold text-foreground truncate">{profile.email}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                            )}

                            {/* WhatsApp */}
                            {profile.phone && (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/30 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all text-muted-foreground">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">WhatsApp</p>
                                        <p className="text-sm font-semibold text-foreground">{profile.phone}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                </a>
                            )}

                            {/* Location */}
                            {profile.birth_place && (
                                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Asal</p>
                                        <p className="text-sm font-semibold text-foreground">{profile.birth_place}</p>
                                        {birthDate && (
                                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {birthDate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick message CTA */}
                        <div className="relative bg-foreground text-background rounded-2xl p-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 rounded-full -translate-y-8 translate-x-8" />
                            <div className="relative space-y-3">
                                <p className="text-sm font-bold">Pesan Cepat?</p>
                                <p className="text-xs opacity-70 leading-relaxed">
                                    Respons lebih cepat via WhatsApp. Jangan ragu untuk chat langsung!
                                </p>
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                    <button className="flex items-center gap-2 bg-background text-foreground rounded-xl px-4 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity mt-2">
                                        Chat di WhatsApp
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Education ── */}
                    <div className="lg:col-span-3">
                        <div className="rounded-3xl border border-border bg-card overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-muted/30">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-foreground leading-none mb-1">Riwayat Pendidikan</h2>
                                    <p className="text-xs text-muted-foreground">Educational background</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-6 sm:p-8 space-y-0">
                                {uniqueEducation.length > 0 ? (
                                    uniqueEducation.map((edu, index) => (
                                        <div key={index} className="relative flex gap-6 pb-10 last:pb-0">
                                            {/* Timeline line */}
                                            {index < uniqueEducation.length - 1 && (
                                                <div className="absolute left-[21px] top-12 bottom-0 w-[2px] bg-border/60" />
                                            )}

                                            {/* Timeline dot */}
                                            <div className="relative flex-shrink-0 mt-1">
                                                <div className="w-11 h-11 rounded-2xl border border-border bg-muted/30 flex items-center justify-center z-10">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0 pt-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-bold text-foreground text-lg leading-tight">
                                                            {edu.program_major}
                                                        </h3>
                                                        <p className="text-sm font-medium text-muted-foreground mt-1">
                                                            {edu.institution}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <span className="inline-flex items-center gap-1.5 border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-muted-foreground bg-muted/40">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {edu.start_year} — {edu.end_year}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <GraduationCap className="w-10 h-10 text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground">Belum ada data pendidikan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back to home */}
                        <div className="mt-6 flex justify-end">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <Home className="w-4 h-4" /> Kembali ke Home
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
