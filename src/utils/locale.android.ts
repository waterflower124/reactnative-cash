import { NativeModules } from 'react-native'

const _locale = NativeModules.I18nManager.localeIdentifier
export const [lang, region] = _locale.split('_', 2)
export const locale = `${lang}-${region}`
