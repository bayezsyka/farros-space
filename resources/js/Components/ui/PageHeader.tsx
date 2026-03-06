import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, ChevronRight } from 'lucide-react';
import { Container } from './Container';

// ── Types ────────────────────────────────────────────────────────────────────

export interface PageHeaderStat {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
}

export interface PageHeaderBreadcrumb {
    label: string;
    href?: string;
}

export interface PageHeaderProps {
    /** Small pill badge above the title */
    badge?: {
        icon: React.ComponentType<{ className?: string }>;
        label: string;
    };
    /** Page title — can be a string or JSX (for line breaks, coloured words, etc.) */
    title: React.ReactNode;
    /** Optional subtitle/description below the title */
    subtitle?: React.ReactNode;
    /** Optional stats row */
    stats?: PageHeaderStat[];
    /** Breadcrumb trail. First item is always Home. */
    breadcrumbs?: PageHeaderBreadcrumb[];
    /** Optional right-side slot (extra buttons, search, etc.) */
    actions?: React.ReactNode;
    /** Extra vertical padding override (default: "py-10 md:py-12") */
    className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PageHeader({
    badge,
    title,
    subtitle,
    stats,
    breadcrumbs,
    actions,
    className = '',
}: PageHeaderProps) {
    return (
        <section className="relative border-b bg-background overflow-hidden">
            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                        linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Ambient blob */}
            <div className="absolute -top-24 -right-24 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <Container className={`relative py-10 md:py-12 ${className}`}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">

                    {/* ── Left: breadcrumb + badge + title + subtitle ── */}
                    <div className="flex-1 min-w-0">

                        {/* Breadcrumb */}
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 flex-wrap">
                                <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Home</span>
                                </Link>
                                {breadcrumbs.map((crumb, i) => (
                                    <React.Fragment key={i}>
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                                        {crumb.href && i < breadcrumbs.length - 1 ? (
                                            <Link href={crumb.href} className="hover:text-foreground transition-colors">
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-foreground font-medium">{crumb.label}</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}

                        {/* Badge */}
                        {badge && (
                            <div className="inline-flex items-center gap-2 border border-border bg-muted/50 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                <badge.icon className="w-3.5 h-3.5" />
                                {badge.label}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                            {title}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-lg">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* ── Right: stats or actions ── */}
                    {(stats || actions) && (
                        <div className="flex flex-col items-start sm:items-end gap-4 flex-shrink-0">
                            {/* Custom actions slot */}
                            {actions && <div>{actions}</div>}

                            {/* Stats */}
                            {stats && stats.length > 0 && (
                                <div className="flex items-center gap-5 sm:gap-6">
                                    {stats.map((stat) => (
                                        <div key={stat.label} className="flex items-center gap-2.5">
                                            <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center flex-shrink-0">
                                                <stat.icon className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-foreground leading-none">{stat.value}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </section>
    );
}
