import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { TangoButton } from "@/components/ui/TangoButton"

interface LoginFormProps extends React.ComponentProps<"div"> {
  dict: any
  lang: string
}

export function LoginForm({
  className,
  dict,
  lang,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-white/5 bg-tango-dark/40 backdrop-blur-3xl shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-12">
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center mb-8">
                <h1 className="font-playfair text-4xl md:text-5xl font-black italic tracking-tighter text-tango-text uppercase leading-none">
                  {dict.title.split(' ')[0]} <br />
                  <span className="text-tango-red not-italic">{dict.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-tango-text/40 text-balance text-xs font-medium tracking-wide uppercase">
                  {dict.description}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-tango-gold/60 mb-1.5">{dict.emailLabel}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-tango-red/50 transition-all placeholder:text-white/10"
                />
              </Field>
              <Field>
                <div className="flex items-center mb-1.5">
                  <FieldLabel htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-tango-gold/60">{dict.passwordLabel}</FieldLabel>
                  <Link
                    href={`/${lang}/forgot-password`}
                    className="ml-auto text-[10px] uppercase tracking-widest font-bold text-tango-red/60 hover:text-tango-red transition-colors"
                  >
                    {dict.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-tango-red/50 transition-all"
                />
              </Field>
              <Field className="pt-2">
                <TangoButton type="submit" className="w-full h-14 italic" size="lg">
                  {dict.submit}
                </TangoButton>
              </Field>
              <FieldSeparator className="text-white/5 italic text-[9px] uppercase tracking-[0.3em]">
              </FieldSeparator>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-[0.2em] text-tango-gold/60">{dict.orContact}</FieldLabel>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-tango-black via-tango-black/20 to-transparent z-10 opacity-80" />
            <img
              src="/images/login-bg.webp"
              alt="Tango Login Background"
              className="absolute inset-0 h-full w-full object-cover select-none brightness-[0.6] sepia-[0.3] contrast-[1.1]"
            />
            <div className="absolute bottom-12 left-12 z-20">
              <div className="flex flex-col leading-none mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-tango-red ml-[0.2em]">Fethiye</span>
                <span className="text-2xl font-black uppercase tracking-[-0.02em] text-tango-text">Tango Kulübü</span>
              </div>
              <div className="text-tango-text/30 text-[9px] italic tracking-[0.4em] uppercase">Est. 2005 • Deep Passion</div>
            </div>
            {/* Overlay Shine */}
            <div className="absolute inset-0 z-15 bg-linear-to-tr from-tango-red/5 to-transparent pointer-events-none" />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
        {dict.terms.replace("{terms}", "").replace("{privacy}", "")}
        <Link href={`/${lang}/terms`} className="text-white/20 hover:text-tango-red transition-colors underline underline-offset-4 decoration-white/5">
          {dict.termsLink}
        </Link>
        {" & "}
        <Link href={`/${lang}/privacy`} className="text-white/20 hover:text-tango-red transition-colors underline underline-offset-4 decoration-white/5">
          {dict.privacyLink}
        </Link>
      </div>
      <div className="text-center mt-4">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-tango-red transition-all group">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m15 18-6-6 6-6" /></svg>
          {dict.backToHome}
        </Link>
      </div>
    </div>
  )
}
