"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useModal } from "@/components/ModalContext";
import { TangoButton } from "../ui/TangoButton";

export function HeroSection({ content }: { content: any }) {
    const { openModal } = useModal();
    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center ">
            {/* Arka Plan: Slow Zoom Eklendi */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero/hero.webp"
                    alt="Fethiye Tango Kulübü Sosyal Ortamı"
                    fill
                    priority
                    className="object-cover object-center select-none animate-slow-zoom"
                    sizes="100vw"
                    quality={85} // Performans iyileştirmesi
                />
                {/* Karartma: Metinlerin her zaman okunması için gradyanı güçlendirdim */}
                <div className="absolute inset-0 bg-linear-to-b from-tango-black/60 via-tango-black/50 to-tango-black" />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Sosyal Kulüp Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-tango-red/30 bg-tango-red/10 backdrop-blur-md mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tango-red opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-tango-red"></span>
                            </span>
                            <span className="text-[10px] font-bold text-tango-text uppercase tracking-widest">
                                {content.badge}
                            </span>
                        </motion.div>

                        {/* Başlık: Font değişkenlerini koruduk ama renkleri temaya bağladık */}
                        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-black text-tango-text leading-tight tracking-tight uppercase">
                            {content.title} <br />
                            <span className="text-tango-red italic font-playfair">{content.subtitle}</span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 font-inter text-base md:text-lg text-tango-text/80 max-w-2xl mx-auto leading-relaxed"
                        >
                            {content.description}
                        </motion.p>

                        {/* CTA: Renkleri dengelenmiş hali */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="mt-12 flex flex-wrap gap-6 justify-center"
                        >
                            <TangoButton
                                onClick={() => openModal("hero-section")}
                                size="lg"
                                className="italic"
                            >
                                <span className="uppercase tracking-widest text-xs font-black">
                                    {content.ctaStart}
                                </span>
                            </TangoButton>

                            <Link href="/program">
                                <TangoButton
                                    variant="outline"
                                    size="lg"
                                    showShine={false}
                                >
                                    <span className="uppercase tracking-widest text-xs">{content.ctaEvents}</span>
                                </TangoButton>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Sosyal Kanıt Alt Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center gap-6 md:gap-12 text-tango-text/40 font-inter text-[9px] md:text-[10px] uppercase tracking-[0.2em]"
            >
                <div className="flex flex-col items-center">
                    <span className="text-tango-text text-base md:text-lg font-bold">100+</span>
                    <span className="text-[8px] md:text-[10px]">{content.stats.members}</span>
                </div>
                <div className="hidden md:block h-6 w-px bg-white/10 self-center" />
                <div className="hidden md:flex flex-col items-center">
                    <span className="text-tango-text text-base md:text-lg font-bold">500+</span>
                    <span className="text-[8px] md:text-[10px]">{content.stats.milongas}</span>
                </div>
                <div className="block h-6 w-px bg-white/10 self-center" />
                <div className="flex flex-col items-center">
                    <span className="text-tango-text text-base md:text-lg font-bold">20+</span>
                    <span>{content.stats.years}</span>
                </div>
            </motion.div>
        </section>
    );
}