import { Announce } from '../../httpapi'

export interface State {
  announce: Announce
  lastAnnounce: Announce
  loading: boolean
}

export type Action =
    { type: '@Skeep/announces--FETCHING_LAST' }
  | { type: '@Skeep/announces--FETCHED_LAST', announce: Announce }
  | { type: '@Skeep/announces--READ' }

export { default as reducers } from './reducers'
