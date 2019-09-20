import { Action, State } from '.'
import { Thunk } from '..'
import { Subscription, UserAccount } from '../../httpapi'
import { IRequestBuilder } from '../../httpapi/http'
import { createHttpApi } from '../http'

type ItemStatus = 'skip' | 'keep'
type ItemStatusFilter = ItemStatus | 'all' | undefined

interface Options<Item> {
  fetch(http: IRequestBuilder, currentAccount: UserAccount, page: number, status: ItemStatusFilter): Promise<Array<Item>>
  updateStatus(http: IRequestBuilder, payload: {[K in ItemStatus]?: number[]}): Promise<void>
}

function createActions<Item>(subtype: keyof State, options: Options<Item>) {
  return {
    loadRequest(): Action {
      return {type: '@Skeep/listitems--LOAD_REQUEST', subtype}
    },
    loadSuccess(items: Array<Item>): Action {
      return {type: '@Skeep/listitems--LOAD_SUCCESS', subtype, items} as any
    },
    loadFailure(error: Error): Action {
      return {type: '@Skeep/listitems--LOAD_FAILURE', subtype, error}
    },
    load(filter: ItemStatusFilter = undefined): Thunk<Promise<void>> {
      return async (dispatch, getState) => {
        const state = getState()
        if (state.listitems[subtype].eof) {
          return
        }

        const http = createHttpApi(state)
        dispatch(this.loadRequest())
        try {
          const items = await options.fetch(http, state.navigation.currentAccount, state.listitems[subtype].page, filter)
          dispatch(this.loadSuccess(items))
        } catch (err) {
          dispatch(this.loadFailure(err))
        }
      }
    },
    skip(ids: number[]): Thunk<Promise<void>> {
      return async (dispatch, getState) => {
        const state = getState()
        const http = createHttpApi(state)
        await options.updateStatus(http, {skip: ids})
        await dispatch(this.load())
      }
    },
    keep(ids: number[]): Thunk<Promise<void>> {
      return async (dispatch, getState) => {
        const state = getState()
        const http = createHttpApi(state)
        await options.updateStatus(http, {keep: ids})
        await dispatch(this.load())
      }
    },
  }
}

export const subscriptions = createActions<Subscription>('subscriptions', {
  async fetch(http, account, page, status) {
    const resp = await http.get('/subscriptions', {
      account: account.id,
      status,
      page,
    })
    const { results } = await resp.json()
    return results
  },

  async updateStatus(http, payload) {
    await http.post('/subscriptions/status', payload)
  },
})
