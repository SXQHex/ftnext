import { PageHeader } from "@/components/ui/PageHeader";
import { i18n, type Locale } from "../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";
import Image from "next/image";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function TrainersPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.trainers;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8 selection:bg-tango-red/30">
            <div className="container mx-auto max-w-7xl">
                <PageHeader eyebrow={content.eyebrow} title={content.title} />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
                    {/* SOL KOLON: Portre ve Temel Bilgiler (Sticky) */}
                    <aside className="lg:sticky lg:top-40 space-y-6 lg:space-y-12">
                        <div className="card-base group relative aspect-3/4 rounded-[40px] will-change-transform p-0 border-none">
                            <div className="absolute inset-0 overflow-hidden rounded-[40px] bg-tango-black z-10">
                                <Image
                                    src="/images/trainers/erkin-kunbuk.webp"
                                    alt={`${content.sidebar.name} ${content.sidebar.surname}`}
                                    fill
                                    priority
                                    className="object-cover grayscale contrast-110 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-in-out"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-tango-black/80 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        <div className="pl-4 border-l-2 border-tango-gold/40">
                            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">
                                {content.sidebar.name} <br /> {content.sidebar.surname}
                            </h1>
                            <p className="text-tango-gold font-bold text-[10px] uppercase tracking-[0.4em] mt-2">
                                {content.sidebar.role}
                            </p>
                        </div>
                    </aside>

                    {/* SAĞ KOLON: İçerik Akışı */}
                    <div className="space-y-12 lg:space-y-16">

                        {/* SEVİYE 1: ÖZET VE VİZYON */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.vision.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="p-8 bg-white/3 border border-white/5 rounded-3xl group hover:border-tango-gold/50 transition-all duration-500"
                                >
                                    <span className="text-tango-gold font-black uppercase tracking-widest text-[9px] block mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{item.label}</span>
                                    <p className="text-white font-medium leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </section>

                        {/* SEVİYE 2: HİKAYE */}
                        <section className="relative space-y-6">
                            <div className="max-w-4xl">
                                <h2 className="text-tango-gold font-black uppercase tracking-[0.4em] text-[10px] mb-12">{content.journey.eyebrow}</h2>
                                <p
                                    className="text-3xl lg:text-5xl text-white font-black uppercase italic tracking-tighter leading-[0.9] mb-6"
                                    dangerouslySetInnerHTML={{ __html: content.journey.title }}
                                />
                                <p
                                    className="text-tango-text text-lg lg:text-xl leading-relaxed opacity-80"
                                    dangerouslySetInnerHTML={{ __html: content.journey.description }}
                                />
                            </div>
                        </section>

                        {/* SEVİYE 3: KRONOLOJİ */}
                        <section className="space-y-12">
                            <h2 className="text-tango-gold font-black uppercase tracking-[0.4em] text-[10px]">{content.career.eyebrow}</h2>

                            <div className="grid gap-6">
                                {/* ALTIN ÇAĞ KARTI */}
                                <div className="relative p-10 bg-linear-to-br from-white/5 to-transparent border border-tango-gold/30 rounded-[40px] overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-8xl font-black italic tracking-tighter text-tango-gold">PRIME</span>
                                    </div>

                                    <div className="grid md:grid-cols-[200px_1fr] gap-10 relative">
                                        <div className="flex flex-col">
                                            <span className="text-tango-red font-black italic text-4xl tracking-tighter">{content.career.primeEra.date}</span>
                                            <span className="text-tango-gold font-bold uppercase tracking-[0.2em] text-[10px] mt-4">{content.career.primeEra.badge}</span>
                                        </div>

                                        <div className="space-y-6">
                                            <h3
                                                className="text-white font-black uppercase tracking-tight text-3xl leading-none"
                                                dangerouslySetInnerHTML={{ __html: content.career.primeEra.title }}
                                            />
                                            <p className="text-white text-lg leading-relaxed font-light italic opacity-90">
                                                {content.career.primeEra.quote}
                                            </p>
                                            <div className="text-tango-text text-base leading-relaxed space-y-4 opacity-80">
                                                {content.career.primeEra.text.map((paragraph: string, i: number) => (
                                                    <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* DİĞER DÖNEMLER */}
                                <div className="grid gap-2">
                                    {content.career.timeline.map((item: any, i: number) => (
                                        <div
                                            key={i}
                                            className="group grid md:grid-cols-[200px_1fr] gap-10 p-8 hover:bg-white/3 rounded-[30px] transition-all border border-transparent hover:border-white/5"
                                        >
                                            <span className="text-white/30 font-black italic text-2xl tracking-tighter group-hover:text-tango-red transition-colors duration-500">{item.year}</span>
                                            <div>
                                                <h3 className="text-white font-bold uppercase tracking-tight text-xl mb-2 group-hover:text-tango-gold transition-colors">{item.title}</h3>
                                                <p className="text-tango-text text-sm leading-relaxed opacity-70">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}