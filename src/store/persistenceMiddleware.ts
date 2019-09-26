import { AsyncStorage }     from 'react-native'
import DeviceInfo           from 'react-native-device-info'
import { MiddlewareAPI }    from 'redux'
import { State }            from '.'
import { getCurrentRoute }  from './navigation/actions'

const PREFIX             = `@Skeep/${DeviceInfo.getReadableVersion()}_${DeviceInfo.getBuildNumber()}--`
export const APP_STORAGE = `${PREFIX}APP_STORAGE`

/**
 * @description Remove storage.
 * @returns {Promise<void>}
 */
export async function cleanStorage(): Promise<void> {
  return AsyncStorage.clear()
}

export async function getInitialState(): Promise<State|null> {
  const payload: string = await AsyncStorage.getItem(APP_STORAGE)
  if (payload !== null) {
    const state = JSON.parse(payload)
    if (__DEV__) {
      // console.log(state)
    }
    return state
  }

  return undefined
}

export async function saveInitialState(state: Partial<State>): Promise<void> {
  const payload = JSON.stringify(state || {})
  await AsyncStorage.setItem(APP_STORAGE, payload)
}

// TODO make it more performant (make sure the whitelisted keys are actually being changed)
export default <S>(whitelist: Array<keyof State>) => (store: MiddlewareAPI<S>) => (next: (_: any) => any) => (action: any) => {
  const result = next(action)

  const state     = store.getState()
  const saveState = whitelist.reduce((acc, x) => {
    acc[x] = state[x]
    return acc
  }, {})

  getInitialState()
    .then((initialState) => {
      // @ts-ignore
      if (['Welcome'].includes(getCurrentRoute(store.getState()).routeName) && initialState && initialState.session && initialState.session.token) {
        return Promise.resolve()
      }
      // noinspection JSIgnoredPromiseFromCall
      saveInitialState(saveState)
    })

  return result
}
