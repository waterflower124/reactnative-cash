import { MiddlewareAPI }      from 'redux'
import { HttpError } from '../httpapi/http'

import * as navigationActions from './navigation/actions'
import * as sessionActions    from './session/actions'

export default (store: MiddlewareAPI<any>) => (next: <T>(action: T) => any) => (action: any) => {
    let result
    try {
        result = next(action)
    } catch (err) {
        if (err.name === 'HttpError') {
            return handleHttpError(err, store)
        }
        throw err
    }

    if (result instanceof Promise) {
        return result.catch(err => {
            if (err.name === 'HttpError') {
                return handleHttpError(err, store)
            }

            throw err
        })
    }

    return result
}

function handleHttpError(err: HttpError, store: MiddlewareAPI<any>): void {
    // we need to refresh current token
    if (err.status === 403) {
        store.dispatch(sessionActions.logout())
        return
    }

    // we only need to reconnect the current account
    if (err.status === 410) {
        const state   = store.getState()
        const account = state.session.currentAccount

        store.dispatch(navigationActions.pushSnapshot())

        if (account.provider.name.toLowerCase() === 'facebook') {
            store.dispatch(navigationActions.navigateTo('FacebookLogin', false, {
                defaultEmail: account.email,
                redirectBack: true,
            }))
        } else {
            store.dispatch(navigationActions.navigateTo('CreateAccount', false, {
                provider: account.provider.name.toLowerCase(),
                accountEmail: account.email,
                redirectBack: true,
            }))
        }

        return
    }

    throw err
}
