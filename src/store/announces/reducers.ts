import { Action, State } from './index'

const initialState: State = {
  announce: null,
  lastAnnounce: null,
  loading: false,
}

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case '@Skeep/announces--FETCHING_LAST':
      return {
        ...state,
        loading: true,
      }

    case '@Skeep/announces--FETCHED_LAST':
      return {
        ...state,
        announce: action.announce,
        loading: false,
      }

    case '@Skeep/announces--READ':
      return {
        ...state,
        announce: null,
        lastAnnounce: state.announce,
      }

    default:
      return state
  }
}
