import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SITE_NAME, getAbsoluteUrl, getAlternateLocales, getCanonicalUrl } from '@/lib/seo';

interface SeoHeadProps {
    title?: string;
    description?: string;
    image?: string;
    canonicalPath?: string;
    type?: string;
    robots?: string;
    jsonLd?: object | object[];
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
}

export default function SeoHead({
    title,
    description,
    image,
    canonicalPath,
    type = 'website',
    robots = 'index, follow',
    jsonLd,
    publishedTime,
    modifiedTime,
    author = 'Farros',
}: SeoHeadProps) {
    const { url, props } = usePage<any>();
    const locale = props.locale || 'id';
    
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const metaDescription = description || (locale === 'en' ? 'Personal space of Farros - sharing experiences, thoughts, and curated items.' : 'Ruang digital pribadi Farros - berbagi pengalaman, pemikiran, dan barang pilihan.');
    const canonical = canonicalPath ? getCanonicalUrl(canonicalPath) : getCanonicalUrl(url);
    const alternate = getAlternateLocales(url, locale);
    const ogImage = image ? (image.startsWith('http') ? image : getAbsoluteUrl(image)) : getAbsoluteUrl('images/social-share.jpg');

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} head-key="description" />
            <meta name="robots" content={robots} head-key="robots" />
            <link rel="canonical" href={canonical} head-key="canonical" />
            
            {/* Localized hreflang */}
            <link rel="alternate" hrefLang={locale === 'id' ? 'id-ID' : 'en-US'} href={canonical} head-key="hreflang-current" />
            <link rel="alternate" hrefLang={alternate.hreflang} href={alternate.href} head-key="hreflang-alt" />
            <link rel="alternate" hrefLang="x-default" href={getAbsoluteUrl('id')} head-key="hreflang-default" />

            {/* Open Graph */}
            <meta property="og:site_name" content={SITE_NAME} head-key="og:site_name" />
            <meta property="og:type" content={type} head-key="og:type" />
            <meta property="og:title" content={fullTitle} head-key="og:title" />
            <meta property="og:description" content={metaDescription} head-key="og:description" />
            <meta property="og:url" content={canonical} head-key="og:url" />
            <meta property="og:image" content={ogImage} head-key="og:image" />
            <meta property="og:locale" content={locale === 'id' ? 'id_ID' : 'en_US'} head-key="og:locale" />
            <meta property="og:locale:alternate" content={locale === 'id' ? 'en_US' : 'id_ID'} head-key="og:locale:alternate" />
            
            {publishedTime && <meta property="article:published_time" content={publishedTime} head-key="article:published_time" />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} head-key="article:modified_time" />}
            {author && <meta property="article:author" content={author} head-key="article:author" />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" head-key="twitter:card" />
            <meta name="twitter:title" content={fullTitle} head-key="twitter:title" />
            <meta name="twitter:description" content={metaDescription} head-key="twitter:description" />
            <meta name="twitter:image" content={ogImage} head-key="twitter:image" />

            {/* JSON-LD */}
            {jsonLd && (
                <script type="application/ld+json" head-key="json-ld">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
