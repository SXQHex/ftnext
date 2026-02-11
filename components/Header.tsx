"use client";

import { useModal } from "@/components/ModalContext";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Aktif sayfa takibi için

import { useI18n } from "@/components/I18nContext";
import { TangoButton } from "./ui/TangoButton";

interface Navigation {
    home: string;
    program: string;
    trainers: string;
    atolye: string;
    blog: string;
    contact: string;
    cta: string;
    login: string;
}

interface HeaderProps {
    navigation: Navigation;
    lang: string;
}

export default function Header({ navigation, lang }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false); // Dil menüsü kontrolü
    const [isScrolled, setIsScrolled] = useState(false); // Scroll durumu
    const { openModal } = useModal();
    const pathname = usePathname();
    const { routeTranslations } = useI18n();

    // Dil listesi
    const languages = [
        { code: 'tr', label: 'TR', full: 'Türkçe' },
        { code: 'en', label: 'EN', full: 'English' },
        { code: 'ru', label: 'RU', full: 'Русский' },
        { code: 'uk', label: 'UK', full: 'Українська' },
        { code: 'es', label: 'ES', full: 'Español' },
    ];

    const currentLang = languages.find(l => l.code === lang) || languages[0];

    // Dil değiştirme linkini oluşturur
    const getTargetHref = (targetLang: string) => {
        if (pathname.includes('/blog/') && routeTranslations[targetLang]) {
            return `/${targetLang}/blog/${routeTranslations[targetLang]}`;
        }
        if (pathname.startsWith(`/${lang}`)) {
            return pathname.replace(`/${lang}`, `/${targetLang}`);
        }
        return `/${targetLang}`;
    };

    // Scroll takibi
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Tıklama dışı dil menüsünü kapatma
        const handleClickOutside = () => setIsLangOpen(false);
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: navigation.home, href: `/${lang}` },
        { name: navigation.program, href: `/${lang}/program` },
        { name: navigation.trainers, href: `/${lang}/trainers` },
        { name: navigation.atolye, href: `/${lang}/atolye` },
        { name: navigation.blog, href: `/${lang}/blog` },
        { name: navigation.contact, href: `/${lang}/iletisim` },
    ];

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full border-b transition-all duration-500 ${
                isScrolled
                ? 'h-16 border-white/10 bg-tango-black shadow-[0_12px_20px_-5px_rgba(0,0,0,1)]'
                : 'h-24 border-transparent bg-transparent'
                }`}
        >
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">

                {/* Logo */}
                <Link href={`/${lang}`} className="group flex flex-col leading-none shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-tango-red ml-[0.2em] transition-transform group-hover:translate-x-1">
                        Fethiye
                    </span>
                    <span className="text-2xl font-black uppercase tracking-[-0.02em] text-tango-text transition-colors group-hover:text-white">
                        Tango Kulübü
                    </span>
                </Link>

                {/* Desktop Navigation - xl'de tam, lg'de sıkışık, md'de kapalı */}
                <nav className="hidden items-center gap-4 xl:gap-8 lg:flex">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-xs xl:text-sm font-medium transition-all duration-300 hover:text-tango-red whitespace-nowrap ${isActive ? 'text-tango-red' : 'text-[#efe6e3]/60'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 h-px w-full bg-tango-red shadow-[0_0_8px_#ff0000]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA & Language Switcher & Mobile Toggle */}
                <div className="flex items-center gap-3 xl:gap-6">
                    {/* Compact Language Selector - Desktop */}
                    <div className="relative hidden sm:block" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-2 group transition-all duration-300 px-3 py-2 rounded-full hover:bg-white/10 hover:scale-105 active:scale-95"
                        >
                            <svg
                                className={`w-5 h-5 text-tango-red group-hover:text-white transition-all duration-500 ${isLangOpen ? 'rotate-360' : 'group-hover:rotate-12'}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                            </svg>
                            <span className="text-[11px] font-black text-white/50 tracking-wider group-hover:text-tango-red transition-colors uppercase">
                                {lang === 'tr' ? 'EN' : 'TR'}
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className={`
                            absolute right-0 mt-3 w-40 bg-tango-black border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300
                            ${isLangOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'}
                        `}>
                            <div className="p-1">
                                {languages.map((l) => (
                                    <Link
                                        key={l.code}
                                        href={getTargetHref(l.code)}
                                        onClick={() => setIsLangOpen(false)}
                                        className={`
                                            flex items-center justify-between px-4 py-2.5 text-[11px] font-bold transition-all rounded-lg
                                            ${lang === l.code ? 'bg-tango-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}
                                        `}
                                    >
                                        <span>{l.full}</span>
                                        <span className="opacity-40">{l.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        href={`/${lang}/login`}
                        className="hidden sm:block"
                    >
                        <TangoButton variant="outline" size="sm">
                            {navigation.login}
                        </TangoButton>
                    </Link>

                    <TangoButton
                        onClick={() => openModal('header_website')}
                        size="sm"
                        className="hidden sm:flex"
                    >
                        {navigation.cta}
                    </TangoButton>

                    <button
                        className="flex flex-col gap-1.5 lg:hidden cursor-pointer p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menü"
                    >
                        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45 w-7' : ''}`}></span>
                        <span className={`h-0.5 w-6 bg-white transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45 w-7' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`
                absolute top-full left-0 w-full bg-tango-black/95 backdrop-blur-xl border-b border-white/10 p-8 flex flex-col gap-6 lg:hidden shadow-2xl
                transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible'}
            `}>
                <div className="flex flex-col gap-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-xl font-bold transition-colors ${pathname === link.href ? 'text-tango-red' : 'text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href={`/${lang}/login`}
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full"
                    >
                        <TangoButton variant="outline" size="lg" className="w-full py-4 text-base">
                            {navigation.login}
                        </TangoButton>
                    </Link>
                    <TangoButton
                        onClick={() => {
                            setIsMenuOpen(false);
                            openModal('header_mobile');
                        }}
                        size="lg"
                        className="w-full py-4 text-lg font-black"
                    >
                        {navigation.cta}
                    </TangoButton>
                </div>

                {/* Mobile Language Switcher */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-8 border-t border-white/10">
                    {languages.map((l) => (
                        <Link
                            key={l.code}
                            href={getTargetHref(l.code)}
                            onClick={() => setIsMenuOpen(false)}
                            className={`
                                flex items-center justify-between px-4 py-3 rounded-xl border transition-all
                                ${lang === l.code ? 'bg-white/10 border-tango-red text-tango-red font-black' : 'border-white/5 text-white/40 font-bold'}
                            `}
                        >
                            <span className="text-sm">{l.full}</span>
                            <span className="text-[10px] opacity-40">{l.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
}