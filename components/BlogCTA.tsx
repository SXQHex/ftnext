"use client";
import { useModal } from "./ModalContext";

interface BlogCTAProps {
    variant?: "small" | "large";
    content: any;
}

export default function BlogCTA({ variant = "large", content }: BlogCTAProps) {
    const { openModal } = useModal();

    if (variant === "small") {
        return (
            <div className="my-12 border-y border-white/5 py-8 text-center">
                <p className="mb-4 text-sm italic text-tango-text">{content.text}</p>
                <button
                    onClick={() => openModal("blog_cta_small")}
                    className="text-xs font-black uppercase tracking-[0.3em] text-tango-red hover:text-white transition-colors cursor-pointer"
                >
                    {content.button}
                </button>
            </div>
        );
    }

    return (
        <div className="mt-20 rounded-[40px] bg-tango-dark border border-white/5 p-12 text-center shadow-2xl">
            <h3 className="mb-4 text-xl font-black italic uppercase tracking-tighter text-white">
                {content.title.replace(content.highlight, "")}
                <span className="text-tango-red">{content.highlight}</span>
            </h3>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-tango-text">
                {content.description}
            </p>
            <button
                onClick={() => openModal("blog_cta_large")}
                className="cursor-pointer rounded-2xl bg-tango-red px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-tango-red/20"
            >
                {content.button}
            </button>
        </div>
    );
}