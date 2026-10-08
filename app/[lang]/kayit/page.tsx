import RegistrationForm from "@/components/RegistrationForm";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata = {
    title: "Kayıt",
    robots: { index: false, follow: false },
};

type PageProps = {
    params: Promise<{ lang: Locale }>;
};

export default async function RegistrationPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const formDict = {
        ...dict.formCommon,
        ...dict.registrationForm,
    };

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 md:px-8">
            <div className="container mx-auto max-w-xl">
                <PageHeader eyebrow="Kesin Kayıt" title="Kayıt Formu" />
                <RegistrationForm dict={formDict} />
            </div>
        </main>
    );
}