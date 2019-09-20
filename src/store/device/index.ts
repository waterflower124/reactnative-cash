export interface State {
  version: string
  checkingVersion: boolean
  versionValid: boolean
  currentGenerationDate: Date // start of current app launch
  previousGenerationDate: Date|null // when the user has used the app last
  generation: number // number of launch counts after the user has logged-in
  rated: boolean // {@code true} when the user has been requested to rate the app
  lastRateRequest: Date|null // when the user was last requested to rate our app
}

export type Action = { type: '@Skeep/device--CHECK_VERSION', valid: boolean }
                   | { type: '@Skeep/device--CHECKING_VERSION' }
                   | { type: '@Skeep/device--APP_LAUNCHED' }
                   | { type: '@Skeep/device--APP_RATED', success: boolean }

export { default as reducers } from './reducers'
