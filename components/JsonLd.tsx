import { type Locale } from "../i18n-config";
import { getDictionary } from "../get-dictionary";

type JsonLdProps = {
    lang: Locale;
    type?: 'DanceSchool' | 'Article' | 'BreadcrumbList';
    data?: any;
};

export default async function JsonLd({ lang, type = 'DanceSchool', data }: JsonLdProps) {
    const dict = await getDictionary(lang);

    let jsonLd: any = {};

    if (type === 'DanceSchool') {
        jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'DanceSchool',
            name: dict.seo.title,
            description: dict.seo.description,
            image: 'https://fethiyetango.com/icon.png',
            '@id': 'https://fethiyetango.com',
            url: `https://fethiyetango.com/${lang}`,
            telephone: '+905446415745',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Foça, 1304. Sk. No:22',
                addressLocality: 'Fethiye',
                postalCode: '48300',
                addressCountry: 'TR',
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: 36.660506,
                longitude: 29.111682,
            },
            openingHoursSpecification: [
                {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '09:00',
                    closes: '23:00',
                }
            ],
            sameAs: [
                'https://www.instagram.com/fethiyetangokulubu/',
                'https://www.facebook.com/profile.php?id=61583589983881',
            ],
        };
    } else if (type === 'Article' && data) {
        jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://fethiyetango.com/${lang}/blog/${data.slug}`,
            },
            description: data.excerpt,
            image: `https://fethiyetango.com${data.image}`,
            datePublished: data.date,
            dateModified: data.updatedAt || data.date,
            author: {
                '@type': 'Organization',
                name: 'Fethiye Tango Kulübü',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Fethiye Tango Kulübü',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://fethiyetango.com/icon.png',
                },
            },
        };
    } else if (type === 'BreadcrumbList' && data) {
        jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: data.items.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: `https://fethiyetango.com${item.url}`,
            })),
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
