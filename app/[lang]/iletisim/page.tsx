import UnifiedContactForm from "@/components/ContactForm";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { PageHeader } from "@/components/ui/PageHeader";


export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const content = dict.contact;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* ANA BAŞLIK: Blog sayfasıyla aynı karakterde olmalı */}
                <PageHeader eyebrow={content.eyebrow} title={content.title} />
                <div className="grid lg:grid-cols-[1.2fr_380px] gap-16 xl:gap-24 items-start">
                    {/* Sol: Form ve Mesaj (Ağırlık Merkezi Burası) */}
                    <div className="relative">
                        <div className="max-w-2xl">
                            <p className="text-2xl md:text-4xl text-tango-text leading-tight font-light tracking-tight border-l-4 border-tango-gold pl-8 mb-16">
                                {content.intro.line1} <br />
                                <span className="text-white font-bold italic underline decoration-tango-red/30">{content.intro.line2}</span>
                            </p>
                            <UnifiedContactForm labels={content.form} variant="standard" />
                        </div>

                        {/* Dekoratif Dengeleyici: Sol alt boşluğu doldurur */}
                        <div className="absolute -bottom-40 -left-20 pointer-events-none select-none">
                            <span className="text-[15vw] font-black uppercase italic leading-none opacity-[0.02] text-white">
                                TANGO
                            </span>
                        </div>
                    </div>

                    {/* Sağ: Detaylar (Kompakt ve Şık) */}
                    <aside className="bg-[#0c0c0c] border border-white/10 rounded-[40px] p-6 space-y-6 sticky top-40 backdrop-blur-xl shadow-2xl">
                        <section className="text-center">
                            <h3 className="text-tango-gold uppercase text-[10px] font-black tracking-[0.4em] mb-4 opacity-80">{content.sidebar.studioLabel}</h3>
                            <p className="text-2xl text-tango-text font-black uppercase italic tracking-tighter">{content.sidebar.studioName}</p>
                            <p className="text-tango-text/60 text-xs mt-1">{content.sidebar.studioAddress}</p>
                            <div className="mt-4 flex justify-center gap-2">
                                {content.sidebar.features.map((feature: string, i: number) => (
                                    <span key={i} className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-tango-gold/80">{feature}</span>
                                ))}
                            </div>
                        </section>

                        {/* Harita: Daha ince ve estetik */}
                        <section className="overflow-hidden rounded-3xl grayscale invert brightness-[0.7] contrast-[1.1] border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.5819780063075!2d29.11168187569131!3d36.66050587228709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x25250675f93bfe43%3A0xab9f268badb8fc9c!2sFethiye%20Tango!5e0!3m2!1str!2str!4v1770246084672!5m2!1str!2str"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </section>

                        <section className="pt-6 border-t border-white/5">
                            <a href="https://wa.me/905446415745" className="group flex items-center justify-between bg-white/2 border border-white/5 p-4 rounded-3xl hover:bg-tango-gold transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <img src="/images/social/WhatsApp.svg" alt="WA" className="w-5 h-5" />
                                    <div className="flex flex-col">
                                        <span className="text-lg text-tango-text font-black tracking-tighter group-hover:text-black">{content.sidebar.whatsappButtonTitle}</span>
                                        <span className="text-[9px] uppercase font-bold text-tango-gold group-hover:text-black/60">{content.sidebar.whatsappButtonLabel}</span>
                                    </div>
                                </div>
                            </a>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}