import type { Metadata } from "next";
import "@/app/globals.css";
import { ModalProvider } from "@/components/ModalContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Inter, Playfair_Display } from "next/font/google";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import AnalyticsConsent from "@/components/AnalyticsConsent";

// Fontları Tailwind 4 değişkenleri gibi kullanmak için tanımlıyoruz
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
    params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL("https://fethiyetango.com"),
    title: {
      default: dict.seo.title,
      template: `%s | ${dict.seo.title}`,
    },
    description: dict.seo.description,
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
    openGraph: {
      siteName: "Fethiye Tango Kulübü",
      locale: lang === "en"
        ? "en_US"
        : lang === "tr"
          ? "tr_TR"
          : lang === "ru"
            ? "ru_RU"
            : lang === "uk"
              ? "uk_UA"
              : "es_ES",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;

  // 2. Gelen lang bizim desteklediklerimizden biri mi? (fr gelirse hayır diyecek)
  const isSupported = i18n.locales.includes(rawLang as Locale);

  // 3. Desteklenmiyorsa varsayılana (tr) dön, destekleniyorsa olduğu gibi kullan
  const lang = (isSupported ? rawLang : i18n.defaultLocale) as Locale;

  const dict = await getDictionary(lang);
  
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased selection:bg-tango-red selection:text-white`}
      >
        <AnalyticsConsent
          dict={{
            ...dict.cookieConsent,
            privacyHref: "/" + lang + "/gizlilik",
          }}
          gtmId="GTM-MS6D5LZQ"
        />
          <ModalProvider dict={{
            header: dict.trialFormHeader,
            form: {
              ...dict.formCommon,
              ...dict.contactForm,
            }
          }}>
            {/* Sayfa Yapısı: Header - İçerik - Footer */}
            <div className="flex min-h-screen flex-col">
              <Header navigation={dict.navigation} lang={lang} />

              {/* Sayfaların içeriği buraya gelecek */}
              <main className="flex-1 relative overflow-x-clip">
                {children}
              </main>

              <Footer content={dict.footer} navigation={dict.navigation} lang={lang} />
            </div>
            <JsonLd lang={lang} />
          </ModalProvider>
      </body>
    </html>
  );
}
