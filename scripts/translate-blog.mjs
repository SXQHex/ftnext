import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { translate } from 'google-translate-api-x';

const CONTENT_DIR = path.join(process.cwd(), 'app/[lang]/blog/content');
const SOURCE_LANG = 'tr';
const TARGET_LANGS = ['en', 'ru', 'uk', 'es'];

// Maksimum karakter limiti (API güvenliği için)
const MAX_CHUNK_SIZE = 3000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Ayrıştır (Türkçe karakterler için)
        .replace(/[\u0300-\u036f]/g, '') // Aksanları kaldır
        .replace(/\s+/g, '-') // Boşlukları - yap
        .replace(/[^\w\u0400-\u04FF-]+/g, '') // Alfanümerik ve Kiril karakterleri koru
        .replace(/--+/g, '-') // Çift -- ları temizle
        .replace(/^-+|-+$/g, ''); // Baştaki ve sondaki - ları temizle
}

async function translateText(text, targetLang) {
    if (!text || text.trim() === '') return '';
    try {
        await sleep(500); // 500ms delay between requests
        const res = await translate(text, { from: SOURCE_LANG, to: targetLang });
        return res.text;
    } catch (error) {
        console.error(`Translation error (${targetLang}):`, error.message);
        return text; // Fallback to source
    }
}

/**
 * İçeriği paragraflara böler ve limitler dahilinde çevirir.
 * Markdown yapısını bozmamaya çalışır.
 */
async function translateLargeContent(content, targetLang) {
    const paragraphs = content.split('\n');
    let translatedParagraphs = [];
    let currentChunk = "";

    for (const p of paragraphs) {
        // Eğer paragraf tek başına çok büyükse (nadiren olur) veya mevcut chunk dolduysa
        if ((currentChunk.length + p.length) > MAX_CHUNK_SIZE) {
            if (currentChunk.length > 0) {
                translatedParagraphs.push(await translateText(currentChunk, targetLang));
                currentChunk = "";
            }

            // Paragrafın kendisi devasa ise onu da böl
            if (p.length > MAX_CHUNK_SIZE) {
                // Basitçe cümle bazlı bölme (noktadan sonra)
                const sentences = p.split(/(?<=[.!?])\s+/);
                let sentenceChunk = "";
                for (const s of sentences) {
                    if ((sentenceChunk.length + s.length) > MAX_CHUNK_SIZE) {
                        translatedParagraphs.push(await translateText(sentenceChunk, targetLang));
                        sentenceChunk = s;
                    } else {
                        sentenceChunk += (sentenceChunk ? " " : "") + s;
                    }
                }
                if (sentenceChunk) currentChunk = sentenceChunk;
            } else {
                currentChunk = p;
            }
        } else {
            currentChunk += (currentChunk ? "\n" : "") + p;
        }
    }

    if (currentChunk) {
        translatedParagraphs.push(await translateText(currentChunk, targetLang));
    }

    return translatedParagraphs.join('\n');
}

async function translatePost(fileName) {
    const sourcePath = path.join(CONTENT_DIR, SOURCE_LANG, fileName);
    const sourceContent = await fs.readFile(sourcePath, 'utf8');
    const { data: sourceData, content: sourceBody } = matter(sourceContent);

    const originSlug = sourceData.originSlug || fileName.replace('.md', '');
    const slugMap = { [SOURCE_LANG]: originSlug };

    const translations = {};

    for (const lang of TARGET_LANGS) {
        console.log(`[+] Translating ${fileName} to ${lang}...`);

        // Frontmatter çevirisi
        const translatedData = { ...sourceData, originSlug };
        if (sourceData.title) translatedData.title = await translateText(sourceData.title, lang);
        if (sourceData.excerpt) translatedData.excerpt = await translateText(sourceData.excerpt, lang);
        if (sourceData.date) translatedData.date = await translateText(sourceData.date, lang);

        if (sourceData.metaTitle) translatedData.metaTitle = await translateText(sourceData.metaTitle, lang);
        if (sourceData.metaDescription) translatedData.metaDescription = await translateText(sourceData.metaDescription, lang);
        if (sourceData.keywords) translatedData.keywords = await translateText(sourceData.keywords, lang);

        // Markdown gövde çevirisi - Chunk bazlı
        const translatedContent = await translateLargeContent(sourceBody, lang);

        // SEO dostu slug oluştur
        const localizedSlug = slugify(translatedData.title || originSlug);
        slugMap[lang] = localizedSlug;

        translations[lang] = {
            data: translatedData,
            content: translatedContent,
            slug: localizedSlug
        };
    }

    // Şimdi tüm dilleri (TR dahil) tam slug haritasıyla kaydet
    for (const lang of [SOURCE_LANG, ...TARGET_LANGS]) {
        const targetDir = path.join(CONTENT_DIR, lang);
        await fs.mkdir(targetDir, { recursive: true });

        const langData = lang === SOURCE_LANG
            ? { ...sourceData, originSlug, slugs: slugMap }
            : { ...translations[lang].data, slugs: slugMap };

        const langBody = lang === SOURCE_LANG ? sourceBody : translations[lang].content;
        const langSlug = slugMap[lang];
        const targetPath = path.join(targetDir, `${langSlug}.md`);

        const result = matter.stringify(langBody, langData);
        await fs.writeFile(targetPath, result, 'utf8');
    }
}

async function main() {
    try {
        const sourceDir = path.join(CONTENT_DIR, SOURCE_LANG);
        const files = await fs.readdir(sourceDir);
        const mdFiles = files.filter(f => f.endsWith('.md'));

        console.log(`Found ${mdFiles.length} posts in Turkish. Starting high-quality translation...`);

        for (const file of mdFiles) {
            await translatePost(file);
        }

        console.log('DONE: All high-quality translations completed.');
    } catch (error) {
        console.error('Main process error:', error);
    }
}

main();
