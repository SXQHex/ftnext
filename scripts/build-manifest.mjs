import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'app/[lang]/blog/content');
const locales = ['tr', 'en', 'ru', 'uk', 'es'];
const manifest = {};
const postsByOrigin = new Map();

console.log('🚀 Blog manifesti hazırlanıyor...');

function fail(message) {
    throw new Error(`Blog manifest validation failed: ${message}`);
}

try {
    for (const lang of locales) {
        const langDir = path.join(contentDir, lang);

        if (!fs.existsSync(langDir)) {
            fail(`locale klasörü bulunamadı: ${lang}`);
        }

        const files = fs.readdirSync(langDir).filter(file => file.endsWith('.md'));
        const seenSlugs = new Set();

        manifest[lang] = files.map(file => {
            const fullPath = path.join(langDir, file);
            const relativePath = path.relative(process.cwd(), fullPath);
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContent);

            if (typeof data.originSlug !== 'string' || !data.originSlug.trim()) {
                fail(`originSlug eksik: ${relativePath}`);
            }

            if (typeof data.slug !== 'string' || !data.slug.trim()) {
                fail(`slug eksik: ${relativePath}`);
            }

            const originSlug = data.originSlug.trim();
            const slug = data.slug.trim();

            if (seenSlugs.has(slug)) {
                fail(`aynı locale içinde duplicate slug: ${lang}/${slug}`);
            }
            seenSlugs.add(slug);

            if (!postsByOrigin.has(originSlug)) {
                postsByOrigin.set(originSlug, new Map());
            }

            const translations = postsByOrigin.get(originSlug);

            if (translations.has(lang)) {
                fail(`aynı locale içinde duplicate originSlug: ${originSlug} (${lang})`);
            }

            const post = {
                slug,
                originSlug,
                title: data.title,
                path: relativePath,
            };

            translations.set(lang, post);
            return post;
        });
    }

    for (const [originSlug, translations] of postsByOrigin) {
        const missingLocales = locales.filter(locale => !translations.has(locale));

        if (missingLocales.length > 0) {
            fail(
                `"${originSlug}" translation grubu eksik locale içeriyor: ${missingLocales.join(', ')}`
            );
        }
    }

    for (const lang of locales) {
        manifest[lang] = manifest[lang].map(post => {
            const translations = postsByOrigin.get(post.originSlug);
            const slugs = {};

            for (const locale of locales) {
                slugs[locale] = translations.get(locale).slug;
            }

            return { ...post, slugs };
        });
    }

    fs.writeFileSync(
        path.join(process.cwd(), 'app/[lang]/blog/posts-manifest.json'),
        JSON.stringify(manifest, null, 2)
    );

    console.log(
        `✅ posts-manifest.json başarıyla oluşturuldu! ${postsByOrigin.size} yazı / ${locales.length} dil doğrulandı.`
    );
} catch (error) {
    console.error('❌ Manifest oluşturulurken hata:', error);
    process.exit(1);
}
