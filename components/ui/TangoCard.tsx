"use client";
import * as React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";

interface TangoCardProps {
    index?: number;
    eyebrow?: string;
    title: string;
    description?: string;
    accent?: boolean;
    className?: string;
    children?: React.ReactNode;
}

type CombinedProps = TangoCardProps & Omit<HTMLMotionProps<"div">, keyof TangoCardProps>;

export function TangoCard({
    className,
    index = 0,
    eyebrow,
    title,
    description,
    children,
    accent = false,
    ...props
}: CombinedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
            {...props}
        >
            <Card className={cn(
                "relative z-10 h-full p-2",
                accent && "border-tango-red/40",
                className
            )}>
                <CardHeader>
                    {eyebrow && (
                        <span className="text-tango-red text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                            {eyebrow}
                        </span>
                    )}
                    <CardTitle>{title}</CardTitle>
                    {description && (
                        <CardDescription className="line-clamp-2 italic">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>{children}</CardContent>
                {/* Alt Hover Çizgisi */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-tango-red transition-all duration-700 group-hover:w-full shadow-[0_0_15px_#b83b2b]" />
            </Card>
        </motion.div>
    );
}
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";