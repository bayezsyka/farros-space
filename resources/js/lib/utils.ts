import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatExperienceDate(startDate: string, endDate: string | null, lang: 'id' | 'en' = 'id') {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const now = new Date();

    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    const presentText = lang === 'id' ? 'Saat ini' : 'Present';

    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

    const startFormatted = start.toLocaleDateString(locale, options);

    if (!end || end > now) {
        return `${startFormatted} - ${presentText}`;
    }

    const endFormatted = end.toLocaleDateString(locale, options);
    return `${startFormatted} - ${endFormatted}`;
}
