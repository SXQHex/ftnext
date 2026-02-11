export const i18n = {
  defaultLocale: 'tr',
  locales: ['tr', 'en', 'ru', 'uk', 'es'],
} as const

export type Locale = (typeof i18n)['locales'][number]
