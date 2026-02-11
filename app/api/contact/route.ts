import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";


// Sabitleri dışarıda tanımla ama client'ı içerde veya güvenli oluştur
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;



export async function POST(req: Request) {
    if(!supabaseUrl || !supabaseAnonKey) {
        console.error("Supabase ayarları eksik!");
        return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // Supabase Bağlantısı
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
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