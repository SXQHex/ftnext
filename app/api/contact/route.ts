import { createClient } from '@supabase/supabase-js';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const LEVELS = ["zero", "beginner", "intermediate"] as const;
type Level = (typeof LEVELS)[number];

const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Upstash Redis istemcisini lazily oluşturuyoruz; build sırasında env eksik olsa bile modül yüklenebilir.
const getRatelimit = (() => {
    let instance: Ratelimit | null = null;

    return () => {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            return null;
        }

        if (!instance) {
            instance = new Ratelimit({
                redis: new Redis({ url, token }),
                limiter: Ratelimit.slidingWindow(5, "1 m"),
                prefix: "ftnext:contact",
                timeout: 1000,
                analytics: true,
            });
        }

        return instance;
    };
})();

export async function POST(req: Request) {
    // RATE LIMIT KONTROLÜ
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip")?.trim() ??
        "unknown";
    const ratelimit = getRatelimit();

    if (ratelimit) {
        try {
            const { success } = await ratelimit.limit(ip);
            if (!success) {
                return NextResponse.json(
                    { success: false, error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
                    { status: 429 }
                );
            }
        } catch (error) {
            console.error("Rate limit bypass:", error);
        }
    } else {
        console.warn("Upstash Redis env vars missing; rate limiting skipped.");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ success: false, error: 'Sunucu yapılandırması eksik (DB)' }, { status: 500 });
    }
    if (!telegramToken || !telegramChatId) {
        console.warn('Telegram env vars missing, lead will only be saved to DB.');
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Geçersiz istek formu' }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const phoneInput = String(body.phone ?? "").trim();
    const levelValue = body.level;
    const consent = body.consent;
    const marketingConsentValue = body.marketingConsent;
    const marketingConsent = marketingConsentValue === undefined ? false : marketingConsentValue;

    if (typeof marketingConsent !== "boolean") {
        return NextResponse.json({ success: false, error: "Geçersiz iletişim tercihi." }, { status: 400 });
    }

    if (name.length < 3 || name.length > 100) {
        return NextResponse.json({ success: false, error: "Geçerli bir isim giriniz." }, { status: 400 });
    }

    if (!LEVELS.includes(levelValue as Level)) {
        return NextResponse.json({ success: false, error: "Geçersiz seviye seçimi." }, { status: 400 });
    }
    const level = levelValue as Level;

    if (consent !== true) {
        return NextResponse.json({ success: false, error: "Aydınlatma ve veri işleme onayı gereklidir." }, { status: 400 });
    }

    const parsedPhone = parsePhoneNumberFromString(phoneInput, "TR");
    if (!parsedPhone?.isValid() || phoneInput.length > 25) {
        return NextResponse.json({ 
            success: false, 
            error: "Lütfen geçerli bir telefon numarası girin. Yabancı numaralar için başına ülke kodunu (+) ekleyin." 
        }, { status: 400 });
    }

    const standardizedPhone = parsedPhone.number;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { error: dbError } = await supabase
            .from('leads')
            .insert([{ name, phone: standardizedPhone, level, marketing_consent: marketingConsent }]);

        if (dbError) {
            if (dbError.code === '23505') {
                 return NextResponse.json({ success: false, error: "Bu numarayla daha önce bilgi talebinde bulunulmuş." }, { status: 400 });
            }
            throw dbError;
        }

        if (telegramToken && telegramChatId) {
            const message = 
                `🔥 <b>YENİ ADAY DÜŞTÜ!</b> 🔥\\n━━━━━━━━━━━━━━\\n` +
                `👤 <b>Ad:</b> ${escapeHtml(name)}\\n` +
                `📱 <b>Tel:</b> ${escapeHtml(standardizedPhone)}\\n` +
                `💃 <b>Seviye:</b> ${escapeHtml(level)}\\n` +
                `━━━━━━━━━━━━━━\\n<i>Veri Supabase'e güvenle kaydedildi.</i>`;

            try {
                const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: message,
                        parse_mode: "HTML",
                    }),
                });
                if (!response.ok) {
                    console.error("Telegram HTTP error:", response.status);
                }
            } catch (tgErr) {
                console.error("Telegram error:", tgErr);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sistem Hatası:", error);
        return NextResponse.json(
            { success: false, error: "İşlem sırasında bir hata oluştu." }, 
            { status: 500 }
        );
    }
}
