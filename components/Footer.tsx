"use client";

import Link from 'next/link';
import Image from 'next/image';

interface FooterContent {
    slogan: string;
    linksTitle: string;
    contactTitle: string;
    socialTitle: string;
    direction: string;
    address: string;
    copyright: string;
    privacy: string;
    kvkk: string;
}

interface FooterProps {
    content: FooterContent;
    navigation: any;
    lang: string;
}

export default function Footer({ content, navigation, lang }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socialMedia = [
        { name: 'Instagram', icon: '/images/social/Instagram.svg', link: 'https://www.instagram.com/fethiyetangokulubu/' },
        { name: 'Facebook', icon: '/images/social/Facebook.svg', link: 'https://www.facebook.com/profile.php?id=61583589983881' },
        { name: 'Messenger', icon: '/images/social/Messenger.svg', link: 'https://m.me/61583589983881' },
        { name: 'WhatsApp', icon: '/images/social/WhatsApp.svg', link: 'https://wa.me/905446415745' },
        { name: 'Google Maps', icon: '/images/social/GoogleMaps.svg', link: 'https://maps.google.com/?cid=17538582470492931305&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ0' }
    ];

    return (
        <footer className="border-t border-white/5 py-4">
            <div className="mx-auto max-w-7xl px-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

                    {/* 1. Marka - Slogan Geri Döndü */}
                    <div className="md:col-span-3 flex flex-col gap-4">
                        <div className="flex flex-col leading-none"> {/* Satır aralığını daraltmak için leading-none */}
                            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-tango-red ml-[0.2em]">Fethiye</span>
                            <span className="text-2xl font-black uppercase tracking-[-0.02em] text-tango-text">Tango Kulübü</span>
                        </div>
                        <p className="text-sm leading-relaxed text-tango-text max-w-55">
                            {content.slogan}
                        </p>
                    </div>

                    {/* 2. Navigasyon - Geniş ve Okunaklı */}
                    <div className="md:col-span-4 flex flex-col gap-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-tango-red">{content.linksTitle}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-[15px] font-medium text-[#efe6e3]/60">
                            <Link href={`/${lang}`} className="hover:text-tango-red transition-colors">{navigation.home}</Link>
                            <Link href={`/${lang}/program`} className="hover:text-tango-red transition-colors">{navigation.program}</Link>
                            <Link href={`/${lang}/trainers`} className="hover:text-tango-red transition-colors">{navigation.trainers}</Link>
                            <Link href={`/${lang}/atolye`} className="hover:text-tango-red transition-colors">{navigation.atolye}</Link>
                            <Link href={`/${lang}/blog`} className="hover:text-tango-red transition-colors">{navigation.blog}</Link>
                            <Link href={`/${lang}/iletisim`} className="hover:text-tango-red transition-colors">{navigation.contact}</Link>
                            <Link href={`/${lang}/login`} className="hover:text-tango-red transition-colors text-tango-red/80 font-black italic">{navigation.login}</Link>
                        </div>
                    </div>

                    {/* 3. Sosyal Medya - İkonlar Sabit, Başlık Ortalı */}
                    <div className="md:col-span-2 flex flex-col gap-4 md:items-end items-center">
                        {/* w-fit ve items-center ile mobilde başlığı ve ikonları paket halinde ortalıyoruz */}
                        <div className="flex flex-col gap-4 w-fit items-center">

                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-tango-red">
                                {content.socialTitle}
                            </h4>

                            {/* İkon Bloğu: 3-2 piramit dizilimi */}
                            <div className="grid grid-cols-3 gap-2">
                                {socialMedia.map((social, index) => (
                                    <a
                                        key={social.name}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        // 'md:' ön ekini kaldırdık, böylece her ekranda 3+2 simetrisi korunur
                                        className={`relative size-10 rounded-lg border border-white/5 bg-white/5 flex items-center justify-center transition-all hover:border-tango-red/50 hover:bg-tango-red/10
                                            ${index >= 3 ? 'translate-x-1/2' : ''
                                            }`}
                                    >
                                        <Image
                                            src={social.icon}
                                            alt={social.name}
                                            fill
                                            className="object-contain p-2 opacity-70 group-hover:opacity-100 transition-opacity"
                                            sizes="24px"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 4. İletişim & Adres Linki */}
                    <div className="md:col-span-2 flex flex-col gap-4 md:items-end text-right">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-tango-red">{content.contactTitle}</h4>
                        <div className="flex flex-col gap-3">
                            <a href="tel:+905446415745" className="text-xl font-black text-[#efe6e3] hover:text-tango-red transition-all tracking-tight">
                                +90 544 641 5745
                            </a>
                            <a
                                href="https://maps.google.com/?cid=17538582470492931305&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-end"
                            >
                                <p className="text-[12px] text-[#efe6e3]/40 leading-tight transition-colors group-hover:text-tango-red/80">
                                    {content.address}
                                </p>
                                <span className="text-[9px] text-tango-red font-bold tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                                    {content.direction}
                                </span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Alt Bar */}
                <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] tracking-[0.2em] text-white/10 uppercase font-bold">
                    <p>© {currentYear} {content.copyright}</p>
                    <div className="flex gap-6 text-white/20">
                        <Link href={`/${lang}/gizlilik`} className="hover:text-tango-red transition-colors">{content.privacy}</Link>
                        <Link href={`/${lang}/kvkk`} className="hover:text-tango-red transition-colors">{content.kvkk}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}