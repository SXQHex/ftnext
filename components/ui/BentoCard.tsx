"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

// Özellik Prop Tipi
interface FeatureProps {
    feature: {
        title: string;
        description: string;
        icon: React.ReactNode;
        image: string;
        imageAlt: string;
        slug: string;
        seoTitle: string;
        className?: string;
    };
    index: number;
}
// BentoCard Bileşeni: Özellik Kartı
// Geliştirilmiş okunabilirlik ve etkileşim için yeniden tasarlandı
// Daha iyi performans ve erişilebilirlik için optimize edildi
export function BentoCard({ feature, index, cardClassName }: FeatureProps & { cardClassName?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }}

            className={cn("h-full [&_.card-base]:rounded-none! [&_img]:rounded-none!", feature.className)}
        >
            <Card className="relative h-full group flex flex-col justify-end p-0 ring-white/5">
                {/* 1. SEO ve Navigasyon Katmanı */}
                <Link
                    href={feature.slug}
                    className="absolute inset-0 z-30"
                    title={feature.seoTitle}
                >
                    <span className="sr-only">{feature.title}</span>
                </Link>

                {/* 2. Arka Plan: Grayscale ve Overlay Dengesi */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={feature.image}
                        alt={feature.imageAlt}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-30 group-hover:opacity-50"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradyan: Metnin okunabilirliği için daha keskin bir geçiş */}
                    <div className="absolute inset-0 bg-linear-to-t from-tango-black via-tango-black/40 to-transparent" />
                </div>

                {/* 3. İçerik Katmanı */}
                <div className="relative z-20 p-8 pointer-events-none transition-transform duration-500 group-hover:-translate-y-1">
                    {/* İkon Kutusu: Cam efekti (Glassmorphism) iyileştirildi */}
                    <div className="mb-5 text-tango-red w-fit p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:bg-tango-red group-hover:text-white group-hover:border-tango-red transition-all duration-500 group-hover:-rotate-6">
                        {feature.icon}
                    </div>

                    <CardTitle className="text-2xl font-black text-tango-text uppercase tracking-tight mb-2 border-0 group-hover:text-white transition-colors">
                        {feature.title}
                    </CardTitle>

                    <CardDescription className="text-sm text-tango-text/40 font-medium leading-relaxed max-w-60 group-hover:text-tango-text/70 transition-colors">
                        {feature.description}
                    </CardDescription>
                </div>

                {/* 4. Kenar Parlaması (Spotlight) */}
                <div className="absolute inset-0 pointer-events-none bg-radial-[at_50%_100%] from-tango-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </Card>
        </motion.div>
    );
}