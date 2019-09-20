import { NativeModules } from 'react-native'

export const _locale = NativeModules.SettingsManager.settings.AppleLocale
export const [lang, region] = _locale.split('_', 2)
export const locale = `${lang}-${region}`
