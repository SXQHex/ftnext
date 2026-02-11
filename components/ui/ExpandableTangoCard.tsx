"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CONTACT_INFO } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Card } from "./card";

interface CardProps {
    item: any; index?: number; isBlog?: boolean; lang?: string; labels?: any; waMessageTemplate?: string;
}

export function ExpandableTangoCard({ item, index = 0, isBlog = false, lang = "tr", labels, waMessageTemplate }: CardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const uiLabels = {
        readMore: labels?.readMore || "Okumaya Başla →",
        seeDetails: labels?.seeDetails || "Detayları Gör →",
        readFullArticle: labels?.readFullArticle || "Yazının Tamamını Oku",
        bookSpot: labels?.bookSpot || "Yerini Ayırt",
        close: labels?.close || "[ Kapat ]"
    };

    useEffect(() => {
        if (!isExpanded) return;
        const handleOutsideClick = (e: MouseEvent) => cardRef.current && !cardRef.current.contains(e.target as Node) && setIsExpanded(false);
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsExpanded(false);
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEsc);
        return () => { document.removeEventListener("mousedown", handleOutsideClick); document.removeEventListener("keydown", handleEsc); };
    }, [isExpanded]);

    const description = isBlog ? item.excerpt : item.lead;
    const truncated = description.length > 88 ? description.substring(0, 88) + "..." : description;

    return (
        <motion.div ref={cardRef} layout transition={{ layout: { type: "spring", stiffness: 70, damping: 20 } }}
            className={`relative z-${isExpanded ? '40' : '10'}`}
        >
            <Card
                onClick={() => !isExpanded && setIsExpanded(true)}
                className={`relative overflow-hidden cursor-pointer p-8 transition-all duration-500
                ${isExpanded ? 'border-tango-gold/40 scale-[1.02] shadow-tango-gold/5' : 'hover:border-white/10'}`}
            >
                {/* BG Image (Only Expanded Blog) */}
                <AnimatePresence>
                    {isExpanded && isBlog && item.image && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover grayscale brightness-[0.2] contrast-[1.2]" />
                            <div className="absolute inset-0 bg-linear-to-r from-tango-dark via-tango-dark/80 to-transparent" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <motion.div layout className={`h-1 bg-tango-gold transition-all duration-500 ${isExpanded ? 'w-24' : 'w-12'}`} />
                        {isBlog && <span className="text-[10px] font-black text-tango-gold/50 uppercase tracking-widest">{item.category}</span>}
                    </div>

                    <motion.h3 layout="position" className="text-xl font-black text-tango-text uppercase leading-tight font-playfair">
                        {item.title}
                    </motion.h3>

                    <motion.p layout className="text-sm leading-relaxed text-tango-text/70 italic">
                        {isExpanded ? description : truncated}
                    </motion.p>

                    {!isExpanded && (
                        <div className="mt-4 text-[10px] text-tango-gold font-black uppercase tracking-widest">
                            {isBlog ? <Link href={`/${lang}/blog/${item.slug}`} className="hover:text-white transition-colors">{uiLabels.readMore}</Link> : uiLabels.seeDetails}
                        </div>
                    )}

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-6">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isBlog) window.location.href = `/${lang}/blog/${item.slug}`;
                                        else window.open(CONTACT_INFO.getWaLink(waMessageTemplate?.replace("{title}", item.title) || `${item.title} için bilgi istiyorum.`));
                                    }}
                                    className="w-full py-4 rounded-2xl bg-tango-gold text-tango-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
                                >
                                    {isBlog ? uiLabels.readFullArticle : uiLabels.bookSpot}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="w-full mt-4 text-[10px] text-tango-text/40 hover:text-tango-gold transition-colors uppercase font-black tracking-[0.3em]">
                                    {uiLabels.close}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.div>
    );
}