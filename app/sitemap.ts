import type { MetadataRoute } from 'next'
import { getAllPosts } from './[lang]/blog/data-access'
import { i18n } from '../i18n-config'

const trMonths: { [key: string]: number } = {
    'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
    'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
};

function parseTurkishDate(dateStr: string): Date {
    try {
        if (!dateStr || typeof dateStr !== 'string') {
            return new Date();
        }
        const parts = dateStr.split(' ');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const monthStr = parts[1];
            const year = parseInt(parts[2]);

            const month = trMonths[monthStr];
            if (month !== undefined && !isNaN(day) && !isNaN(year)) {
                const date = new Date(year, month, day, 12, 0, 0);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }
        const fallback = new Date(dateStr);
        return isNaN(fallback.getTime()) ? new Date() : fallback;
    } catch (e) {
        return new Date();
    }
}

function safeDate(dateStr: string, isTurkish: boolean): Date {
    try {
        const date = isTurkish ? parseTurkishDate(dateStr) : new Date(dateStr);
        if (isNaN(date.getTime())) {
            return new Date();
        }
        return date;
    } catch {
        return new Date();
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://fethiyetango.com'
    const locales = i18n.locales;

    const staticRoutes = [
        '',
        '/program',
        '/trainers',
        '/atolye',
        '/blog',
        '/iletisim',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    for (const lang of locales) {
        // Static Routes
        for (const route of staticRoutes) {
            const languages: Record<string, string> = {};
            locales.forEach(l => {
                languages[l] = `${baseUrl}/${l}${route}`;
            });

            sitemapEntries.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: route === '' ? 1 : 0.8,
                alternates: {
                    languages: languages,
                }
            });
        }

        // Blog Posts for this lang
        const posts = await getAllPosts(lang);
        for (const post of posts) {
            const languages: Record<string, string> = {};
            // Post içindeki slugs haritasını kullanarak bütün dillerdeki linkleri ekliyoruz.
            Object.entries(post.slugs).forEach(([l, s]) => {
                languages[l] = `${baseUrl}/${l}/blog/${s}`;
            });

            sitemapEntries.push({
                url: `${baseUrl}/${lang}/blog/${post.slug}`,
                lastModified: safeDate(post.date, lang === 'tr'),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: {
                    languages: languages,
                }
            });
        }
    }

    return sitemapEntries;
}
