import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
    tr: () => import('./dictionaries/tr.json').then((module) => module.default),
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    ru: () => import('./dictionaries/ru.json').then((module) => module.default),
    uk: () => import('./dictionaries/uk.json').then((module) => module.default),
    es: () => import('./dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
    dictionaries[locale]?.() ?? dictionaries.tr()
