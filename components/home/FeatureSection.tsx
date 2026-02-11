"use client";

import { motion } from "motion/react";
import {
    IconCalendarEvent,
    IconHeart,
    IconMusic,
    IconMapPin,
    IconUsers
} from "@tabler/icons-react";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoCard } from "../ui/BentoCard";

// Tip tanımı (TypeScript kullanıyorsan hayat kurtarır)
interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    imageAlt: string;
    slug: string;
    seoTitle: string;
    className: string;
}

export function FeatureSection({ content }: { content: any }) {
    return (
        <section className="py-24 px-8 relative overflow-hidden">
            <div className="mx-auto max-w-7xl"> {/* Container yerine max-w-7xl daha garantidir */}
                <SectionHeader
                    badge={content.badge}
                    title={content.title}
                    subtitle={content.subtitle}
                    description={content.description}
                />

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[16rem] md:auto-rows-[18rem] lg:auto-rows-[20rem] gap-4">
                    {features.map((feature, index) => (
                        <BentoCard
                            key={feature.title}
                            feature={{ ...feature, ...content.items[index] }}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

const features: Feature[] = [
    {
        title: "Uluslararası Atölyeler",
        description: "Dünyaca ünlü maestrolar ile tekniğinizi zirveye taşıyın.",
        icon: <IconCalendarEvent size={28} stroke={1.2} />, // weight yerine stroke kullanıldı
        image: "/images/workshop-atolye.webp",
        imageAlt: "Fethiye Tango Atölyesi ve Maestro Eğitimi",
        slug: "/atolye",
        seoTitle: "Profesyonel Tango Atölyeleri | Fethiye Tango", // Eksik olan eklendi
        className: "md:col-span-6 md:row-span-2",
    },
    {
        title: "Milonga Geceleri",
        description: "Arjantin ruhunu Fethiye'de yaşayın.",
        icon: <IconMusic size={28} stroke={1.2} />,
        image: "/images/milonga.webp",
        imageAlt: "Fethiye Tango Milonga Gecesi Etkinliği",
        slug: "/program",
        seoTitle: "Milonga Geceleri ve Etkinlikler",
        className: "md:col-span-6 md:row-span-1",
    },
    {
        title: "Sosyal Ortam",
        description: "Dansın ötesinde dostluklar.",
        icon: <IconHeart size={28} stroke={1.2} />,
        image: "/images/sosyal.avif",
        imageAlt: "Fethiye Tango Kulübü Sosyal Dayanışma",
        slug: "/blog",
        seoTitle: "Tango Sosyal Ortamı ve Dostluklar",
        className: "md:col-span-3 md:row-span-1",
    },
    {
        title: "Merkezi Lokasyon",
        description: "Fethiye'nin kalbinde ulaşım kolaylığı.",
        icon: <IconMapPin size={28} stroke={1.2} />,
        image: "/images/harita.webp",
        imageAlt: "Fethiye Tango Kulübü Nerede",
        slug: "/iletisim",
        seoTitle: "Stüdyo Konumu ve Ulaşım",
        className: "md:col-span-3 md:row-span-1",
    },
    {
        title: "Her Seviye",
        description: "İlk adımdan profesyonelliğe.",
        icon: <IconUsers size={28} stroke={1.2} />,
        image: "/images/cam11.webp",
        imageAlt: "Başlangıç ve İleri Seviye Tango Dersleri",
        slug: "/program",
        seoTitle: "Her Seviye İçin Tango Dersleri",
        className: "md:col-span-12 md:row-span-1",
    }
];