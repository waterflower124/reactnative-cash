import { Alert, AlertButton, Linking, Share, ShareContent, ShareOptions } from 'react-native'
import * as ViewShot                                                      from 'react-native-view-shot'
import urlparse                                                           from 'url-parse'
import { Action }                                                         from '.'
import { Thunk }                                                          from '..'
import AppConfig                                                          from '../../config'
import { AuthToken, User, UserAccount }                                   from '../../httpapi'
import * as sessions                                                      from '../../httpapi/sessions'
import * as userAccounts                                                  from '../../httpapi/userAccounts'
import * as users                                                         from '../../httpapi/users'
import { ScreenName }                                                     from '../../Routes'
import translate                                                          from '../../translate'
import * as promises                                                      from '../../utils/promises'
import { createHttpApi, createHttpForTokenApi }                           from '../http'
import * as navigationActions                                             from '../navigation/actions'
import { cleanStorage, getInitialState }                                  from '../persistenceMiddleware'

export function refreshUser(user: User): Action {
  return {type: '@Skeep/session--REFRESH_USER', user}
}

export function disableNewsRequest(): Action {
  return {type: '@Skeep/session--DISABLE_NEWS_REQUEST'}
}

export function addAccount(account: UserAccount): Action {
  return {type: '@Skeep/session--ADD_ACCOUNT', account}
}

export function loadAccounts(accounts: Array<UserAccount>): Action {
  return {type: '@Skeep/session--LOAD_ACCOUNTS', accounts}
}

export function login(token: AuthToken, user: User): Action {
  return {type: '@Skeep/session--LOGIN', token, user}
}

export function whenLoggedIn(selectAccount?: UserAccount['id']): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    await Promise.all([
      dispatch(fetchAccounts()),
      dispatch(fetchUser()),

      // wait at least 750ms to perform the actions above
      // but might be longer if needed
      new Promise(resolve => setTimeout(resolve, 750)),
    ])

    if (selectAccount) {
      dispatch(navigationActions.openMenu())
    }

    const state = getState()
    const initialState = await getInitialState()

    if (initialState && initialState.session && initialState.session.token) {
      if (state.session.accounts.length > 0) {
        if (state.navigation.currentAccount.provider.name.toLowerCase() === 'facebook') {
          dispatch(navigationActions.navigateTo('SocialApp', true))
          // dispatch(navigationActions.openMenu())
          dispatch(navigationActions.loadMenuStats())
        } else if (state.navigation.currentAccount.provider.name.toLowerCase() === 'instagram') {
          dispatch(navigationActions.navigateTo('MonetizationDeal', true))
        } else {
          dispatch(navigationActions.navigateTo('Subscription', true))
        }
      } else {
        dispatch(navigationActions.navigateTo('SelectAccount', true))
      }
    }
  }
}

export function afterScanResult(): Thunk<void> {
  return (dispatch, getState) => {
    const state = getState()
    if (state.navigation.currentAccount.provider.name.toLowerCase() === 'facebook') {
      dispatch(navigationActions.navigateTo('SocialApp', true))
      dispatch(navigationActions.openMenu())
    } else if (state.navigation.currentAccount.provider.name.toLowerCase() === 'instagram') {
      dispatch(navigationActions.navigateTo('MonetizationDeal', true))
    } else {
      dispatch(navigationActions.navigateTo('Subscription', true))
    }
  }
}

export function appStart(): Thunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const initialState = await getInitialState()
    if (initialState && initialState.session && initialState.session.token) {
      await dispatch(loginToken(initialState.session.token))
      await dispatch(whenLoggedIn())
      return true
    }

    const state = getState()
    if (state.session.token) {
      await dispatch(whenLoggedIn())
      return true
    }

    return false
  }
}

export function loginToken(token: string): Thunk<Promise<void>> {
  return async (dispatch) => {
    const http = createHttpForTokenApi(token)
    const user = await users.getMyProfile(http)
    dispatch(login(token, user))
  }
}

export function signin(email: string, password: string): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const http = createHttpApi(getState())

    dispatch(navigationActions.signinRequest())
    const result = await sessions.create(http, email, password)
    if (result.success === true) {
      dispatch(navigationActions.signinSuccess())
      dispatch(login(result.token, result.user))
      await dispatch(whenLoggedIn())
    } else {
      dispatch(navigationActions.signinFailure(result.reason))
    }
  }
}

export function signup(email: string, password: string): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)

    dispatch(navigationActions.signupRequest())
    const result = await users.create(http, email, password)
    if (result.success === true) {
      dispatch(navigationActions.signupSuccess())
      dispatch(login(result.token, result.user))
      await dispatch(whenLoggedIn())
    } else {
      dispatch(navigationActions.signupFailure(result.reason))
    }
  }
}

export function lostPassword(email: string): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)

    dispatch(navigationActions.lostPasswordRequest())
    await users.lostPassword(http, email)
    dispatch(navigationActions.lostPasswordSuccess())
  }
}

export function recoverPassword(password: string): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)

    dispatch(navigationActions.recoverPasswordRequest())
    await users.recoverPassword(http, password)
    dispatch(navigationActions.recoverPasswordSuccess())
  }
}

export function jumpToRouteIfLogged(routeName: ScreenName): Thunk<void> {
  return (dispatch, getState) => {
    const state = getState()

    if (typeof state.session.token === 'string') {
      dispatch(navigationActions.navigateTo(routeName, true))
    }
  }
}

export function logout(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const http = createHttpApi(getState())
    await sessions.destroy(http)
      .catch(() => Promise.resolve()) // FIXME: Force to resolve call
    await cleanStorage()
    dispatch(navigationActions.navigateTo('Signin', true))
  }
}

export function fetchUser(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    if (!state.session.token) {
      return
    }
    const http = createHttpApi(state)

    const user = await users.getMyProfile(http)
    dispatch(refreshUser(user))
  }
}

export function fetchAccounts(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    if (!state.session.token) {
      return
    }
    const http = createHttpApi(state)

    const accounts = await userAccounts.getMyAccounts(http)
    dispatch(loadAccounts(accounts))
  }
}

export function createEmailAccount(email: string, password: string): Thunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const http = createHttpApi(getState())
    dispatch(navigationActions.addAccountRequest())
    const resp = await userAccounts.createEmail(http, email, password)
    if (resp.success === true) {
      dispatch(addAccount(resp.result))
      dispatch(navigationActions.setCurrentAccount(resp.result))
      dispatch(navigationActions.addAccountSuccess())
    } else {
      dispatch(navigationActions.addAccountFailure(resp.reason))
    }
    return resp.success
  }
}

export function createFacebookAccount(email: string, password: string, cookies: {}): Thunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const http = createHttpApi(getState())

    const resp = await userAccounts.createFacebook(http, email, password, cookies)
    if (resp.success) {
      dispatch(addAccount(resp.result))
      dispatch(navigationActions.setCurrentAccount(resp.result))
    }

    return resp.success
  }
}

export function createInstagramAccount(email: string, password: string): Thunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    const http = createHttpApi(getState())

    dispatch(navigationActions.addAccountRequest())
    const resp = await userAccounts.createInstagram(http, email, password)
    if (resp.success === true) {
      dispatch(addAccount(resp.result))
      dispatch(navigationActions.setCurrentAccount(resp.result))
      dispatch(navigationActions.addAccountSuccess())
    } else {
      dispatch(navigationActions.addAccountFailure(resp.reason))
    }

    return resp.success
  }
}

export function deepLink(url?: string): Thunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    if (!url) {
      url = await Linking.getInitialURL()
    }
    if (!url) {
      return false
    }

    const data = urlparse(url)
    if (data.protocol !== 'skeep:') {
      return false
    }

    const querydata = urlparse.qs.parse(data.toString())
    const state     = getState()

    switch (data.hostname) {
      case 'oauth':
        if (!state.session.token) {
          return false
        }
        await dispatch(whenLoggedIn(querydata['account'])) // tslint:disable-line:no-string-literal
        return true

      case 'password_recovery':
        await dispatch(loginToken(querydata['token'])) // tslint:disable-line:no-string-literal
        dispatch(navigationActions.navigateTo('PasswordRecovery', true))
        return true

      default:
        return false
    }
  }
}

export function patchLanguage(lang: string): Thunk<Promise<void>> {
  return async (_dispatch, getState) => {
    const http = createHttpApi(getState())
    await users.patchMyProfile(http, {lang})
  }
}

export function openPersonalArchiveDownloadPage(): Thunk<void> {
  return (_dispatch, getState) => {
    const state = getState()
    const url   = `${AppConfig.apiUrl}/users/${state.session.token}/archive.zip`
    Linking.openURL(url)
  }
}

/**
 * @description Open an Alert for sharing scan result.
 */
export function shareScanResult(): Thunk<Promise<void>> {
  return async (_dispatch, getState) => new Promise<void>(resolve => {
    const alertButtons: AlertButton[] = [
      {
        text   : translate('cancel'),
        style  : 'cancel',
        onPress: resolve,
      },
      {
        text : translate('share'),
        style: 'default',
        async onPress() {
          const content: ShareContent = {
            title: translate('share_publication', {count: detectedItems.toString()}),
            url: await ViewShot.captureScreen({result: 'tmpfile'}),
          }
          const options: ShareOptions = {}
          await Share.share(content, options)
          resolve()
        },
      },
    ]
    const detectedItems = promises.unwrap(getState().navigation.menuStats).detected_items
    Alert.alert(
      translate('screens.scan_result.detected') + ' ' +
      translate('screens.scan_result.detected_items', {count: detectedItems.toString()}),
      translate('share_message'),
      alertButtons, {cancelable: false})
  })
}
