export default function GizlilikPage() {
    return (
        <main className="min-h-screen pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-black text-tango-red uppercase tracking-tighter mb-8">
                    GİZLİLİK POLİTİKASI
                </h1>

                <div className="space-y-6 text-[#efe6e3]/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">1. Bilgi Toplama</h2>
                        <p>Fethiye Tango Kulübü, sitemizi ziyaret ettiğinizde cihazınız, tarayıcınız ve IP adresiniz gibi anonim teknik verileri deneyiminizi iyileştirmek amacıyla otomatik olarak toplayabilir.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">2. Çerezler (Cookies)</h2>
                        <p>Sitemizde, tercihlerinizi hatırlamak ve trafik analizi yapmak için çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz, ancak bu durum sitenin bazı özelliklerinin çalışmasını kısıtlayabilir.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">3. Üçüncü Taraf Bağlantıları</h2>
                        <p>Sitemiz; Instagram, Facebook ve Google Maps gibi üçüncü taraf platformlara linkler içermektedir. Bu platformların kendilerine has gizlilik politikalarından Fethiye Tango Kulübü sorumlu tutulamaz.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#efe6e3]">4. Veri Güvenliği</h2>
                        <p>Verileriniz SSL şifreleme teknolojisi ile korunmaktadır. Bilgilerinizin güvenliği için endüstri standartlarında önlemler almaktayız.</p>
                    </section>

                    <p className="text-[10px] uppercase tracking-widest pt-10 border-t border-white/10">
                        Yürürlük Tarihi: {new Date().toLocaleDateString('tr-TR')}
                    </p>
                </div>
            </div>
        </main>
    );
}