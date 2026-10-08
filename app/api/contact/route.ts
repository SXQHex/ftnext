import { createClient } from '@supabase/supabase-js';
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Upstash Redis İstemcisi
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limit: 1 dakikada max 5 lead gönderimi
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
});

export async function POST(req: Request) {
    // RATE LIMIT KONTROLÜ
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "127.0.0.1";
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

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const telegramToken = process.env.TELEGRAM_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ success: false, error: 'Sunucu yapılandırması eksik (DB)' }, { status: 500 });
    }
    // Telegram yoksa uyarı ver ama işlemi durdurma
    if (!telegramToken || !telegramChatId) {
        console.warn('Telegram env vars missing, lead will only be saved to DB.');
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Geçersiz istek formu' }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const phoneInput = String(body.phone ?? "").trim();
    const level = String(body.level ?? "zero");

    if (name.length < 3) {
        return NextResponse.json({ success: false, error: "Geçerli bir isim giriniz." }, { status: 400 });
    }

    // Backend Telefon Validasyonu (Güvenlik için şarttır)
    const parsedPhone = parsePhoneNumberFromString(phoneInput, "TR");
    if (!parsedPhone?.isValid() || phoneInput.length > 25) {
        return NextResponse.json({ 
            success: false, 
            error: "Lütfen geçerli bir telefon numarası girin. Yabancı numaralar için başına ülke kodunu (+) ekleyin." 
        }, { status: 400 });
    }

    // Uluslararası formata çevir (+90544...)
    const standardizedPhone = parsedPhone.number;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // A. SUPABASE'E KAYDET (Leads tablosu)
        const { error: dbError } = await supabase
            .from('leads')
            .insert([{ name, phone: standardizedPhone, level }]);

        // Mükerrer kayıt hatası (PostgreSQL unique violation)
        if (dbError) {
            if (dbError.code === '23505') {
                 return NextResponse.json({ success: false, error: "Bu numarayla daha önce bilgi talebinde bulunulmuş." }, { status: 400 });
            }
            throw dbError;
        }

        // B. TELEGRAM'A BİLDİR (Markdown yerine HTML kullanıldı)
        if (telegramToken && telegramChatId) {
            const message = 
                `🔥 <b>YENİ ADAY DÜŞTÜ!</b> 🔥\n━━━━━━━━━━━━━━\n` +
                `👤 <b>Ad:</b> ${escapeHtml(name)}\n` +
                `📱 <b>Tel:</b> ${escapeHtml(standardizedPhone)}\n` +
                `💃 <b>Seviye:</b> ${escapeHtml(level)}\n` +
                `━━━━━━━━━━━━━━\n<i>Veri Supabase'e güvenle kaydedildi.</i>`;

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
            } catch (tgErr) {
                console.error("Telegram error:", tgErr); // Supabase'e kaydedildiyse işlemi patlatma
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