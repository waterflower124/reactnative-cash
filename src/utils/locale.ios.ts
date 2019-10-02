import { NativeModules } from 'react-native'

// export const _locale = NativeModules.SettingsManager.settings.AppleLocale
export const getLocale = () => {
    let _locale = NativeModules.SettingsManager.settings.AppleLocale;
    if (_locale === undefined) {
        // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
        _locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
        if (_locale == undefined) {
            _locale = "en" // default language
        }
    }
    return _locale;
}

export const _locale = getLocale();
console.log("_locale", _locale);
export const [lang, region] = _locale.split('_', 2)
export const locale = `${lang}-${region}`


