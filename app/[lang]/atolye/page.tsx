import { PageHeader } from "@/components/ui/PageHeader";
import { ExpandableTangoCard } from "@/components/ui/ExpandableTangoCard";
import { i18n, type Locale } from "../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function AtolyePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.atolye;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8 font-sans">
            <div className="mx-auto max-w-7xl">
                <PageHeader eyebrow={content.eyebrow} title={content.title} />
                {/* Kartlar Grid */}
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {content.themes.map((tema: any, i: number) => (
                        <ExpandableTangoCard
                            key={i}
                            item={tema}
                            index={i}
                            lang={lang}
                            isBlog={false}
                            labels={dict.ui}
                            waMessageTemplate={content.whatsappMessages.book}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
