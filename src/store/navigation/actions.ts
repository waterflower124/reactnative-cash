import { NavigationActions, StackActions, DrawerActions }  from 'react-navigation'
import { Action }                           from '.'
import { Thunk }                            from '..'
import { UserAccount, UserAccountStats }    from '../../httpapi'
import * as userAccounts                    from '../../httpapi/userAccounts'
import { ScreenName }                       from '../../Routes'
import { createHttpApi }                       from '../http'

export interface CurrentRoute {
  id: string,
  routeName: string,
}

export function openMenu(): Action {
  // return {type: '@Skeep/navigation--OPEN_MENU'}
  return { type: DrawerActions.OPEN_DRAWER }
  // const action = NavigationActions.openDrawer()
  // return action
}

export function closeMenu(): Action {
  // return {type: '@Skeep/navigation--CLOSE_MENU'}
  return { type: DrawerActions.CLOSE_DRAWER }
}

export function pushSnapshot(): Action {
  return {type: '@Skeep/navigation--PUSH_SNAPSHOT'}
}

export function popSnapshot(): Action {
  return {type: '@Skeep/navigation--POP_SNAPSHOT'}
}

export function setCurrentAccount(currentAccount: UserAccount): Action {
  return {type: '@Skeep/navigation--SET_CURRENT_ACCOUNT', currentAccount}
}

export function signinRequest(): Action {
  return {type: '@Skeep/navigation--SIGNIN_REQUEST'}
}

export function signinSuccess(): Action {
  return {type: '@Skeep/navigation--SIGNIN_SUCCESS'}
}

export function signinFailure(error: ErrorReasons): Action {
  return {type: '@Skeep/navigation--SIGNIN_FAILURE', error}
}

export function signupRequest(): Action {
  return {type: '@Skeep/navigation--SIGNUP_REQUEST'}
}

export function signupSuccess(): Action {
  return {type: '@Skeep/navigation--SIGNUP_SUCCESS'}
}

export function signupFailure(error: ErrorReasons): Action {
  return {type: '@Skeep/navigation--SIGNUP_FAILURE', error}
}

export function lostPasswordRequest(): Action {
  return {type: '@Skeep/navigation--LOST_PASSWORD_REQUEST'}
}

export function lostPasswordSuccess(): Action {
  return {type: '@Skeep/navigation--LOST_PASSWORD_SUCCESS'}
}

export function lostPasswordFailure(error: ErrorReasons): Action {
  return {type: '@Skeep/navigation--LOST_PASSWORD_FAILURE', error}
}

export function recoverPasswordRequest(): Action {
  return {type: '@Skeep/navigation--RECOVER_PASSWORD_REQUEST'}
}

export function recoverPasswordSuccess(): Action {
  return {type: '@Skeep/navigation--RECOVER_PASSWORD_SUCCESS'}
}

export function recoverPasswordFailure(error: ErrorReasons): Action {
  return {type: '@Skeep/navigation--RECOVER_PASSWORD_FAILURE', error}
}

export function addAccountRequest(): Action {
  return {type: '@Skeep/navigation--ADD_ACCOUNT_REQUEST'}
}

export function addAccountSuccess(): Action {
  return {type: '@Skeep/navigation--ADD_ACCOUNT_SUCCESS'}
}

export function addAccountFailure(error: ErrorReasons): Action {
  return {type: '@Skeep/navigation--ADD_ACCOUNT_FAILURE', error}
}

export function menuStatsRequest(): Action {
  return {type: '@Skeep/navigation--MENU_STATS_REQUEST'}
}

export function menuStatsSuccess(menuStats: UserAccountStats): Action {
  return {type: '@Skeep/navigation--MENU_STATS_SUCCESS', menuStats}
}

export function menuStatsFailure(error: Error): Action {
  return {type: '@Skeep/navigation--MENU_STATS_FAILURE', error}
}

/**
 * @description Returns current route object from state.
 * @param state
 */
export function getCurrentRoute(state): CurrentRoute {
  return state.nav.routes[state.nav.routes.length - 1]
}

/**
 * @description Check if can back from state.
 * @param state
 */
export function canBack(state): boolean {
  return state.nav.routes.length > 1
}

/**
 * @description NavigationActions wrapper.
 * @param routeName
 * @param reset
 * @param params
 */
export function navigateTo(routeName: ScreenName, reset?: boolean, params?: Object): Action {
  const action = NavigationActions.navigate({ routeName: routeName as string, params })

  if (reset) {
    return StackActions.reset({ index  : 0, actions: [action] })
  }
  return action
}

export function navigateToAccountSetup(): Thunk<void> {
  return (dispatch, getState) => {
    const {navigation: {currentAccount}} = getState()

    if (currentAccount.provider.name.toLowerCase() === 'facebook') {
      dispatch(navigateTo('AddFacebookAccount', false, {currentAccount: true}))
    } else if (currentAccount.provider.name.toLowerCase() === 'instagram') {
      dispatch(navigateTo('AddInstagramAccount', false, {currentAccount: true}))
    } else {
      dispatch(navigateTo('AddEmailAccount', false, {currentAccount: true}))
    }
  }
}

export function toggleMulti(): Thunk<void> {
  return (dispatch, getState) => {
    const currentRoute = getCurrentRoute(getState()).routeName
    switch (currentRoute) {
      case 'Subscription':
        return dispatch(navigateTo('SubscriptionList'))
        // return dispatch(navigateTo('SubscriptionList', true))

      case 'SubscriptionList':
        return dispatch(navigateTo('Subscription'))
        // return dispatch(navigateTo('Subscription', true))

      default:
        // do nothing
        return
    }
  }
}

/**
 * @description Go back.
 */
export function navigateBack(): Action {
  return NavigationActions.back({})
}

export function selectAccount(accountId: string): Thunk<void> {
  return (dispatch, getState) => {
    const state   = getState()
    const account = state.session.accounts.find(x => x.id === accountId)
    dispatch(setCurrentAccount(account))
  }
}

export function loadMenuStats(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)
    const currentAccount = state.navigation.currentAccount
    dispatch(menuStatsRequest())
    try {
      const menuStats = await userAccounts.getStats(http, currentAccount.id)
      dispatch(menuStatsSuccess(menuStats))
    } catch (err) {
      dispatch(menuStatsFailure(err))
    }
  }
}

export function refreshCurrentAccount(): Thunk<Promise<void>> {
  return async (_dispatch, getState) => {
    const state = getState()
    const http = createHttpApi(state)
    const currentAccount = state.navigation.currentAccount
    await userAccounts.refresh(http, currentAccount.id)
  }
}
