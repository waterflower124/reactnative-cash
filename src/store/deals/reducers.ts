import { Action, State } from '.'

const initialState: State = {
  current   : {_: 'loading'},
  isLoading : false,
  previous  : null,
  eof       : false,
  eod       : false,
}

export function reducers(state: State = initialState, action: Action): State {
  switch (action.type) {
    case '@Skeep/deals--LOAD_CURRENT_REQUEST':
      return {
        ...state,
        current: {_: 'loading'},
      }

    case '@Skeep/deals--LOAD_CURRENT_SUCCESS':
      const previous = state.current._ === 'success' ? state.current.item : null

      if (action.deal === null) {
        return {
          ...state,
          previous,
          current: {_: 'loading'},
          eof: true,
          eod: true,
        }
      }
      return {
        ...state,
        previous,
        current: {_: 'success', item: action.deal},
      }

    case '@Skeep/deals--LOAD_CURRENT_FAILURE':
      return {
        ...state,
        current: {_: 'failure', error: action.error},
      }

    case '@Skeep/deals--SETUP_REQUEST':
      return {
        ...state,
        settingUp: {_: 'loading'},
      }

    case '@Skeep/deals--SETUP_SUCCESS':
      return {
        ...state,
        settingUp: {_: 'success', item: void(0)},
      }

    case '@Skeep/deals--SETUP_FAILURE':
      return {
        ...state,
        settingUp: {_: 'failure', error: action.error},
      }

    case '@Skeep/deals--ACCEPT_DEAL_REQUEST':
      return {
        ...state,
        isLoading: true,
      }

    case '@Skeep/deals--ACCEPT_DEAL_SUCCESS':
      return {
        ...state,
        isLoading: false,
      }

    case '@Skeep/deals--ACCEPT_DEAL_FAILURE':
      return {
        ...state,
        isLoading: false,
      }

    default:
      return state
  }
}
