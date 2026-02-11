import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY
    const telegramToken = process.env.TELEGRAM_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase env vars:', { 
            hasUrl: !!supabaseUrl, 
            hasKey: !!supabaseKey 
        })
        return NextResponse.json(
            { success: false, error: 'Missing Supabase configuration' }, 
            { status: 500 }
        )
    }

    if (!telegramToken || !telegramChatId) {
        console.error('Missing Telegram env vars:', { 
            hasToken: !!telegramToken, 
            hasChatId: !!telegramChatId 
        })
        return NextResponse.json(
            { success: false, error: 'Missing Telegram configuration' }, 
            { status: 500 }
        )
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

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: message,
                parse_mode: "Markdown",
            }),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sistem Hatası:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            { success: false, error: errorMessage }, 
            { status: 500 }
        );
    }
}