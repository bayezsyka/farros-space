import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

interface AdminPageHeaderProps {
    /** Title utama halaman */
    title: string;
    /** Deskripsi singkat di bawah title (opsional) */
    description?: string;
    /** Icon di sebelah kiri title (opsional) */
    icon?: ReactNode;
    /** Jika ada parent page, tampilkan back button ke route ini */
    backHref?: string;
    /** Label untuk back button */
    backLabel?: string;
    /** Elemen action di kanan (tombol, link, dll) (opsional) */
    action?: ReactNode;
}

/**
 * Komponen header halaman admin yang konsisten.
 * Digunakan sebagai konten utama di bawah DashboardLayout header.
 */
export function AdminPageHeader({
    title,
    description,
    icon,
    backHref,
    backLabel,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-start gap-3 w-full sm:w-auto min-w-0">
                {backHref && (
                    <Link href={backHref} className="mt-0.5 shrink-0">
                        <div className="w-8 h-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                    </Link>
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                        {icon && (
                            <div className="shrink-0 text-zinc-500 dark:text-zinc-400">
                                {icon}
                            </div>
                        )}
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}

/**
 * Tombol aksi primer standar untuk AdminPageHeader.
 */
interface AdminActionButtonProps {
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
    children: ReactNode;
}

export function AdminActionButton({ href, onClick, icon, children }: AdminActionButtonProps) {
    const cls = "inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm";

    if (href) {
        return (
            <Link href={href}>
                <button className={cls} type="button">
                    {icon}
                    {children}
                </button>
            </Link>
        );
    }

    return (
        <button className={cls} type="button" onClick={onClick}>
            {icon}
            {children}
        </button>
    );
}
