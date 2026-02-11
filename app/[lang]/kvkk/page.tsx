export default function KVKKPage() {
    return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-black text-tango-red uppercase tracking-tighter mb-8">
                    KVKK AYDINLATMA METNİ
                </h1>

                <div className="space-y-6 text-[#efe6e3]/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">1. Veri Sorumlusu</h2>
                        <p>Fethiye Tango Kulübü olarak, kişisel verilerinizin güvenliğine önem veriyoruz. Bu metin, 6698 sayılı KVKK uyarınca sizi bilgilendirmek amacıyla hazırlanmıştır.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">2. İşlenen Veriler ve Amaç</h2>
                        <p>Web sitemizdeki iletişim formları veya WhatsApp hattımız üzerinden paylaştığınız ad, soyad ve iletişim bilgileriniz; sadece size ders programları, etkinlikler ve üyelik süreçleri hakkında bilgi vermek amacıyla işlenmektedir.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">3. Verilerin Aktarımı</h2>
                        <p>Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla veya kurumlarla asla paylaşılmaz.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">4. Haklarınız</h2>
                        <p>Dilediğiniz zaman tarafımıza başvurarak verilerinizin silinmesini, güncellenmesini veya işlenip işlenmediğini öğrenme hakkına sahipsiniz.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">5. Veri Güvenliği ve Başvuru</h2>
                        <p>Kişisel verileriniz, web sitemiz üzerindeki SSL sertifikası ve güvenli sunucularımızda korunmaktadır. Verilerinizle ilgili her türlü soru ve talep için <strong>info@fethiyetango.com</strong> adresine e-posta gönderebilir veya <strong>+90 544 641 57 45</strong> numaralı hattımızdan bizimle iletişime geçebilirsiniz.</p>
                    </section>
                    
                    <p className="text-[10px] uppercase tracking-widest pt-10 border-t border-white/10">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </p>
                </div>
            </div>
        </main>
    );
}