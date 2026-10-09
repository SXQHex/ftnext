import { createClient } from "@supabase/supabase-js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const LEVELS = ["zero", "beginner", "intermediate"] as const;
type Level = (typeof LEVELS)[number];
type Mode = 0 | 1;

const LEVEL_LABELS: Record<Level, string> = {
    zero: "Hiç dans etmedim",
    beginner: "Başlangıç Seviye",
    intermediate: "Orta / İleri Seviye",
};

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
                prefix: "ftnext:registration",
                timeout: 1000,
                analytics: true,
            });
        }

        return instance;
    };
})();

export async function POST(req: Request) {
    // RATE LIMITING KONTROLÜ
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
                    { error: "Çok fazla kayıt isteği gönderdiniz. Lütfen biraz bekleyip tekrar deneyin." },
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
        console.error("Missing Supabase env vars");
        return NextResponse.json({ error: "Sunucu yapılandırması eksik." }, { status: 500 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const modeValue = body.mode;
    const partnerName = String(body.partnerName ?? "").trim();
    const levelValue = body.level;
    const consent = body.consent;
    const marketingConsentValue = body.marketingConsent;
    const marketingConsent = marketingConsentValue === undefined ? false : marketingConsentValue;

    if (typeof marketingConsent !== "boolean") {
        return NextResponse.json({ error: "Geçersiz iletişim tercihi." }, { status: 400 });
    }

    if (modeValue !== 0 && modeValue !== 1) {
        return NextResponse.json({ error: "Geçersiz katılım şekli." }, { status: 400 });
    }
    const mode: Mode = modeValue;

    if (!LEVELS.includes(levelValue as Level)) {
        return NextResponse.json({ error: "Geçersiz seviye seçimi." }, { status: 400 });
    }
    const level = levelValue as Level;

    if (consent !== true) {
        return NextResponse.json({ error: "Aydınlatma ve veri işleme onayı gereklidir." }, { status: 400 });
    }

    if (fullName.length < 3 || fullName.length > 100) {
        return NextResponse.json({ error: "Lütfen isim soyisim girin." }, { status: 400 });
    }
    const parsedPhone = parsePhoneNumberFromString(phone, "TR");
    if (!parsedPhone?.isValid() || phone.length > 25) {
        return NextResponse.json({ 
            error: "Lütfen geçerli bir telefon numarası girin. Türkiye dışı nımaralar için başına ülke kodu (+) ekleyin." 
        }, { status: 400 });
    }
    const e164Phone = parsedPhone.number; // E.164 formatında telefon numarası

    if (mode === 1 && (partnerName.length < 3 || partnerName.length > 100)) {
        return NextResponse.json({ error: "Lütfen partner isim soyisim girin. Ya da tek kayıt yapın." }, { status: 400 });
    }

    try {
        // A. SUPABASE'E KAYDET (leads tablosundan ayrı: registrations)
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error: dbError } = await supabase.from("registrations").insert([
            {
                name: fullName,
                phone: e164Phone,
                level,
                mode,
                partner_name: mode === 1 ? partnerName : null,
                marketing_consent: marketingConsent,
            },
        ]);
        if (dbError) throw dbError;

        // B. TELEGRAM'A BİLDİR (başarısız olsa bile kayıt zaten alındı)
        if (telegramToken && telegramChatId) {
            const message =
                `✅ <b>YENİ KESİN KAYIT</b>\n━━━━━━━━━━━━━━\n` +
                `👤 <b>Ad:</b> ${escapeHtml(fullName)}\n` +
                `📱 <b>Tel:</b> ${escapeHtml(phone)}\n` +
                `💃 <b>Seviye:</b> ${LEVEL_LABELS[level]}\n` +
                (mode === 1
                    ? `👫 <b>Partnerli:</b> ${escapeHtml(partnerName)}\n`
                    : `🕺 <b>Tek</b>\n`) +
                `━━━━━━━━━━━━━━`;

            try {
                await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chat_id: telegramChatId,
                        text: message,
                        parse_mode: "HTML",
                    }),
                });
            } catch (tgError) {
                console.error("Telegram bildirimi gönderilemedi:", tgError);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Kayıt hatası:", error);
        return NextResponse.json({ error: "Kayıt şu an alınamadı, lütfen tekrar deneyin." }, { status: 500 });
    }
}
