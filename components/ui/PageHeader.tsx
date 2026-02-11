"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    className?: string;
}

export function PageHeader({ eyebrow, title, className }: PageHeaderProps) {
    const titleParts = title.split(' ');
    const firstPart = titleParts[0];
    const rest = titleParts.slice(1).join(' ');

    return (
        <header className={cn("mb-16 grid lg:grid-cols-12 gap-12 items-end", className)}>
            <div className="lg:col-span-8">
                {/* Çizgi ve Etiket Bloğu */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="block h-px w-12 bg-tango-red shrink-0"></span>
                    <span className="text-[10px] font-black tracking-[0.5em] text-tango-red uppercase">
                        {eyebrow}
                    </span>
                </div>
                {/* Ana Başlık */}
                <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.8] text-tango-text uppercase flex flex-col">
                    {/* Üstteki beyaz satır */}
                    <span className="relative z-10 block">
                        {firstPart}
                    </span>

                    {/* Alttaki Amber/Kırmızı bindirme satırı */}
                    <span className="relative z-20 inline-block text-transparent bg-clip-text bg-linear-to-r from-tango-gold via-tango-red to-tango-gold -mt-4.5 md:-mt-4 lg:-mt-5 pr-4 pt-4">
                        {rest}
                    </span>
                </h1>
            </div>
        </header>
    );
}
