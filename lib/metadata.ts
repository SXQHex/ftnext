import type { Metadata } from "next";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { getPostBySlug } from "@/app/[lang]/blog/data-access";

export const DEFAULT_BASE = "https://fethiyetango.com";
export const SITE_NAME = "Fethiye Tango Kulübü";

export const ogLocales: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  ru: "ru_RU",
  uk: "uk_UA",
  es: "es_ES",
};

export type PageParams = Promise<{ lang: Locale; slug?: string }>;
export type AlternateSlugs = Partial<Record<Locale, string>>;

function buildPath(locale: Locale, section: string, slug?: string) {
  const normalizedSection = section === "/"
    ? ""
    : "/" + section.replace(/^\//, "").replace(/\/$/, "");

  return "/" + locale + normalizedSection + (slug ? "/" + slug : "");
}

function buildAlternates(
  lang: Locale,
  section: string,
  slug?: string,
  alternateSlugs?: AlternateSlugs,
) {
  const languages = Object.fromEntries(
    i18n.locales.map((locale) => [
      locale,
      buildPath(locale, section, alternateSlugs?.[locale] ?? slug),
    ]),
  );

  const canonical = buildPath(
    lang,
    section,
    alternateSlugs?.[lang] ?? slug,
  );

  return { canonical, languages };
}

export async function generatePageMetadata({
  params,
  section,
  title,
  description,
  alternateSlugs,
  ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  params: PageParams;
  section: string;
  title: string;
  description: string;
  alternateSlugs?: AlternateSlugs;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const { canonical, languages } = buildAlternates(
    lang,
    section,
    slug,
    alternateSlugs,
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? DEFAULT_BASE;
  const absoluteUrl = new URL(canonical, baseUrl).toString();
  const absoluteImage = ogImage
    ? new URL(ogImage, baseUrl).toString()
    : undefined;

  return {
    title: section === "/" ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      locale: ogLocales[lang],
      type,
      ...(absoluteImage ? { images: [absoluteImage] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
  };
}

export async function getPageMetadata({
  params,
  section,
  ogImage,
}: {
  params: PageParams;
  section: "/" | "/program" | "/trainers" | "/atolye" | "/blog" | "/iletisim";
  ogImage?: string;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const title = section === "/"
    ? dict.seo.title
    : {
        "/program": dict.program.title,
        "/trainers": dict.trainers.title,
        "/atolye": dict.atolye.title,
        "/blog": dict.blog.title,
        "/iletisim": dict.contact.title,
      }[section];

  const description = section === "/"
    ? dict.seo.description
    : {
        "/program": dict.program.seoDescription,
        "/trainers": dict.trainers.seoDescription,
        "/atolye": dict.atolye.seoDescription,
        "/blog": dict.blog.seoDescription,
        "/iletisim": dict.contact.seoDescription,
      }[section];

  return generatePageMetadata({
    params,
    section,
    title,
    description,
    ogImage,
  });
}

export async function getBlogPostMetadata(
  params: PageParams,
): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!slug) return {};

  const dict = await getDictionary(lang);
  const post = await getPostBySlug(lang, slug, dict.blog.readingTime);

  if (!post) return {};

  const alternateSlugs = Object.fromEntries(
    Object.entries(post.slugs).filter(([locale]) =>
      i18n.locales.includes(locale as Locale),
    ),
  ) as AlternateSlugs;

  return generatePageMetadata({
    params,
    section: "/blog",
    title: post.title,
    description: post.excerpt,
    alternateSlugs,
    ogImage: post.image,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
  });
}
