import type { MetadataRoute } from "next";
import { getAllPosts } from "./[lang]/blog/data-access";
import { i18n } from "../i18n-config";

const BASE_URL = "https://fethiyetango.com";

const staticRoutes = [
  "",
  "/program",
  "/trainers",
  "/atolye",
  "/blog",
  "/iletisim",
] as const;

function buildLocalizedPaths(route: string) {
  return Object.fromEntries(
    i18n.locales.map((locale) => [
      locale,
      `${BASE_URL}/${locale}${route}`,
    ]),
  );
}

function buildBlogLocalizedPaths(slugs: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(slugs)
      .filter(([locale]) => i18n.locales.includes(locale as (typeof i18n.locales)[number]))
      .map(([locale, slug]) => [
        locale,
        `${BASE_URL}/${locale}/blog/${slug}`,
      ]),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const lang of i18n.locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${lang}${route}`,
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: buildLocalizedPaths(route),
        },
      });
    }

    const posts = await getAllPosts(lang);

    for (const post of posts) {
      sitemapEntries.push({
        url: `${BASE_URL}/${lang}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.date,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: buildBlogLocalizedPaths(post.slugs),
        },
      });
    }
  }

  return sitemapEntries;
}
