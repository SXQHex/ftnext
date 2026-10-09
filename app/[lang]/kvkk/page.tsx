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
                        <p>
                            Bu internet sitesi ve Fethiye Tango Kulübü faaliyetleri kapsamında işlenen kişisel veriler bakımından veri sorumlusu,
                            siteyi ve ilgili faaliyetleri yürüten Fethiye Tango Kulübü’dür. İletişim: <strong>info@fethiyetango.com</strong> ve
                            <strong>+90 544 641 57 45</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">2. İşlenen Kişisel Veriler</h2>
                        <p>
                            İletişim formundan ad-soyad, telefon numarası ve seçtiğiniz dans deneyimi seviyesi; kesin kayıt formundan bunlara ek olarak
                            katılım şekli ve partner adı alınabilir. Form gönderiminde zorunlu onaya ilişkin zaman bilgisi sistemde tutulur; isteğe bağlı pazarlama izni verilmişse bu tercihin zaman bilgisi de ayrıca tutulur.
                            Güvenlik ve kötüye kullanımı önleme amacıyla IP adresi veya istemci IP’sinin proxy başlıklarındaki karşılığı rate-limit
                            sistemi tarafından işlenebilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">3. İşleme Amaçları ve Hukuki Sebepler</h2>
                        <p>
                            Veriler; bilgi ve iletişim taleplerini yanıtlamak, kayıt taleplerini almak ve yürütmek, ders/etkinlik süreçlerini
                            planlamak, iletişim kurmak, hizmet güvenliğini ve kötüye kullanımı önlemek, kurum içi istatistik ve hizmet geliştirme
                            çalışmaları yapmak ve mevzuattan doğan yükümlülükleri yerine getirmek amacıyla işlenebilir.
                        </p>
                        <p>
                            Form üzerinden açık rıza alınan işleme faaliyetleri bakımından hukuki sebep ilgili kişinin açık rızasıdır. Güvenlik,
                            kötüye kullanımı önleme ve kanunen gerekli kayıtlar bakımından Kanun’da öngörülen diğer işleme şartları ayrıca
                            uygulanabilir. Her amaç için ayrı bir hukuki sebep esas alınır; aydınlatma metni açık rızanın yerine geçmez.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">4. Verilerin Kullanımı ve Paylaşım Sınırı</h2>
                        <p>
                            Kişisel verileriniz satılmaz. Verileriniz bağımsız üçüncü kişilere kendi amaçları için ticari veri olarak verilmez.
                            Bununla birlikte sitenin teknik olarak çalışması için hizmet alınan sağlayıcılar veri alıcısı veya veri işleyeni konumunda
                            olabilir. Mevcut teknik akışta form verileri ve teknik güvenlik verileri aşağıdaki hizmetlerde işlenebilir:
                        </p>
                        <ul>
                            <li><strong>Supabase:</strong> form kayıtlarının veritabanında tutulması.</li>
                            <li><strong>Upstash Redis:</strong> IP tabanlı rate-limit ve kötüye kullanım önleme.</li>
                            <li><strong>Telegram:</strong> form başarıyla kaydedildiğinde kurum içi bildirim mesajının gönderilmesi; bu mesajda ad, telefon ve seviye, kesin kayıtta ayrıca partner bilgisi bulunabilir.</li>
                            <li><strong>Google Tag Manager / Google hizmetleri:</strong> form başarı olaylarına ilişkin ölçüm verileri; mevcut kodda ad ve telefon GTM olayına gönderilmez, ancak container yapılandırmasına göre ek etiketler farklı veri işleyebilir.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">5. Yurt Dışına Aktarım</h2>
                        <p>
                            Kullanılan bazı teknoloji sağlayıcılarının altyapısı Türkiye dışında bulunabilir veya veri işleme faaliyetleri yurt dışında
                            gerçekleşebilir. Özellikle Supabase, Upstash, Telegram ve Google hizmetleri bakımından yurt dışı aktarımı söz konusu olabilir.
                            Böyle bir aktarım, 6698 sayılı Kanun’un 9. maddesinde öngörülen şartlar ve uygun güvenceler çerçevesinde yürütülmelidir.
                            Bu metin, tek başına bir yurt dışı aktarım hukuki mekanizması oluşturmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">6. Reklam, Duyuru ve Ticari İletişim</h2>
                        <p>
                            Mevcut formdaki zorunlu açık rıza, reklam veya pazarlama izni olarak kullanılmaz. Kampanya, promosyon, reklam veya
                            ticari elektronik ileti amacıyla iletişim kurulacaksa ayrıca ve özgür iradeye dayalı uygun bir ticari iletişim izni
                            alınması gerekir. SMS, e-posta veya arama gibi ticari elektronik iletilerde 6563 sayılı Kanun ve İleti Yönetim Sistemi
                            (İYS) kapsamındaki yükümlülükler ayrıca uygulanır.
                        </p>
                        <p>
                            Kişisel veriler, kurum içi istatistik, iletişim, bilgilendirme ve hizmet duyuruları gibi yukarıdaki amaçlarla,
                            belirli ve ölçülü şekilde kullanılabilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">7. Saklama Süresi</h2>
                        <p>
                            Veriler, işleme amaçları için gerekli süre boyunca ve varsa ilgili mevzuatta öngörülen sürelerle sınırlı olarak saklanır.
                            Amaç ortadan kalktığında veya yasal saklama yükümlülüğü sona erdiğinde uygun yöntemle silinir, yok edilir veya anonim hale getirilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">8. KVKK Kapsamındaki Haklarınız</h2>
                        <p>
                            Kişisel verilerinizle ilgili Kanun’un 11. maddesi kapsamındaki haklarınızı kullanabilirsiniz. Taleplerinizi
                            <strong>info@fethiyetango.com</strong> üzerinden iletebilirsiniz. Başvurular, kimlik doğrulaması ve başvurunun niteliğine
                            göre gerekli güvenlik kontrolleri yapılarak mevzuattaki usule uygun şekilde değerlendirilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">9. Güvenlik</h2>
                        <p>
                            Kişisel verilerin hukuka aykırı işlenmesini, erişilmesini ve kaybolmasını önlemek amacıyla teknik ve idari tedbirler
                            uygulanır. Veritabanı erişimi RLS ile sınırlandırılmış, herkese açık roller için yalnızca gerekli kayıt işlemleri açılmıştır.
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
