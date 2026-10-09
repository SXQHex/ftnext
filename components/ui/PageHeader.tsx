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
        <header className={cn(fitTitle ? "mb-8" : "mb-16", "grid lg:grid-cols-12 gap-12 items-end", className)}>
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
                    "relative max-w-full font-black italic tracking-tighter text-tango-text uppercase",
                    fitTitle
                        ? "text-[clamp(1.5rem,8cqw,3.25rem)] leading-[0.96] text-balance break-words"
                        : "flex flex-col text-5xl md:text-7xl lg:text-8xl leading-[0.8]",
                )}>
                    {fitTitle ? (
                        <span className="block max-w-full break-words">
                            {title}
                        </span>
                    ) : (
                        <>
                            <span className="relative z-10 block max-w-full break-normal">
                                {firstPart}
                            </span>
                            <span className="relative z-20 block max-w-full break-words text-transparent bg-clip-text bg-linear-to-r from-tango-gold via-tango-red to-tango-gold -mt-4.5 md:-mt-4 lg:-mt-5 pr-4 pt-4">
                                {rest}
                            </span>
                        </>
                    )}
                </h1>
            </div>
        </header>
    );
}
