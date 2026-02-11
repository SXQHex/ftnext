"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useModal } from "@/components/ModalContext";
import { motion, useScroll, useSpring } from "motion/react";
import BlogCTA from "@/components/BlogCTA";

export default function BlogContentClient({
    htmlContent,
    headings,
    ctaContent,
    slug
}: {
    htmlContent: string;
    headings: { id: string, text: string }[];
    ctaContent: any;
    slug: string;
}) {
    const { openModal } = useModal();
    const [activeId, setActiveId] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const handleScroll = useCallback(() => {
        // Tüm başlıkları al ve diziye çevir
        const h2Elements = Array.from(document.querySelectorAll(".tango-article h2[id]"));

        // Scroll pozisyonuna göre "aktif" başlığı bul
        // Ekranın tepesinden 200px aşağıyı "sınır çizgisi" kabul ediyoruz
        const scrollOffset = 200;

        const currentSection = h2Elements.reduce((selected, el) => {
            const rect = el.getBoundingClientRect();

            // Eğer başlık sınır çizgisinin üstündeyse, onu "şimdilik" seç
            // Döngü bittiğinde en son (en aşağıda ama sınırın üstünde olan) başlık seçili kalacak
            if (rect.top <= scrollOffset) {
                return el;
            }
            return selected;
        }, null as Element | null);

        if (currentSection && currentSection.id !== activeId) {
            setActiveId(currentSection.id);
        }
    }, [activeId]);

    useEffect(() => {
        // Scroll dinleyicisi
        window.addEventListener("scroll", handleScroll, { passive: true });
        const timer = setTimeout(handleScroll, 500);

        // Link dinleyicisi (Modal için)
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const href = target.closest('a')?.getAttribute("href");
            if (href === "#open-modal") {
                e.preventDefault();
                openModal(`blog_detail_${slug}`);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        document.addEventListener("click", handleLinkClick);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("click", handleLinkClick);
            clearTimeout(timer);
        };
    }, [handleScroll, openModal, slug]);
    // DİKKAT: htmlContent'i buraya koyma! 
    // İçerik değişirse zaten component rerender olur ve handleScroll içindeki querySelector yeni DOM'u bulur.

    return (
        <div ref={containerRef} className="lg:grid lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr] lg:gap-16 xl:gap-24 w-full">
            {/* Sidebar ve Article kısımları aynı kalıyor... */}
            <aside className="hidden lg:block relative">
                <div className="sticky top-40 flex h-fit items-start">
                    <div className="relative w-px h-100 mr-10 bg-white/5 rounded-full overflow-hidden">
                        <motion.div style={{ scaleY }} className="absolute top-0 left-0 w-full bg-tango-gold origin-top h-full" />
                    </div>
                    <nav className="flex flex-col gap-6">
                        {headings.map((h, index) => (
                            <a
                                key={h.id}
                                href={`#${h.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(h.id);
                                    if (element) {
                                        window.scrollTo({
                                            top: element.getBoundingClientRect().top + window.pageYOffset - 120,
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
                                className={`text-[10px] font-black uppercase tracking-widest transition-all duration-500
                                    ${activeId === h.id ? "text-tango-gold translate-x-2" : "text-white/20"}`}
                            >
                                <span className="mr-2 opacity-30">0{index + 1}.</span>
                                {h.text}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            <article className="w-full min-w-0">
                <div className="tango-article" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                <div className="mt-32 border-t border-white/5 pt-16">
                    <BlogCTA variant="large" content={ctaContent.large} />
                </div>
            </article>
        </div>
    );
}