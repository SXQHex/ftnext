"use client";

import { useState } from "react";
import Image from "next/image";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { usePathname } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

export interface ContactFormDictionary {
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHint?: string;
    phoneError: string;
    levelLabel: string;
    levels: {
        zero: string;
        beginner: string;
        intermediate: string;
    };
    consent?: string;
    submitting: string;
    systemError: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    whatsappConfirm: string;
    whatsappMessage: string;
}

interface ContactFormProps {
    dict: ContactFormDictionary;
    variant?: "standard" | "minimal";
    showConsent?: boolean;
    whatsappNumber?: string;
}

export default function ContactForm({
    dict,
    variant = "standard",
    showConsent = true,
    whatsappNumber = "905446415745"
}: ContactFormProps) {
    const pathname = usePathname();
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [phoneError, setPhoneError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        level: "zero"
    });

    const validatePhone = (number: string) => {
        const phoneNumber = parsePhoneNumberFromString(number, "TR");
        return phoneNumber ? phoneNumber.isValid() : false;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPhoneError("");

        if (!validatePhone(formData.phone)) {
            setPhoneError(dict.phoneError);
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const resData = await response.json().catch(() => ({}));
                throw new Error(resData.error || dict.systemError);
            }

            sendGTMEvent({
                event: 'form_submit_success',
                form_variant: variant, // 'minimal' mi 'standard' mı?
                user_level: formData.level, // Öğrenci adayının seviyesi ne?
                page_location: pathname // Hangi sayfadaki formdan geldi?
            });

            setStatus("success");
        } catch (error) {
            console.error("ContactForm Error:", error);
            setStatus("idle");
            const message = error instanceof Error ? error.message : dict.systemError;
            alert(message);
        }
    };

    const isMinimal = variant === "minimal";

    if (status === "success") {
        const waText = encodeURIComponent(dict.whatsappMessage.replace('{name}', formData.name));

        return (
            <div className={`flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 ${
                isMinimal ? "space-y-6 py-10" : "p-10 space-y-6 bg-white/5 rounded-2xl border border-white/10"
                }`}>
                <div className={`rounded-full flex items-center justify-center text-2xl shadow-lg ${isMinimal
                    ? "size-20 bg-tango-red/20 text-tango-red shadow-[0_0_30px_rgba(235,50,35,0.3)]"
                    : "size-20 bg-green-500/10 text-green-500 text-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    }`}>
                    ✓
                </div>
                <div className="space-y-2">
                    <h3 className={`${isMinimal ? "text-xl" : "text-2xl"} font-black italic uppercase text-white`}>
                        {dict.successTitle}
                    </h3>
                    <p className={`text-sm max-w-62.5 mx-auto leading-relaxed ${isMinimal ? "text-gray-400" : "text-tango-text/70"}`}>
                        {dict.successMessage}
                    </p>
                </div>
                <button
                    onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${waText}`, "_blank")}
                    className={`flex items-center gap-2 font-bold transition-all group ${isMinimal
                        ? "text-tango-red text-xs uppercase tracking-widest hover:brightness-125"
                        : "bg-tango-dark border border-white/10 hover:border-white/20 text-white px-7 py-4 rounded-2xl text-sm"
                        }`}
                >
                    <div className={`${isMinimal ? "" : "flex items-center justify-center size-8 bg-white/10 rounded-lg group-hover:scale-110 transition-transform"}`}>
                        <Image 
                            src="/images/social/WhatsApp.svg" 
                            width={isMinimal ? 16 : 20} 
                            height={isMinimal ? 16 : 20} 
                            className={`${isMinimal ? "invert group-hover:scale-110" : "object-contain"} transition-transform`} 
                            alt="WA" 
                        />
                    </div>
                    {isMinimal ? (
                        dict.whatsappConfirm
                    ) : (
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-tango-text/50 uppercase tracking-[0.2em] font-medium mb-1">WhatsApp</span>
                            <span className="uppercase tracking-widest text-xs font-black italic">{dict.whatsappConfirm}</span>
                        </div>
                    )}
                </button>
            </div>
        );
    }

    const inputClasses = isMinimal
        ? "w-full rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none focus:border-tango-red/40 focus:ring-1 focus:ring-tango-red/40 transition-all placeholder:text-gray-700"
        : "bg-tango-dark border border-white/10 rounded-xl p-3.5 text-[#efe6e3] outline-none focus:ring-2 focus:ring-tango-red/50 transition-all placeholder:text-white/10";

    const labelClasses = isMinimal
        ? "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-tango-red transition-colors"
        : "text-sm text-tango-text/80";

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col ${isMinimal ? "gap-5" : "gap-4"} w-full`}>
            {/* Ad Soyad */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={labelClasses}>{dict.nameLabel}</label>
                <input
                    id="contact-name"
                    required
                    type="text"
                    minLength={3}
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    placeholder={dict.namePlaceholder}
                />
            </div>

            {/* Telefon */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={`${labelClasses} ${phoneError ? 'text-tango-red' : ''}`}>{dict.phoneLabel}</label>
                <input
                    id="contact-phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${inputClasses} ${phoneError ? (isMinimal ? 'border-tango-red/60 focus:ring-tango-red' : 'border-tango-red/50 focus:ring-tango-red/50') : ''}`}
                    placeholder={dict.phonePlaceholder}
                />
                {phoneError ? (
                    <span className={`${isMinimal ? "text-[9px] animate-pulse" : "text-[10px]"} text-tango-red font-bold uppercase tracking-widest`}>
                        {phoneError}
                    </span>
                ) : (
                    dict.phoneHint && (
                        <span className="text-xs text-tango-text/50">{dict.phoneHint}</span>
                    )
                )}
            </div>

            {/* Seviye */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={labelClasses}>{dict.levelLabel}</label>
                <div className="relative">
                    <select
                        id="contact-level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className={`${inputClasses} appearance-none cursor-pointer w-full`}
                    >
                        <option value="zero" className="bg-tango-black text-white">{dict.levels?.zero}</option>
                        <option value="beginner" className="bg-tango-black text-white">{dict.levels?.beginner}</option>
                        <option value="intermediate" className="bg-tango-black text-white">{dict.levels?.intermediate}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-600">
                        <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {showConsent && dict.consent && (
                <label className="flex items-center gap-3 text-[12px] text-tango-text/60 cursor-pointer group py-2">
                    <input type="checkbox" required className="accent-tango-red w-4 h-4" />
                    <span className="group-hover:text-tango-text transition-colors leading-tight">{dict.consent}</span>
                </label>
            )}

            <div className={isMinimal ? "" : "pt-2"}>
                <button
                    disabled={status === "loading"}
                    type="submit"
                    className={`w-full font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isMinimal
                        ? "rounded-2xl bg-tango-red py-5 text-sm text-white shadow-2xl shadow-tango-red/30 hover:bg-red-700 hover:-translate-y-1 active:scale-95"
                        : "bg-linear-to-r from-tango-red to-[#a02d1f] text-white py-4 rounded-xl shadow-lg shadow-tango-red/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                        }`}
                >
                    {status === "loading" ? dict.submitting : dict.submit}
                </button>
            </div>
        </form>
    );
}
