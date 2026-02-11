"use client";

import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { usePathname } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';


interface ContactFormProps {
    labels: any;
    variant?: "standard" | "minimal";
    showConsent?: boolean;
}

export default function ContactForm({
    labels,
    variant = "standard",
    showConsent = true
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

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPhoneError("");

        if (!validatePhone(formData.phone)) {
            setPhoneError(labels.form.phoneError || labels.phoneError);
            return;
        }

        setStatus("loading");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(labels.error?.submit || labels.submitError);

            sendGTMEvent({
                event: 'form_submit_success',
                form_variant: variant, // 'minimal' mi 'standard' mı?
                user_level: formData.level, // Öğrenci adayının seviyesi ne?
                page_location: pathname // Hangi sayfadaki formdan geldi?
            });

            setStatus("success");
        } catch (error) {
            console.error(labels.error?.system || "Error:", error);
            setStatus("idle");
            alert(labels.error?.alert || labels.errorMessage);
        }
    };

    const isMinimal = variant === "minimal";

    if (status === "success") {
        return (
            <div className={`flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 ${isMinimal ? "space-y-6 py-10" : "p-10 space-y-6 bg-white/5 rounded-2xl border border-white/10"
                }`}>
                <div className={`rounded-full flex items-center justify-center text-2xl shadow-lg ${isMinimal
                    ? "size-20 bg-tango-red/20 text-tango-red shadow-[0_0_30px_rgba(235,50,35,0.3)]"
                    : "size-20 bg-green-500/10 text-green-500 text-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    }`}>
                    ✓
                </div>
                <div className="space-y-2">
                    <h3 className={`${isMinimal ? "text-xl" : "text-2xl"} font-black italic uppercase text-white`}>
                        {labels.form?.successTitle || labels.successTitle}
                    </h3>
                    <p className={`text-sm max-w-62.5 mx-auto leading-relaxed ${isMinimal ? "text-gray-400" : "text-tango-text/70"}`}>
                        {labels.form?.successMessage || labels.successMessage}
                    </p>
                </div>
                <button
                    onClick={() => window.open(`https://wa.me/905446415745?text=${encodeURIComponent(labels.form?.whatsappMessage?.replace('{name}', formData.name) || labels.whatsappMessage)}`, "_blank")}
                    className={`flex items-center gap-2 font-bold transition-all group ${isMinimal
                        ? "text-tango-red text-xs uppercase tracking-widest hover:brightness-125"
                        : "bg-tango-dark border border-white/10 hover:border-white/20 text-white px-7 py-4 rounded-2xl text-sm"
                        }`}
                >
                    <div className={`${isMinimal ? "" : "flex items-center justify-center size-8 bg-white/10 rounded-lg group-hover:scale-110 transition-transform"}`}>
                        <img src="/images/social/WhatsApp.svg" className={`${isMinimal ? "size-4 invert group-hover:scale-110" : "size-5 object-contain"} transition-transform`} alt="WA" />
                    </div>
                    {isMinimal ? (
                        labels.form?.whatsappConfirm || labels.whatsappConfirm
                    ) : (
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-tango-text/50 uppercase tracking-[0.2em] font-medium mb-1">WhatsApp</span>
                            <span className="uppercase tracking-widest text-xs font-black italic">{labels.whatsappConfirm}</span>
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

    const formLabels = labels.form || labels;

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col ${isMinimal ? "gap-5" : "gap-4"} w-full`}>
            {/* Ad Soyad */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={labelClasses}>{formLabels.nameLabel}</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    placeholder={formLabels.namePlaceholder}
                />
            </div>

            {/* Telefon */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={`${labelClasses} ${phoneError ? 'text-tango-red' : ''}`}>{formLabels.phoneLabel}</label>
                <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${inputClasses} ${phoneError ? (isMinimal ? 'border-tango-red/60 focus:ring-tango-red' : 'border-tango-red/50 focus:ring-tango-red/50') : ''}`}
                    placeholder={formLabels.phonePlaceholder}
                />
                {phoneError && <span className={`${isMinimal ? "text-[9px] animate-pulse" : "text-[10px]"} text-tango-red font-bold uppercase tracking-widest`}>{phoneError}</span>}
            </div>

            {/* Seviye */}
            <div className={`group flex flex-col ${isMinimal ? "space-y-1.5" : "gap-1.5"}`}>
                <label className={labelClasses}>{formLabels.levelLabel}</label>
                <div className="relative">
                    <select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        className={`${inputClasses} appearance-none cursor-pointer w-full`}
                    >
                        <option value="zero" className="bg-tango-black text-white">{formLabels.levels.zero}</option>
                        <option value="beginner" className="bg-tango-black text-white">{formLabels.levels.beginner}</option>
                        <option value="intermediate" className="bg-tango-black text-white">{formLabels.levels.intermediate}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-600">
                        <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {showConsent && formLabels.consent && (
                <label className="flex items-center gap-3 text-[12px] text-tango-text/60 cursor-pointer group py-2">
                    <input type="checkbox" required className="accent-tango-red w-4 h-4" />
                    <span className="group-hover:text-tango-text transition-colors leading-tight">{formLabels.consent}</span>
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
                    {status === "loading" ? formLabels.submitting : formLabels.submit}
                </button>
            </div>
        </form>
    );
}
