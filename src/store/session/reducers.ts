import { Action, State } from './index'

const initialState: State = {
    newsRequestEnabled: true,
    accounts: [],
}

export default function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case '@Skeep/session--REFRESH_USER':
            return {
                ...state,
                user: action.user,
            }

        case '@Skeep/session--DISABLE_NEWS_REQUEST':
            return {
                ...state,
                newsRequestEnabled: false,
            }

        case '@Skeep/session--LOAD_ACCOUNTS':
            return {
                ...state,
                accounts: action.accounts,
            }

        case '@Skeep/session--ADD_ACCOUNT':
            return {
                ...state,
                accounts: state.accounts.concat(action.account),
            }

        case '@Skeep/session--LOGIN':
            return {
                ...state,
                token: action.token,
                user: action.user,
            }

        case '@Skeep/session--LOGOUT':
            return initialState

        default:
            return state
    }
}
