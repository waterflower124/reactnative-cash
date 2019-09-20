import { SponsoredDeal } from '../../httpapi'

export interface State {
  current: PromiseState<SponsoredDeal>
  previous: SponsoredDeal | null
  eof: boolean
  eod: boolean
  settingUp?: PromiseState<void>
  isLoading: boolean
}

export type Action
  = { type: '@Skeep/deals--LOAD_CURRENT_REQUEST' }
  | { type: '@Skeep/deals--LOAD_CURRENT_SUCCESS', deal: SponsoredDeal | null }
  | { type: '@Skeep/deals--LOAD_CURRENT_FAILURE', error: Error }
  | { type: '@Skeep/deals--SETUP_REQUEST' }
  | { type: '@Skeep/deals--SETUP_SUCCESS' }
  | { type: '@Skeep/deals--SETUP_FAILURE', error: Error }
  | { type: '@Skeep/deals--ACCEPT_DEAL_REQUEST' }
  | { type: '@Skeep/deals--ACCEPT_DEAL_SUCCESS' }
  | { type: '@Skeep/deals--ACCEPT_DEAL_FAILURE', error: Error }

export { reducers } from './reducers'
