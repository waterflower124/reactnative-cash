import { UserAccount, UserAccountStats } from '../../httpapi'

import { NavigationAction, NavigationState } from 'react-navigation'

export interface State {
    current: NavigationState
    snapshots: Array<State>
    menuOpen: boolean
    currentAccount: UserAccount
    signin?: PromiseState<void, ErrorReasons>
    signup?: PromiseState<void, ErrorReasons>
    lostPassword?: PromiseState<void, ErrorReasons>
    recoverPassword?: PromiseState<void, ErrorReasons>
    addAccount?: PromiseState<void, ErrorReasons>
    menuStats: PromiseState<UserAccountStats>
}

export type Action
    = { type: '@Skeep/navigation--OPEN_MENU' }
    | { type: '@Skeep/navigation--CLOSE_MENU' }

    | { type: '@Skeep/navigation--PUSH_SNAPSHOT' }
    | { type: '@Skeep/navigation--POP_SNAPSHOT' }

    | { type: '@Skeep/navigation--SET_CURRENT_ACCOUNT', currentAccount: UserAccount }
    | { type: '@Skeep/session--LOAD_ACCOUNTS', accounts: Array<UserAccount> }
    | { type: '@Skeep/session--ADD_ACCOUNT', account: UserAccount }

    | { type: '@Skeep/navigation--SIGNIN_REQUEST' }
    | { type: '@Skeep/navigation--SIGNIN_SUCCESS' }
    | { type: '@Skeep/navigation--SIGNIN_FAILURE', error: ErrorReasons }

    | { type: '@Skeep/navigation--SIGNUP_REQUEST' }
    | { type: '@Skeep/navigation--SIGNUP_SUCCESS' }
    | { type: '@Skeep/navigation--SIGNUP_FAILURE', error: ErrorReasons }

    | { type: '@Skeep/navigation--LOST_PASSWORD_REQUEST' }
    | { type: '@Skeep/navigation--LOST_PASSWORD_SUCCESS' }
    | { type: '@Skeep/navigation--LOST_PASSWORD_FAILURE', error: ErrorReasons }

    | { type: '@Skeep/navigation--RECOVER_PASSWORD_REQUEST' }
    | { type: '@Skeep/navigation--RECOVER_PASSWORD_SUCCESS' }
    | { type: '@Skeep/navigation--RECOVER_PASSWORD_FAILURE', error: ErrorReasons }

    | { type: '@Skeep/navigation--ADD_ACCOUNT_REQUEST' }
    | { type: '@Skeep/navigation--ADD_ACCOUNT_SUCCESS' }
    | { type: '@Skeep/navigation--ADD_ACCOUNT_FAILURE', error: ErrorReasons }

    | { type: '@Skeep/navigation--MENU_STATS_REQUEST' }
    | { type: '@Skeep/navigation--MENU_STATS_SUCCESS', menuStats: UserAccountStats }
    | { type: '@Skeep/navigation--MENU_STATS_FAILURE', error: Error }

    | { type: '@Skeep/session--LOGOUT' }
    | NavigationAction

export { reducers } from './reducers'
