"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface TangoButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    showShine?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function TangoButton({
    variant = "primary",
    size = "md",
    showShine = true,
    children,
    className,
    ...props
}: TangoButtonProps) {
    const variants = {
        primary: "bg-tango-red text-white shadow-lg shadow-tango-red/20 hover:bg-red-700 hover:shadow-tango-red/30",
        outline: "bg-white/5 border border-white/10 text-tango-text hover:bg-white/10 hover:border-white/20",
        ghost: "bg-transparent text-tango-text hover:bg-white/5",
    };

    const sizes = {
        sm: "px-6 py-2 text-[10px]",
        md: "px-8 py-3 text-xs",
        lg: "px-10 py-4 text-sm",
        xl: "px-12 py-5 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "group relative overflow-hidden rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>

            {showShine && (
                <div className="absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            )}
        </motion.button>
    );
}
