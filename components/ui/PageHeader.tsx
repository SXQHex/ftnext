"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    className?: string;
    fullWidth?: boolean;
    fitTitle?: boolean;
}

export function PageHeader({ eyebrow, title, className, fullWidth = false, fitTitle = false }: PageHeaderProps) {
    const titleParts = title.split(' ');
    const firstPart = titleParts[0];
    const rest = titleParts.slice(1).join(' ');

    return (
        <header className={cn("mb-16 grid lg:grid-cols-12 gap-12 items-end", className)}>
            <div className={cn("min-w-0", fullWidth ? "lg:col-span-12" : "lg:col-span-8", fitTitle && "[container-type:inline-size]")}>
                {/* Çizgi ve Etiket Bloğu */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="block h-px w-12 bg-tango-red shrink-0"></span>
                    <span className="text-[10px] font-black tracking-[0.5em] text-tango-red uppercase">
                        {eyebrow}
                    </span>
                </div>
                {/* Ana Başlık */}
                <h1 className={cn(
                    "relative font-black italic tracking-tighter leading-[0.8] text-tango-text uppercase flex flex-col max-w-full",
                    fitTitle ? "text-[clamp(2.25rem,15cqw,8rem)]" : "text-5xl md:text-7xl lg:text-8xl",
                )}>
                    {/* Üstteki beyaz satır */}
                    <span className="relative z-10 block max-w-full break-normal">
                        {firstPart}
                    </span>

                    {/* Alttaki Amber/Kırmızı bindirme satırı */}
                    <span className="relative z-20 block max-w-full break-words text-transparent bg-clip-text bg-linear-to-r from-tango-gold via-tango-red to-tango-gold -mt-4.5 md:-mt-4 lg:-mt-5 pr-4 pt-4">
                        {rest}
                    </span>
                </h1>
            </div>
        </header>
    );
}
