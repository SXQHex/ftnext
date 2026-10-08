"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { sendGTMEvent } from "@next/third-parties/google";

export interface RegistrationFormDictionary {
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
    partnerLabel: string;
    partnerOptions: {
        no: string;
        yes: string;
    };
    partnerNameLabel: string;
    partnerNamePlaceholder: string;
    consent?: string;
    submitting: string;
    systemError: string;
    submit: string;
    successTitle: string;
    successMessage: string;
    whatsappConfirm?: string;
    whatsappMessage?: string;
    newRegistration: string;
}

interface RegistrationFormProps {
    dict: RegistrationFormDictionary;
    whatsappNumber?: string;
}

type Mode = 0 | 1;
type Level = "zero" | "beginner" | "intermediate";
type Status = "idle" | "loading" | "success";

const inputClasses =
    "bg-tango-dark border border-white/10 rounded-xl p-3.5 text-[#efe6e3] outline-none focus:ring-2 focus:ring-tango-red/50 transition-all placeholder:text-white/10 w-full";
const labelClasses = "text-sm text-tango-text/80";

export default function RegistrationForm({
    dict,
    whatsappNumber = "905446415745",
}: RegistrationFormProps) {
    const pathname = usePathname();
    const [status, setStatus] = useState<Status>("idle");
    const [phoneError, setPhoneError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [mode, setMode] = useState<Mode>(0);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        level: "zero" as Level,
        partnerName: "",
        consent: false,
    });

    const levelOptions: { value: Level; label: string }[] = [
        { value: "zero", label: dict.levels.zero },
        { value: "beginner", label: dict.levels.beginner },
        { value: "intermediate", label: dict.levels.intermediate },
    ];

    const validatePhone = (number: string) => {
        const phoneNumber = parsePhoneNumberFromString(number, "TR");
        return phoneNumber ? phoneNumber.isValid() : false;
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPhoneError("");
        setSubmitError("");

        if (!validatePhone(formData.phone)) {
            setPhoneError(dict.phoneError);
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch("/api/kayit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.name,
                    phone: formData.phone,
                    level: formData.level,
                    mode,
                    partnerName: mode === 1 ? formData.partnerName : "",
                    consent: formData.consent,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || dict.systemError);

            sendGTMEvent({
                event: "registration_submit_success",
                user_level: formData.level,
                registration_mode: mode,
                page_location: pathname,
            });

            setStatus("success");
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : dict.systemError);
            setStatus("idle");
        }
    }

    function resetForm() {
        setFormData({ name: "", phone: "", level: "zero", partnerName: "", consent: false });
        setMode(0);
        setStatus("idle");
        setPhoneError("");
        setSubmitError("");
    }

    if (status === "success") {
        const waText = dict.whatsappMessage
            ? encodeURIComponent(dict.whatsappMessage.replace("{name}", formData.name))
            : null;

        return (
            <div className="flex flex-col items-center justify-center text-center animate-in zoom-in duration-500 p-10 space-y-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="rounded-full flex items-center justify-center size-20 bg-green-500/10 text-green-500 text-3xl shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    ✓
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black italic uppercase text-white">
                        {dict.successTitle}
                    </h3>
                    <p className="text-sm max-w-62.5 mx-auto leading-relaxed text-tango-text/70">
                        {dict.successMessage}
                    </p>
                </div>

                {waText && dict.whatsappConfirm && (
                    <button
                        type="button"
                        onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${waText}`, "_blank")}
                        className="bg-tango-dark border border-white/10 hover:border-white/20 text-white px-7 py-4 rounded-2xl text-sm flex items-center justify-center gap-3 font-bold transition-all group"
                    >
                        <div className="flex items-center justify-center size-8 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                            <Image src="/images/social/WhatsApp.svg" width={20} height={20} alt="WhatsApp" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] text-tango-text/50 uppercase tracking-[0.2em] font-medium mb-1">WhatsApp</span>
                            <span className="uppercase tracking-widest text-xs font-black italic">{dict.whatsappConfirm}</span>
                        </div>
                    </button>
                )}

                <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs uppercase tracking-widest font-bold text-tango-gold underline pt-2"
                >
                    Yeni kayıt
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* İsim Soyisim */}
            <div className="group flex flex-col gap-1.5">
                <label htmlFor="name" className={labelClasses}>{dict.nameLabel}</label>
                <input
                    id="name"
                    required
                    minLength={3}
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                    placeholder={dict.namePlaceholder}
                />
            </div>

            {/* Telefon */}
            <div className="group flex flex-col gap-1.5">
                <label htmlFor="phone" className={`${labelClasses} ${phoneError ? "text-tango-red" : ""}`}>
                    {dict.phoneLabel}
                </label>
                <input
                    id="phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${inputClasses} ${phoneError ? "border-tango-red/50 focus:ring-tango-red/50" : ""}`}
                    placeholder={dict.phonePlaceholder}
                />
                {phoneError ? (
                    <span className="text-[10px] text-tango-red font-bold uppercase tracking-widest">
                        {phoneError}
                    </span>
                ) : (
                    dict.phoneHint && (
                        <span className="text-[10px] text-tango-text/60 italic">
                            {dict.phoneHint}
                        </span>
                    )
                )}
            </div>

            {/* Seviye */}
            <div className="group flex flex-col gap-1.5">
                <label htmlFor="level" className={labelClasses}>{dict.levelLabel}</label>
                <div className="relative">
                    <select
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value as Level })}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                    >
                        {levelOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-tango-black text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-600">
                        <svg className="size-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Katılım Şekli */}
            <fieldset className="flex flex-col gap-1.5">
                <legend className={`${labelClasses} mb-1.5`}>{dict.partnerLabel}</legend>
                <div className="grid grid-cols-2 gap-3">
                    <label
                        className={`cursor-pointer text-center rounded-xl border p-3.5 text-sm font-black uppercase tracking-widest transition-all ${
                            mode === 0
                                ? "bg-tango-gold text-black border-tango-gold"
                                : "border-white/10 text-tango-text/70 hover:border-white/30"
                        }`}
                    >
                        <input
                            type="radio"
                            name="mode"
                            value="0"
                            checked={mode === 0}
                            onChange={() => setMode(0)}
                            className="sr-only"
                        />
                        {dict.partnerOptions.no}
                    </label>
                    <label
                        className={`cursor-pointer text-center rounded-xl border p-3.5 text-sm font-black uppercase tracking-widest transition-all ${
                            mode === 1
                                ? "bg-tango-gold text-black border-tango-gold"
                                : "border-white/10 text-tango-text/70 hover:border-white/30"
                        }`}
                    >
                        <input
                            type="radio"
                            name="mode"
                            value="1"
                            checked={mode === 1}
                            onChange={() => setMode(1)}
                            className="sr-only"
                        />
                        {dict.partnerOptions.yes}
                    </label>
                </div>
            </fieldset>

            {/* Partner Adı */}
            {mode === 1 && (
                <div className="group flex flex-col gap-1.5 animate-in fade-in duration-300">
                    <label htmlFor="partnerName" className={labelClasses}>{dict.partnerNameLabel}</label>
                    <input
                        id="partnerName"
                        required
                        minLength={3}
                        type="text"
                        value={formData.partnerName}
                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                        className={inputClasses}
                        placeholder={dict.partnerNamePlaceholder}
                    />
                </div>
            )}

            {/* KVKK / Onay */}
            {dict.consent && (
                <label className="flex items-center gap-3 text-[12px] text-tango-text/60 cursor-pointer group py-2">
                    <input
                        type="checkbox"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="accent-tango-red w-4 h-4"
                    />
                    <span className="group-hover:text-tango-text transition-colors leading-tight">{dict.consent}</span>
                </label>
            )}

            {submitError && (
                <p className="text-tango-red text-sm" role="alert">
                    {submitError}
                </p>
            )}

            <div className="pt-2">
                <button
                    disabled={status === "loading"}
                    type="submit"
                    className="w-full font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-linear-to-r from-tango-red to-[#a02d1f] text-white py-4 rounded-xl shadow-lg shadow-tango-red/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                    {status === "loading" ? dict.submitting : dict.submit}
                </button>
            </div>
        </form>
    );
}