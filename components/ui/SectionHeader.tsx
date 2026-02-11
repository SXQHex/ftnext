"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    badge?: string;
    title: string;
    subtitle?: string;
    description?: string;
    align?: "left" | "center";
    className?: string;
}

export function SectionHeader({
    badge,
    title,
    subtitle,
    description,
    align = "left",
    className
}: SectionHeaderProps) {
    return (
        <div className={cn("mb-16", align === "center" ? "text-center mx-auto" : "", className)}>
            <div className={cn(
                "flex flex-col gap-6",
                align === "center" ? "items-center" : "md:flex-row md:items-end md:justify-between"
            )}>
                <div className={align === "center" ? "max-w-3xl" : "max-w-2xl"}>
                    {badge && (
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-tango-red font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block"
                        >
                            {badge}
                        </motion.span>
                    )}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-tango-text uppercase leading-tight tracking-tight"
                    >
                        {title} {subtitle && <br className="hidden md:block" />}
                        {subtitle && <span className="opacity-40 italic font-playfair lowercase">{subtitle}</span>}
                    </motion.h2>
                </div>

                {description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className={cn(
                            "text-tango-text/40 text-sm md:text-base max-w-sm leading-relaxed",
                            align === "center" ? "mx-auto" : "md:text-right"
                        )}
                    >
                        {description}
                    </motion.p>
                )}
            </div>

            {/* Premium Divider */}
            <div className={cn("mt-10 relative h-px w-full bg-white/5", align === "center" ? "max-w-4xl mx-auto" : "")}>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="absolute top-0 left-0 h-px bg-tango-red shadow-[0_0_15px_rgba(184,59,43,0.8)]"
                />
            </div>
        </div>
    );
}
