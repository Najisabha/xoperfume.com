import 'server-only'
import type { Locale } from './i18n-config'

const dictionaries = {
    en: () => import('../dictionaries/en.json').then((module) => module.default),
    ar: () => import('../dictionaries/ar.json').then((module) => module.default),
    he: () => import('../dictionaries/he.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) =>
    dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.en()
