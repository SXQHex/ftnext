"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { usePathname } from "next/navigation";
import UnifiedContactForm, { ContactFormDictionary } from "./ContactForm";
import { sendGTMEvent } from "@next/third-parties/google";
import { hasOptionalConsent } from "@/components/AnalyticsConsent";

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
    closeLabel?: string;
}

interface ModalProviderProps {
    children: React.ReactNode;
    dict: ModalTrialFormDict;
}

const FOCUSABLE_SELECTOR =
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function ModalProvider({ children, dict }: ModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const openModal = (source = "untracked_cta") => {
        setIsOpen(true);

        if (hasOptionalConsent()) {
            sendGTMEvent({
                event: "cta_open_modal",
                cta_source: source,
                modal_name: "contact_trial_form",
                page_location: pathname,
            });
        }
    };

    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsOpen(false);
                return;
            }

            if (event.key !== "Tab" || !modalRef.current) return;

            const focusable = Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus();
        };
    }, [isOpen]);

    return (
        <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}

            {isOpen && (
                <div
                    className="fixed inset-0 z-1000 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300 px-4 py-8 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="contact-trial-modal-title"
                        tabIndex={-1}
                        className="relative w-full max-w-md max-h-fit rounded-[45px] border border-white/10 bg-tango-black p-10 shadow-[0_0_80px_-20px_rgba(235,50,35,0.4)] md:p-14 animate-in zoom-in-95 duration-300 my-auto"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={closeModal}
                            className="absolute top-8 right-8 cursor-pointer text-gray-600 hover:text-white transition-colors"
                            aria-label={dict.closeLabel ?? "Close"}
                        >
                            <span className="text-lg font-light" aria-hidden="true">✕</span>
                        </button>

                        <div className="space-y-8">
                            {dict.header && (
                                <header className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="block h-px w-8 bg-tango-red" aria-hidden="true"></span>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-tango-red">
                                            {dict.header.label}
                                        </p>
                                    </div>
                                    <h2
                                        id="contact-trial-modal-title"
                                        className="text-3xl font-black italic uppercase tracking-tighter text-white leading-[0.9]"
                                        dangerouslySetInnerHTML={{ __html: dict.header.title || "" }}
                                    />
                                </header>
                            )}

                            {dict.form && (
                                <UnifiedContactForm dict={dict.form} variant="minimal" showConsent />
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
