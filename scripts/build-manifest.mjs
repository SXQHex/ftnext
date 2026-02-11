// scripts/build-manifest.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'app/[lang]/blog/content');
const locales = ['tr', 'en', 'ru', 'uk', 'es'];
const manifest = {};

console.log('🚀 Blog manifesti hazırlanıyor...');

try {
    locales.forEach(lang => {
        const langDir = path.join(contentDir, lang);
        if (fs.existsSync(langDir)) {
            const files = fs.readdirSync(langDir).filter(f => f.endsWith('.md'));

            manifest[lang] = files.map(file => {
                const fullPath = path.join(langDir, file);
                const relativePath = path.relative(process.cwd(), fullPath);

                const fileContent = fs.readFileSync(fullPath, 'utf8');
                const { data } = matter(fileContent);

                return {
                    slug: file.replace('.md', ''),
                    originSlug: data.originSlug || file.replace('.md', ''),
                    title: data.title, // İstersen arama motoru için başlıkları da buraya ekleyebilirsin
                    path: relativePath, // 🚀 BU EKSİKTİ! data-access'in buna ihtiyacı var.
                };
            });
        }
    });

    Object.keys(manifest).forEach(lang => {
        manifest[lang] = manifest[lang].map(post => {
            const slugs = {};
            locales.forEach(l => {
                const match = manifest[l]?.find(p => p.originSlug === post.originSlug);
                if (match) slugs[l] = match.slug;
            });
            return { ...post, slugs };
        });
    });

    // Manifesti ana dizine yaz
    fs.writeFileSync(
        path.join(process.cwd(), 'posts-manifest.json'),
        JSON.stringify(manifest, null, 2)
    );

    console.log('✅ posts-manifest.json başarıyla oluşturuldu!');
} catch (error) {
    console.error('❌ Manifest oluşturulurken hata:', error);
    process.exit(1);
}