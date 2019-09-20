import { NavigationActions }  from 'react-navigation'
import { Action, State }      from '.'
import Routes                 from '../../Routes'

const initialNavState = Routes.router.getStateForAction(NavigationActions.init({}))

const initialState: State = {
  current: initialNavState,
  snapshots: [],
  menuOpen: false,
  currentAccount: {
    id: '',
    email: '',
    provider: { id: 0, name: '' },
    keep_count: 0,
    skip_count: 0,
    created_at: '',
  },
  menuStats: {_: 'loading'},
}

export function reducers(state: State = initialState, action: Action): State {
  switch (action.type) {
    case '@Skeep/navigation--OPEN_MENU':
      return {
        ...state,
        menuOpen: true,
      }

    case '@Skeep/navigation--CLOSE_MENU':
      return {
        ...state,
        menuOpen: false,
      }

    case '@Skeep/navigation--PUSH_SNAPSHOT': {
      const snapshots = state.snapshots.slice()
      snapshots.push(state)
      return {
        ...initialState,
        snapshots,
      }
    }

    case '@Skeep/navigation--POP_SNAPSHOT': {
      const snapshots = state.snapshots.slice()
      const state2    = snapshots.pop()
      return {
        ...state2,
        snapshots,
      }
    }

    case '@Skeep/navigation--SET_CURRENT_ACCOUNT':
      return {
        ...state,
        currentAccount: action.currentAccount,
      }

    case '@Skeep/session--LOAD_ACCOUNTS':
      if (action.accounts.length > 0 && !state.currentAccount.id) {
        const currentAccount = action.accounts[0]
        return {
          ...state,
          currentAccount,
        }
      }
      return state

    case '@Skeep/session--ADD_ACCOUNT':
      if (!state.currentAccount.id) {
        return {
          ...state,
          currentAccount: action.account,
        }
      }
      return state

    case '@Skeep/navigation--SIGNIN_REQUEST':
      return {
        ...state,
        signin: { _: 'loading' },
      }

    case '@Skeep/navigation--SIGNIN_SUCCESS':
      return {
        ...state,
        signin: { _: 'success', item: void(0) },
      }

    case '@Skeep/navigation--SIGNIN_FAILURE':
      return {
        ...state,
        signin: { _: 'failure', error: action.error },
      }

    case '@Skeep/navigation--SIGNUP_REQUEST':
      return {
        ...state,
        signup: { _: 'loading' },
      }

    case '@Skeep/navigation--SIGNUP_SUCCESS':
      return {
        ...state,
        signup: { _: 'success', item: void(0) },
      }

    case '@Skeep/navigation--SIGNUP_FAILURE':
      return {
        ...state,
        signup: { _: 'failure', error: action.error },
      }

    case '@Skeep/navigation--LOST_PASSWORD_REQUEST':
      return {
        ...state,
        lostPassword: { _: 'loading' },
      }

    case '@Skeep/navigation--LOST_PASSWORD_SUCCESS':
      return {
        ...state,
        lostPassword: { _: 'success', item: void(0) },
      }

    case '@Skeep/navigation--LOST_PASSWORD_FAILURE':
      return {
        ...state,
        lostPassword: { _: 'failure', error: action.error },
      }

    case '@Skeep/navigation--RECOVER_PASSWORD_REQUEST':
      return {
        ...state,
        recoverPassword: { _: 'loading' },
      }

    case '@Skeep/navigation--RECOVER_PASSWORD_SUCCESS':
      return {
        ...state,
        recoverPassword: { _: 'success', item: void(0) },
      }

    case '@Skeep/navigation--RECOVER_PASSWORD_FAILURE':
      return {
        ...state,
        recoverPassword: { _: 'failure', error: action.error },
      }

    case '@Skeep/navigation--ADD_ACCOUNT_REQUEST':
      return {
        ...state,
        addAccount: { _: 'loading' },
      }

    case '@Skeep/navigation--ADD_ACCOUNT_SUCCESS':
      return {
        ...state,
        addAccount: { _: 'success', item: void(0) },
      }

    case '@Skeep/navigation--ADD_ACCOUNT_FAILURE':
      return {
        ...state,
        addAccount: { _: 'failure', error: action.error },
      }

    case '@Skeep/navigation--MENU_STATS_REQUEST':
      return {
        ...state,
        menuStats: { _: 'loading' },
      }

    case '@Skeep/navigation--MENU_STATS_SUCCESS':
      return {
        ...state,
        menuStats: { _: 'success', item: action.menuStats },
      }

    case '@Skeep/navigation--MENU_STATS_FAILURE':
      return {
        ...state,
        menuStats: { _: 'failure', error: action.error },
      }

    case 'Navigation/INIT':
    case 'Navigation/SET_PARAMS':
      return {
        ...state,
        current: Routes.router.getStateForAction(action, state.current),
      }

    case 'Navigation/BACK':
      if (state.menuOpen) {
        return {...state, menuOpen: false}
      }

    case 'Navigation/NAVIGATE': // tslint:disable-line:no-switch-case-fall-through
    case 'Navigation/RESET': {
      const current = Routes.router.getStateForAction(action, state.current)
      return {
        ...state,
        current,
        menuOpen: false,
      }
    }

    case '@Skeep/session--LOGOUT':
      return initialState

    default:
      return state
  }
}
