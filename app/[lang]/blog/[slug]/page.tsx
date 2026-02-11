import { getPostBySlug } from '../data-access';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import BlogContentClient from './BlogContentClient';
import Image from 'next/image';
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from '@/get-dictionary';
import { getAllPosts } from "../data-access";

type Props = {
    params: Promise<{ slug: string, lang: Locale }>;
};

import { RouteTranslator } from '@/components/I18nContext';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
    const params: { lang: string; slug: string }[] = [];

    for (const locale of i18n.locales) {
        const posts = await getAllPosts(locale);
        posts.forEach((post) => {
            params.push({
                lang: locale,
                slug: post.slug, // Her yazı için slug'ı buraya bildiriyoruz
            });
        });
    }

    return params;
  }

export async function generateMetadata({
    params,
}: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const dict = await getDictionary(lang);
    const post = await getPostBySlug(lang, slug, dict.blog.readingTime);

    if (!post) return {};

    // Hreflang alternates: Her dil için o dildeki slug'ı kullanarak link oluşturuyoruz.
    const languages: Record<string, string> = {};
    Object.entries(post.slugs).forEach(([locale, s]) => {
        languages[locale] = `/${locale}/blog/${s}`;
    });

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `/${lang}/blog/${slug}`,
            languages: languages,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://fethiyetango.com/${lang}/blog/${slug}`,
            images: [post.image],
            type: 'article',
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, lang } = await params;
    const dict = await getDictionary(lang);
    const post = await getPostBySlug(lang, slug, dict.blog.readingTime);

    if (!post) notFound();

    const htmlContent = await marked.parse(post.content);

    // Başlıkları ayıklama
    const h2Regex = /^##\s+(.*$)/gm;
    const headings: { id: string; text: string }[] = [];
    let match;
    while ((match = h2Regex.exec(post.content)) !== null) {
        const text = match[1];
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text });
    }

    let processedHtml = htmlContent;
    headings.forEach(h => {
        const pattern = new RegExp(`<h2>${h.text}</h2>`, 'g');
        processedHtml = processedHtml.replace(pattern, `<h2 id="${h.id}">${h.text}</h2>`);
    });

    return (
        <main className="min-h-screen pt-32 pb-20">
            {/* SEO Slug Köprüsü */}
            <RouteTranslator slugs={post.slugs} />
            <JsonLd type="Article" data={post} lang={lang} />
            <JsonLd
                type="BreadcrumbList"
                lang={lang}
                data={{
                    items: [
                        { name: dict.navigation.home, url: `/${lang}` },
                        { name: dict.navigation.blog, url: `/${lang}/blog` },
                        { name: post.title, url: `/${lang}/blog/${slug}` },
                    ]
                }}
            />

            {/* 1. HERO SECTION: Abrazo Atmosferi */}
            <div className="relative h-[60vh] w-full overflow-hidden border-b border-white/5">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover grayscale opacity-50"
                />
                <div className="absolute inset-0 bg-linear-to-t from-tango-black via-tango-black/20 to-transparent" />
                <div className="absolute bottom-16 left-0 w-full px-6">
                    <div className="container mx-auto max-w-5xl">
                        <div className="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-tango-gold">
                            <span>{post.date}</span>
                            <span className="h-1 w-1 rounded-full bg-tango-gold/30"></span>
                            <span>{post.readingTime}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.95] text-white max-w-5xl">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6 pt-20">
                {/* 2. SOL: Client-Side Navigation & Beam (Client Component'e devrediyoruz) */}
                <BlogContentClient
                    slug={slug}
                    htmlContent={processedHtml}
                    headings={headings}
                    ctaContent={dict.blog.cta}
                />
            </div>
        </main>
    );
}