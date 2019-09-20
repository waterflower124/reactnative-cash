import { Alert, Linking, Platform } from 'react-native'
import { Sentry } from 'react-native-sentry'
import AppConfig from '../config'
import translate from '../translate'

export default class Rate {
  static async request(): Promise<boolean> {
    if (await alert()) {
      try {
        await Linking.openURL(storeUrl)
        return true
      } catch (err) {
        Sentry.captureException(err)
        return false
      }
    }

    return false
  }
}

// URL to redirect to
export const storeUrl = Platform.select({
  ios: `itms-apps://itunes.apple.com/app/id${AppConfig.appleAppId}?action=write-review`,
  android: `https://play.google.com/store/apps/details?id=${AppConfig.googleAppId}`,
  default: AppConfig.websiteUrl,
})

// Displayed when there are no other options available
function alert(): Promise<boolean> {
  return new Promise(resolve => {
    Alert.alert(
      translate('alerts.rateMyApp.title'),
      translate('alerts.rateMyApp.message'),
      [
        {
          style: 'default',
          text: translate('alerts.rateMyApp.confirm'),
          onPress: () => resolve(true),
        },
        {
          style: 'cancel',
          text: translate('alerts.rateMyApp.cancel'),
          onPress: () => resolve(false),
        },
      ],
      {
        cancelable: false,
      },
    )
  })
}
