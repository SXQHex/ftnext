import { LoginForm } from "@/app/[lang]/login/login-form"
import { getDictionary } from "@/get-dictionary"
import { Locale } from "@/i18n-config"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Global Style Radial Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(at_0%_0%,rgba(184,59,43,0.05)_0px,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(at_100%_100%,rgba(184,59,43,0.05)_0px,transparent_50%)]" />
      </div>

      <div className="relative pt-12 z-10 w-full max-w-sm md:max-w-4xl">
        <LoginForm dict={dict.login} lang={lang} />
      </div>
    </div>
  )
}
