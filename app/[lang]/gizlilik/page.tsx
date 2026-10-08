export default function GizlilikPage() {
    return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-black text-tango-red uppercase tracking-tighter mb-8">
                    GİZLİLİK POLİTİKASI
                </h1>

                <div className="space-y-6 text-[#efe6e3]/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">1. Hangi Verileri Topluyoruz?</h2>
                        <p>
                            Site üzerindeki formlar aracılığıyla ad-soyad, telefon numarası, dans deneyimi seviyesi ve kesin kayıt formunda
                            katılım şekli ile partner adı alınabilir. Form gönderildiğinde, verilen rızanın zaman bilgisi veritabanında tutulur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">2. Veriler Nasıl Akıyor?</h2>
                        <p>
                            Form verisi önce sunucu tarafındaki doğrulamalardan ve IP tabanlı rate-limit kontrolünden geçer. Geçerli kayıtlar
                            Supabase veritabanına kaydedilir. Başarılı kayıt sonrasında kurum içi bildirim amacıyla Telegram üzerinden bir mesaj
                            gönderilebilir. Ayrıca form başarı olaylarında Google Tag Manager'a yalnızca ölçüm amacıyla seviye, kayıt türü,
                            form varyantı ve sayfa yolu gibi olay verileri gönderilebilir; ad ve telefon mevcut form olaylarının parçası değildir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">3. Verileri Satıyor muyuz?</h2>
                        <p>
                            Hayır. Kişisel veriler satılmaz ve bağımsız üçüncü kişilerin kendi ticari amaçları için veri listesi olarak verilmez.
                            Teknik hizmetlerin sunulması için kullanılan sağlayıcılar ise hizmetin gerektirdiği verileri işleyebilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">4. Harici Hizmetler</h2>
                        <p>
                            Supabase veritabanı ve Upstash Redis güvenlik/rate-limit altyapısında; Telegram kurum içi bildirimde; Google Tag Manager
                            ise ölçüm altyapısında kullanılmaktadır. WhatsApp, Instagram, Facebook, Messenger ve Google Maps bağlantıları ise
                            kullanıcının tercih ederek açtığı üçüncü taraf hizmetlerdir ve bu hizmetlerin kendi politika ve koşulları bulunur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">5. Çerezler ve Ölçüm</h2>
                        <p>
                            Site genelinde Google Tag Manager yüklenmektedir. Tag Manager konteynerinde hangi etiketlerin çalıştığına bağlı olarak
                            çerezler veya benzeri teknik tanımlayıcılar kullanılabilir. Reklam, pazarlama veya zorunlu olmayan analitik teknolojiler
                            açısından gerekli izin yönetimi ayrıca uygulanmalıdır; bu politika, teknik olarak çalıştırılmayan bir izin mekanizmasını
                            varmış gibi göstermeyi amaçlamaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">6. Reklam ve Duyurular</h2>
                        <p>
                            Kurum içi bilgilendirme ve hizmet duyuruları, amaçla bağlantılı ve ölçülü şekilde yapılabilir. Reklam, kampanya,
                            promosyon veya ticari elektronik ileti gönderimi için mevcut formdaki zorunlu rıza tek başına pazarlama izni olarak
                            kullanılmaz. Bu tür iletişimler için ayrıca uygun izin ve, gereken durumlarda İYS süreçleri yürütülür.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">7. Güvenlik ve Saklama</h2>
                        <p>
                            Kişisel verilere erişim; uygulama doğrulamaları, Supabase RLS ve sınırlı veritabanı yetkileriyle korunur. Veriler,
                            yalnızca ilgili amaçlar için gerekli olan süre boyunca ve varsa yasal saklama süreleri kapsamında tutulur.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">8. Haklar ve İletişim</h2>
                        <p>
                            KVKK kapsamındaki hak ve başvurular için <strong>info@fethiyetango.com</strong> adresinden bizimle iletişime geçebilirsiniz.
                            Ayrıntılı açıklama için sitedeki <strong>KVKK Aydınlatma Metni</strong> sayfasına bakabilirsiniz.
                        </p>
                    </section>

                    <p className="text-[10px] uppercase tracking-widest pt-10 border-t border-white/10">
                        Son Güncelleme: 8 Ekim 2026
                    </p>
                </div>
            </div>
        </main>
    );
}
