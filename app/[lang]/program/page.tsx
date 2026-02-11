import { PageHeader } from "@/components/ui/PageHeader";
import { TangoCard, CardContent } from "@/components/ui/TangoCard";
import { IconCircleCheck, IconBrandWhatsapp } from "@tabler/icons-react";
import { CONTACT_INFO } from "@/lib/constants";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ProgramPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.program;

    // JSON'dan gelen veriyi UI için zenginleştiriyoruz (accent bilgisi vb.)
    const schedules = content.schedule.map((item: any, index: number) => ({
        ...item,
        accent: index === 0 // İlk öğeyi vurgula
    }));

    const handleRegistration = (title: string) => {
        const msg = content.whatsappMessage.replace("{title}", title);
        return CONTACT_INFO.getWaLink(msg);
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8">
            <div className="container mx-auto max-w-7xl">
                <PageHeader eyebrow={content.eyebrow} title={content.title} />
                {/* Kartlar Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {schedules.map((course: any, index: number) => (
                        <TangoCard
                            key={index}
                            index={index}
                            eyebrow={course.eyebrow}
                            title={course.title}
                            description={course.description}
                            accent={course.accent}
                        >
                            <CardContent className="px-0 flex flex-col h-full">
                                <ul className="space-y-4 mb-10">
                                    {course.items.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 group/item">
                                            <IconCircleCheck
                                                size={18}
                                                className="text-tango-red mt-0.5 shrink-0 transition-transform group-hover/item:scale-110"
                                            />
                                            <span className="text-tango-text/70 text-sm font-medium">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Butonu */}
                                <div className="mt-auto">
                                    <a
                                        href={handleRegistration(course.title)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-xl border border-white/10 bg-white/5 text-tango-text text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-tango-red hover:text-white hover:border-tango-red hover:shadow-[0_10px_30px_-10px_rgba(184,59,43,0.5)] transition-all duration-500 group"
                                    >
                                        <IconBrandWhatsapp size={18} className="transition-transform group-hover:rotate-12" />
                                        {content.button}
                                    </a>
                                </div>
                            </CardContent>
                        </TangoCard>
                    ))}
                </div>
            </div>
        </main>
    );
}