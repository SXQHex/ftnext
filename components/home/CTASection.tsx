"use client";

import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TangoButton } from "@/components/ui/TangoButton";
import { CONTACT_INFO } from "@/lib/constants";

export function CTASection({ content }: { content: any }) {
    return (
        <section className="relative flex flex-col items-center justify-center py-32 md:py-48 overflow-hidden border-t border-white/5">
            {/* 1. Metin ve İçerik Alanı */}
            <div className="z-20 text-center px-6 w-full max-w-7xl mx-auto">
                <SectionHeader
                    title={content.title}
                    subtitle={content.subtitle}
                    description={content.description}
                    align="center"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex justify-center -mt-8"
                >
                    <TangoButton
                        onClick={() => window.open(CONTACT_INFO.getWaLink(content.whatsappMessage || "Merhaba, bilgi alabilir miyim?"), "_blank")}
                        size="xl"
                    >
                        <img src="/images/social/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
                        {content.button}
                    </TangoButton>
                </motion.div>

                {/* Mentor Dokunuşu: Sosyal Kanıt ve Güven */}
                <p className="mt-8 text-tango-text/40 text-sm font-medium">
                    {content.response}
                </p>
            </div>

            {/* 3. Arka Plan Katmanları */}
            <BackgroundBeams className="opacity-40" />

            {/* Beams'in fazla çiğ durmaması için üzerine bir vignette ekliyoruz */}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-tango-black/40 to-tango-black pointer-events-none" />
        </section>
    );
}