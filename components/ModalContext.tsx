"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UnifiedContactForm, { ContactFormDictionary } from "./ContactForm";
import { sendGTMEvent } from '@next/third-parties/google';

interface ModalContextType {
    isOpen: boolean;
    openModal: (source?: string) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export interface ModalTrialFormDict {
    header?: {
        label?: string;
        title?: string;
    };
    form?: ContactFormDictionary;
}
interface ModalProviderProps {
    children: React.ReactNode;
    dict: ModalTrialFormDict;
}

export function ModalProvider({ children, dict }: ModalProviderProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const openModal = (source: string = "untracked_cta") => {
        setIsOpen(true);

        // GTM Event - İsimleri GA4 standartlarına yakın tutalım
        sendGTMEvent({
            event: 'cta_open_modal',
            cta_source: source, // 'hero', 'blog_footer', 'nav'
            modal_name: 'contact_trial_form', // Daha spesifik isim
            page_location: pathname // Hangi URL'de bu butona basıldı?
        });

        // Debug (Geliştirme aşamasında hayat kurtarır, canlıda silersin)
        if (process.env.NODE_ENV === 'development') {
            console.log(`🎯 CTA Tetiklendi: ${source}`);
        }
    };
    
    const closeModal = () => setIsOpen(false);

    // Arka plan kaymasını engelle
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [isOpen]);

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}

            {/* MODAL FİZİKSEL KATMANI */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-1000 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 px-4 py-8 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        className="relative w-full max-w-md max-h-fit rounded-[45px] border border-white/10 bg-tango-black p-10 shadow-[0_0_80px_-20px_rgba(235,50,35,0.4)] md:p-14 animate-in zoom-in-95 duration-300 my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Kapatma Butonu */}
                        <button
                            onClick={closeModal}
                            className="absolute top-8 right-8 cursor-pointer text-gray-600 hover:text-white transition-colors"
                            aria-label="Kapat"
                        >
                            <span className="text-lg font-light">✕</span>
                        </button>

                        {/* İçerik */}
                        <div className="space-y-8">
                            {dict.header && (
                                <header className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="block h-px w-8 bg-tango-red"></span>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-tango-red">{dict.header?.label}</p>
                                    </div>
                                    <h2
                                        className="text-3xl font-black italic uppercase tracking-tighter text-white leading-[0.9]"
                                        dangerouslySetInnerHTML={{ __html: dict.header?.title || "" }}
                                    />
                                </header>
                            )}

                            {/* Form Buraya Bağlandı */}
                            {dict?.form && (
                                <UnifiedContactForm dict={dict.form} variant="minimal" showConsent={true} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal ModalProvider içinde kullanılmalı!");
    return context;
}