import { AuthToken, User, UserAccount } from '../../httpapi'

export interface State {
    token?: AuthToken
    user?: User
    accounts: Array<UserAccount>
    newsRequestEnabled: boolean
}

export type Action
    = { type: '@Skeep/session--REFRESH_USER', user: User }
    | { type: '@Skeep/session--LOAD_ACCOUNTS', accounts: Array<UserAccount> }
    | { type: '@Skeep/session--ADD_ACCOUNT', account: UserAccount }
    | { type: '@Skeep/session--LOGIN', token: AuthToken, user: User }
    | { type: '@Skeep/session--LOGOUT' }
    | { type: '@Skeep/session--DISABLE_NEWS_REQUEST' }

export { default as reducers } from './reducers'
