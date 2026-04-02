export const SITE_NAME = 'Farros Space';
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://farros.space';

export function getAbsoluteUrl(path: string = '') {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = APP_URL.endsWith('/') ? APP_URL : `${APP_URL}/`;
    return `${url}${cleanPath}`;
}

export function getAlternateLocales(currentPath: string, currentLocale: string) {
    const alternateLocale = currentLocale === 'id' ? 'en' : 'id';
    
    const url = new URL(getAbsoluteUrl(currentPath));
    const segments = url.pathname.split('/').filter(Boolean);
    
    if (segments.length > 0 && (segments[0] === 'id' || segments[0] === 'en')) {
        segments[0] = alternateLocale;
    } else {
        segments.unshift(alternateLocale);
    }
    
    return {
        href: getAbsoluteUrl(segments.join('/') + url.search),
        hreflang: alternateLocale === 'id' ? 'id-ID' : 'en-US',
    };
}

export function getCanonicalUrl(currentPath: string) {
    return getAbsoluteUrl(currentPath.startsWith('/') ? currentPath.slice(1) : currentPath);
}
