import { NativeModules } from 'react-native'

import { default as DefaultRate } from './default'
export { storeUrl } from './default'

export default class Rate {
  static async request(): Promise<boolean> {
    // https://stackoverflow.com/questions/48218744/what-is-the-operator-precedence-of-await
    return await rateIos() || DefaultRate.request()
  }
}

// iOS-specific
const { Skeep } = NativeModules
interface RateOptions {
  timeout: number
  maxIterations: number
}
const defaultRateOptions: RateOptions = {
  timeout: 750,
  maxIterations: 6,
}
function rateIos(options: RateOptions = defaultRateOptions): Promise<boolean> {
  return Skeep.openStoreReview(options)
}
