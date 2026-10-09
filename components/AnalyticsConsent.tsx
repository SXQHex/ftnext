"use client";

import { useSyncExternalStore } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

interface AnalyticsConsentDictionary {
    title: string;
    description: string;
    accept: string;
    reject: string;
    privacy: string;
    privacyHref: string;
    manage: string;
}

const CONSENT_KEY = "ftc-optional-consent";
const CONSENT_EVENT = "ftc-optional-consent-change";

function getConsentSnapshot(): "granted" | "denied" | null {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
}

function subscribe(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(CONSENT_EVENT, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(CONSENT_EVENT, callback);
    };
}

export function hasOptionalConsent() {
    return typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "granted";
}

export default function AnalyticsConsent({
    dict,
    gtmId,
}: {
    dict: AnalyticsConsentDictionary;
    gtmId: string;
}) {
    const consent = useSyncExternalStore(subscribe, getConsentSnapshot, () => null);

    function saveConsent(value: "granted" | "denied") {
        localStorage.setItem(CONSENT_KEY, value);
        window.dispatchEvent(new Event(CONSENT_EVENT));
    }

    function resetConsent() {
        localStorage.removeItem(CONSENT_KEY);
        window.location.reload();
    }

    return (
        <>
            {consent === "granted" && <GoogleTagManager gtmId={gtmId} />}

            {consent !== null && (
                <button
                    type="button"
                    onClick={resetConsent}
                    className="fixed bottom-4 right-4 z-100 rounded-full border border-white/10 bg-tango-black/95 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 shadow-lg backdrop-blur-md hover:text-white"
                >
                    {dict.manage}
                </button>
            )}

            {consent === null && (
                <div
                    role="dialog"
                    aria-label={dict.title}
                    className="fixed inset-x-0 bottom-0 z-100 border-t border-white/10 bg-tango-black/95 px-5 py-4 shadow-2xl backdrop-blur-md"
                >
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold text-white">{dict.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-tango-text/70">
                                {dict.description}{" "}
                                <a
                                    href={dict.privacyHref}
                                    className="text-tango-red underline underline-offset-2"
                                >
                                    {dict.privacy}
                                </a>
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                onClick={() => saveConsent("denied")}
                                className="rounded-lg border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white"
                            >
                                {dict.reject}
                            </button>
                            <button
                                type="button"
                                onClick={() => saveConsent("granted")}
                                className="rounded-lg bg-tango-red px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:brightness-110"
                            >
                                {dict.accept}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
