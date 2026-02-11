import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import rawManifest from '@/posts-manifest.json'; // 🚀 Manifesti en tepede içeri al

const POSTS_DIRECTORY = path.join(process.cwd(), 'app/[lang]/blog/content');
const postsManifest = rawManifest as BlogManifest;
// Tip tanımın aynı kalabilir

interface ManifestEntry {
    slug: string;
    originSlug: string;
    path: string;
    title: string;
    slugs: Record<string, string>;
  }
interface BlogManifest {
    [locale: string]: ManifestEntry[] | undefined;
  }

export interface BlogPost {
    slug: string;
    originSlug: string;
    slugs: Record<string, string>;
    title: string;
    date: string;
    excerpt: string;
    image: string;
    content: string;
    readingTime: string;
    category?: string;
}

/**
 * ARTIK DİZİN TARAMASINA SON!
 * Manifest zaten hangi dilde hangi post var biliyor.
 */
export const getAllPosts = cache(async (lang: string, readingTimeLabel: string = "dk okuma"): Promise<BlogPost[]> => {
    // 1. Manifestten sadece ilgili dildeki yazıları filtrele
    const langPosts = postsManifest[lang] || [];

    const posts = await Promise.all(
        langPosts.map(async (entry: ManifestEntry) => {
            // entry.path zaten manifest içinde tam yol olarak var!
            const fullPath = path.join(process.cwd(), entry.path);
            const fileContents = await fs.readFile(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                ...data,
                slug: entry.slug,
                originSlug: entry.originSlug,
                slugs: entry.slugs, // Manifest bu haritayı zaten build öncesi çıkardı!
                content,
                readingTime: calculateReadingTime(content, readingTimeLabel),
            } as BlogPost;
        })
    );

    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
});

/**
 * TEKİL YAZI GETİRİCİ: Işık hızında nokta atışı
 */
export const getPostBySlug = cache(async (lang: string, slug: string, readingTimeLabel: string = "dk okuma"): Promise<BlogPost | null> => {
    // 1. Önce o dile ait listeyi güvenli bir şekilde alalım
    const langPosts = postsManifest[lang];

    // Evham Kontrolü 1: Liste hiç yoksa (undefined ise) hemen çık
    if (!langPosts) return null;

    // 2. Şimdi bu liste içinde slug'ı arayalım
    // Not: ManifestEntry tipini yukarıda tanımladığını varsayıyorum
    const entry = langPosts.find((p: ManifestEntry) => p.slug === slug);

    // Evham Kontrolü 2: Yazı bulunamadıysa çık
    if (!entry) return null;

    try {
        // Göreceli yolu tam yola çevir
        const fullPath = path.join(process.cwd(), entry.path);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            ...data,
            slug: entry.slug,
            originSlug: entry.originSlug,
            slugs: entry.slugs,
            content,
            readingTime: calculateReadingTime(content, readingTimeLabel),
        } as BlogPost;
    } catch (error) {
        console.error(`Dosya okuma hatası: ${slug}`, error);
        return null;
    }
});

// Yardımcı fonksiyonun aynı kalabilir
function calculateReadingTime(text: string, readingTimeLabel: string): string {
    const wordsPerMinute = 225;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} ${readingTimeLabel}`;
}