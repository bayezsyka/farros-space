import React from 'react';
import { Head } from '@inertiajs/react';
import { Download, ArrowLeft } from 'lucide-react';

interface Profile {
    full_name?: string;
    headline?: string;
    email?: string;
    phone?: string;
    address?: string;
    bio?: string;
    birth_place?: string;
    birth_date?: string;
    avatar_url?: string;
}

interface EducationItem {
    id: number;
    level: string;
    institution: string;
    program_major: string | null;
    start_year: string;
    end_year?: string;
    sort_order: number;
}

interface Props {
    profile: Profile | null;
    education: EducationItem[];
}

// ─── Reusable styled section header (bold, uppercase, underlined) ───────────
function SectionHeader({ title }: { title: string }) {
    return (
        <div style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: '11pt',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
            borderBottom: '1.5px solid #000',
            paddingBottom: '2px',
            marginTop: '12px',
            marginBottom: '6px',
            color: '#000',
        }}>
            {title}
        </div>
    );
}

// ─── Main CV content - shared between screen preview and print ───────────────
function CVContent({ profile, education }: { profile: Profile | null; education: EducationItem[] }) {
    const name = profile?.full_name || 'Nama Lengkap';
    const headline = profile?.headline || '';
    const email = profile?.email || '';
    const phone = profile?.phone || '';
    const address = profile?.address || '';
    const bio = profile?.bio || '';

    // Build contact line: "Address | P: Phone | Email"
    const contactParts: string[] = [];
    if (address) contactParts.push(address);
    if (phone) contactParts.push(`${phone}`);
    if (email) contactParts.push(email);
    const contactLine = contactParts.join('  |  ');

    const baseStyle: React.CSSProperties = {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: '10.5pt',
        color: '#000',
        lineHeight: '1.4',
        width: '100%',
    };

    return (
        <div style={baseStyle}>

            {/* ══════════ HEADER ══════════ */}
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                <div style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: '18pt',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    lineHeight: '1.2',
                    color: '#000',
                }}>
                    {name}
                </div>

                {headline && (
                    <div style={{
                        fontSize: '10.5pt',
                        fontWeight: 400,
                        color: '#222',
                        marginTop: '2px',
                    }}>
                        {headline}
                    </div>
                )}

                {contactLine && (
                    <div style={{
                        fontSize: '9.5pt',
                        color: '#111',
                        marginTop: '3px',
                        lineHeight: '1.4',
                    }}>
                        {contactLine}
                    </div>
                )}
            </div>

            {/* ══════════ RINGKASAN ══════════ */}
            {bio && (
                <>
                    <SectionHeader title="Ringkasan" />
                    <p style={{ margin: '0 0 4px', textAlign: 'justify', fontSize: '10pt', color: '#000', lineHeight: '1.45' }}>
                        {bio}
                    </p>
                </>
            )}

            {/* ══════════ PENDIDIKAN ══════════ */}
            {education.length > 0 && (
                <>
                    <SectionHeader title="Pendidikan" />
                    <div>
                        {education.map((edu) => (
                            <div key={edu.id} style={{ marginBottom: '6px' }}>
                                {/* Institution name (bold) + year on the right */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: 700, fontSize: '10.5pt' }}>
                                        {edu.institution}
                                    </span>
                                    <span style={{ fontSize: '10pt', whiteSpace: 'nowrap', paddingLeft: '12px' }}>
                                        {edu.start_year} – {edu.end_year === 'now' ? 'Sekarang' : (edu.end_year || 'Sekarang')}
                                    </span>
                                </div>
                                {/* Major - only if present and hide level prefix for school levels */}
                                {edu.program_major && (
                                    <div style={{ fontStyle: 'italic', fontSize: '10pt', color: '#111' }}>
                                        {['SD', 'SMP', 'SMA', 'SMK'].includes(edu.level)
                                            ? edu.program_major
                                            : `${edu.level} – ${edu.program_major}`}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}

// ─── Page component ──────────────────────────────────────────────────────────
export default function CVIndex({ profile, education }: Props) {
    const name = profile?.full_name || 'CV';

    return (
        <>
            <Head title={`CV – ${name}`} />

            {/* ── SIMPLE FLOATING ACTIONS (hidden on print) ── */}
            <div className="no-print" style={{
                position: 'fixed', bottom: '32px', right: '32px', zIndex: 100,
                display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end'
            }}>
                <a href="/" style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#fff', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '12px',
                    padding: '10px 16px', fontSize: '14px', fontWeight: 600,
                    fontFamily: 'sans-serif', textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s'
                }}>
                    <ArrowLeft size={18} /> Beranda
                </a>
                <button
                    onClick={() => window.print()}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: '#111827', color: '#fff', border: 'none', borderRadius: '12px',
                        padding: '12px 24px', fontSize: '15px', fontWeight: 600,
                        fontFamily: 'sans-serif', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Download size={18} /> Download
                </button>
            </div>

            {/* ── Screen preview wrapper (no margins, full width) ── */}
            <div className="no-print" style={{
                minHeight: '100vh',
                background: '#f3f4f6',
                padding: '24px 12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflowX: 'hidden'
            }}>
                {/* Paper simulation - Fully responsive on mobile */}
                <div style={{
                    width: '100%',
                    maxWidth: '210mm',
                    minHeight: '297mm',
                    background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                    padding: 'clamp(10mm, 5vw, 15mm) clamp(10mm, 6vw, 18mm)',
                    boxSizing: 'border-box',
                    borderRadius: '2px',
                    margin: '0 auto'
                }}>
                    <CVContent profile={profile} education={education} />
                </div>
            </div>

            {/* ── Print-only layer ── */}
            <div className="print-only">
                <CVContent profile={profile} education={education} />
            </div>

            {/* ── Global print styles ── */}
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 15mm 18mm 15mm 18mm;
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                }

                @media screen and (max-width: 640px) {
                    .no-print {
                        padding: 10px 5px !important;
                    }
                }

                .print-only {
                    display: none;
                }
            `}</style>
        </>
    );
}
