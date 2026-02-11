import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
        return new Response('Missing Supabase environment variables', { status: 500 })
    }
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.json();
    const { name, phone, level } = body;

    try {
        // A. SUPABASE'E KAYDET
        const { error: dbError } = await supabase
            .from('leads')
            .insert([{ name, phone, level }]);

        if (dbError) throw dbError;

        // B. TELEGRAM'A BİLDİR
        const message = `🔥 *YENİ ADAY DÜŞTÜ!* 🔥\n━━━━━━━━━━━━━━\n👤 *Ad:* ${name}\n📱 *Tel:* ${phone}\n💃 *Seviye:* ${level}\n━━━━━━━━━━━━━━\n_Veri Supabase'e güvenle kaydedildi._`;

        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: "Markdown",
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sistem Hatası:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}