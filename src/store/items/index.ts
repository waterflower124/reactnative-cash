import { SocialAdvertiser, SocialApp, SocialInterest, SocialPicture, Subscription } from '../../httpapi'

export interface Substate<Item> {
  previous: Item|null
  current: PromiseState<Item>
  rest: Array<Item>
  page: number
  eof: boolean
}

export type Subaction<Item, ItemType extends keyof State>
  = { type: '@Skeep/items--LOAD_REQUEST', subtype: ItemType }
  | { type: '@Skeep/items--LOAD_SUCCESS', subtype: ItemType, items: Array<Item> }
  | { type: '@Skeep/items--LOAD_FAILURE', subtype: ItemType, error: Error }
  | { type: '@Skeep/items--POP', subtype: ItemType }

export interface State {
  subscriptions: Substate<Subscription> & {
    previousContent: PromiseState<string>,
    content: PromiseState<string>,
  }
  apps: Substate<SocialApp>
  interests: Substate<SocialInterest> & {
    previousAds: PromiseState<Array<string>>,
    ads: PromiseState<Array<string>>,
  }
  advertisers: Substate<SocialAdvertiser>
  pictures: Substate<SocialPicture>
}

export type Action
  = Subaction<Subscription, 'subscriptions'>
  | Subaction<SocialApp, 'apps'>
  | Subaction<SocialInterest, 'interests'>
  | Subaction<SocialAdvertiser, 'advertisers'>
  | Subaction<SocialPicture, 'pictures'>

  | { type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_REQUEST' }
  | { type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_SUCCESS', content: string }
  | { type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_FAILURE', error: Error }

  | { type: '@Skeep/items--LOAD_INTEREST_ADS_REQUEST' }
  | { type: '@Skeep/items--LOAD_INTEREST_ADS_SUCCESS', ads: Array<string> }
  | { type: '@Skeep/items--LOAD_INTEREST_ADS_FAILURE', error: Error }

  | { type: '@Skeep/navigation--SET_CURRENT_ACCOUNT' }

export { reducers } from './reducers'
