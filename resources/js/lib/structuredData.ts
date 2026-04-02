
import { SITE_NAME, getAbsoluteUrl } from './seo';

export function createWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": getAbsoluteUrl(),
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${getAbsoluteUrl()}marketplace?search={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };
}

export function createPersonJsonLd(profile: any) {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": profile?.full_name || "Farros",
        "url": getAbsoluteUrl(),
        "jobTitle": profile?.headline || "Web Developer",
        "description": profile?.bio || "Personal digital space of Farros.",
        "sameAs": [
            // Can be populated from social links if needed
        ]
    };
}

export function createProductJsonLd(item: any, locale: string) {
    const name = locale === 'en' ? (item.name_en || item.name) : (item.name_id || item.name);
    const description = locale === 'en' ? (item.description_en || item.description) : (item.description_id || item.description);
    
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "image": [
            getAbsoluteUrl(item.image_path)
        ],
        "description": description,
        "sku": `MARKET-${item.id}`,
        "offers": {
            "@type": "Offer",
            "url": getAbsoluteUrl(`${locale}/marketplace/${item.slug}`),
            "priceCurrency": "IDR",
            "price": item.price,
            "itemCondition": item.status === 'baru' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
            "availability": "https://schema.org/InStock"
        }
    };
}

export function createBreadcrumbJsonLd(items: { name: string, url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": getAbsoluteUrl(item.url)
        }))
    };
}

export function createArticleJsonLd(article: any, type: string = 'Article', locale: string) {
    const title = locale === 'en' ? (article.title_en || article.title) : (article.title_id || article.title);
    
    return {
        "@context": "https://schema.org",
        "@type": type,
        "headline": title,
        "datePublished": article.created_at,
        "dateModified": article.updated_at || article.created_at,
        "author": {
            "@type": "Person",
            "name": "Farros",
            "url": getAbsoluteUrl()
        }
    };
}

export function createDiscussionForumPostingJsonLd(thread: any, profile: any) {
    return {
        "@context": "https://schema.org",
        "@type": "DiscussionForumPosting",
        "headline": thread.content.substring(0, 100),
        "articleBody": thread.content,
        "datePublished": thread.created_at,
        "author": {
            "@type": "Person",
            "name": thread.user?.name || profile?.full_name || "Guest",
        },
        "interactionStatistic": [
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": thread.likes_count
            },
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction",
                "userInteractionCount": thread.comments_count
            }
        ]
    };
}
