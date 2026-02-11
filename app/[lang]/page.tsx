import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import { CTASection } from "@/components/home/CTASection";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  // Trigger Rebuild
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="relative w-full">
      <HeroSection content={dict.home.hero} />
      <FeatureSection content={dict.home.features} />
      <CTASection content={dict.home.cta} />
    </main>
  );
}
