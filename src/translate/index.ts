import * as countries             from 'i18n-iso-countries'
import moment                     from 'moment'
import { AsyncStorage }           from 'react-native'
import { lang as deviceLanguage } from '../utils/locale'

import 'intl'
import 'intl/locale-data/jsonp/en'
import 'intl/locale-data/jsonp/fr'
import 'moment/locale/fr'
import 'numeral/locales/fr'
countries.registerLocale(require('i18n-iso-countries/langs/fr'))
countries.registerLocale(require('i18n-iso-countries/langs/en'))

const MESSAGES = {
    fr: require('./fr.json') as Messages,
    en: require('./en.json') as Messages,
}

export type Language = keyof typeof MESSAGES
export const availableLanguages: Language[] = Object.keys(MESSAGES) as any

export interface TranslateParameters {
    [key: string]: string
}

interface Messages {
    [id: string]: string
}

const DEFAULT_LANGUAGE: Language = 'en'

let currentLanguage: Language = null

export function getCurrentLanguage(): Language {
    if (!currentLanguage) {
        if (deviceLanguage in MESSAGES) {
            return deviceLanguage as Language
        }
        return DEFAULT_LANGUAGE
    }
    return currentLanguage
}

export function setCurrentLanguage(language: string): boolean {
    if (!language || !(language in MESSAGES)) {
        return false
    }
    currentLanguage = language as Language
    return true
}

export async function restoreLanguage() {
    try {
        const language = await AsyncStorage.getItem('@@Skeep/LANG')
        setCurrentLanguage(language)
    } catch (err) {
        setCurrentLanguage(deviceLanguage)
    }
}

export async function persistLanguage(language: string): Promise<void> {
    if (setCurrentLanguage(language)) {
        await AsyncStorage.setItem('@@Skeep/LANG', currentLanguage)
    }
}

export function getMessageById(id: string, language: Language = getCurrentLanguage()): string {
    const messages = MESSAGES[language]
    if (!messages || !messages[id]) {
        return null
    }
    return messages[id]
}

export default function translate(id: string, values?: TranslateParameters, defaultMessage?: string): string {
    const message = getMessageById(id)

    if (!message) {
        if (!defaultMessage) {
            return id
        }
        return formatMessage(defaultMessage, values || {})
    }
    return formatMessage(message, values || {})
}

export function formatMessage(message: string, values: TranslateParameters): string {
    for (const key in values) {
        if (!values.hasOwnProperty(key)) {
            continue
        }
        const value = values[key]
        message     = message.replace('{' + key + '}', value)
    }

    return message
}

export function formatDate(date: number): string {
    return moment(date).format('L')
}

export function asAvailableLanguage(s: string, defaultLanguage?: Language): Language {
    if ((availableLanguages as Array<string>).includes(s)) {
        return s as Language
    }
    if (defaultLanguage) {
        return defaultLanguage
    }
    throw new Error(`Language "${s}" is not supported`)
}
