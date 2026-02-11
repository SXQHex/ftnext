import { PageHeader } from "@/components/ui/PageHeader";
import { getAllPosts } from "./data-access";
import { ExpandableTangoCard } from "@/components/ui/ExpandableTangoCard";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import JsonLd from "@/components/JsonLd";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.blog;
    const posts = await getAllPosts(lang, content.readingTime);

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8">
            <JsonLd
                type="BreadcrumbList"
                lang={lang}
                data={{
                    items: [
                        { name: dict.navigation.home, url: `/${lang}` },
                        { name: dict.navigation.blog, url: `/${lang}/blog` },
                    ]
                }}
            />
            <div className="container mx-auto max-w-7xl">
                <PageHeader eyebrow={content.eyebrow} title={content.title} />
                {/* Yeni Hibrit Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-start">
                    {posts.map((post, i) => (
                        <ExpandableTangoCard
                            key={post.slug}
                            item={post}
                            isBlog={true}
                            lang={lang}
                            index={i}
                            labels={dict.ui}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}