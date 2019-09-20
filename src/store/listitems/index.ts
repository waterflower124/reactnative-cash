import { Subscription } from '../../httpapi'

export interface Substate<Item> {
    result?: PromiseState<void>
    items: Array<Item>
    page: number
    eof: boolean
}

export type Subaction<Item, ItemType extends keyof State>
    = { type: '@Skeep/listitems--LOAD_REQUEST', subtype: ItemType }
    | { type: '@Skeep/listitems--LOAD_SUCCESS', subtype: ItemType, items: Array<Item>, page?: number }
    | { type: '@Skeep/listitems--LOAD_FAILURE', subtype: ItemType, error: Error }

export interface State {
    subscriptions: Substate<Subscription>
}

export type Action
    = Subaction<Subscription, 'subscriptions'>
    | { type: '@Skeep/navigation--SET_CURRENT_ACCOUNT' }

export { reducers } from './reducers'