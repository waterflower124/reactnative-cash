import {
    SocialAdvertiser,
    SocialApp,
    SocialInterest,
    SocialPicture,
    Subscription,
    UserAccount,
}                             from '../../httpapi'
import { IRequestBuilder }    from '../../httpapi/http'
import * as socialAdvertisers from '../../httpapi/socialAdvertisers'
import * as socialApps        from '../../httpapi/socialApps'
import * as socialInterests   from '../../httpapi/socialInterests'
import * as socialPictures    from '../../httpapi/socialPictures'
import * as subscriptionsHttp from '../../httpapi/subscriptions'

import { CameraRoll } from 'react-native'
import RNFS           from 'react-native-fs'

import { createHttpApi }    from '../http'
import { Thunk }         from '../index'
import { Action, State } from './index'

import * as navigationActions from '../navigation/actions'

interface ActionFetchOptions {
    account: UserAccount['id']
    page: number
}

interface ActionFetchResult<Item> {
    results: Array<Item>
}

interface ActionFetch<Item> {
    (http: IRequestBuilder, options: ActionFetchOptions): Promise<ActionFetchResult<Item>>
}

interface ActionUpdateStatus<Item> {
    (http: IRequestBuilder, item: Item, skip: boolean): Promise<any>
}

interface Actions<Item> {
    loadRequest(): Action

    loadSuccess(items: Array<Item>): Action

    loadFailure(error: Error): Action

    pop(): Action

    load(): Thunk<Promise<void>>

    requestPop(skip: boolean): Thunk<Promise<void>>
}

interface ActionExtensions {
    afterLoading?(): Thunk<Promise<void>>
}

function createActions<Item, ItemType extends keyof State>(
    subtype: ItemType,
    fetch: ActionFetch<Item>,
    updateStatus: ActionUpdateStatus<Item>,
    extensions: ActionExtensions = {})
    : Actions<Item> {
    return {
        loadRequest(): Action {
            return {type: '@Skeep/items--LOAD_REQUEST', subtype} as Action
        },

        loadSuccess(items: Array<Item>): Action {
            return {type: '@Skeep/items--LOAD_SUCCESS', subtype, items} as any
        },

        loadFailure(error: Error): Action {
            return {type: '@Skeep/items--LOAD_FAILURE', subtype, error} as Action
        },

        pop(): Action {
            return {type: '@Skeep/items--POP', subtype} as any
        },

        load(): Thunk<Promise<void>> {
            return async (dispatch, getState) => {
                const state = getState()
                const http  = createHttpApi(state)

                dispatch(this.loadRequest())

                try {
                    const {results} = await fetch(http, {
                        account: state.navigation.currentAccount.id,
                        page   : state.items[subtype].page,
                    })

                    dispatch(this.loadSuccess(results))
                    if (extensions.afterLoading) {
                        await dispatch(extensions.afterLoading())
                    }
                } catch (err) {
                    if (err.status === 428) {
                        dispatch(navigationActions.navigateTo('ScanResult', true))
                    } else if (err.status === 410) {
                        dispatch(navigationActions.navigateToAccountSetup())
                    } else {
                        dispatch(this.loadFailure(err))
                    }
                }
            }
        },

        requestPop(skip: boolean): Thunk<Promise<void>> {
            return async (dispatch, getState) => {
                const state = getState()
                const http  = createHttpApi(state)

                const current = state.items[subtype].current
                if (current._ !== 'success') {
                    return
                }
                const item = current.item

                // do the pop
                dispatch(this.pop())
                await Promise.all([
                    updateStatus(http, item as any, skip),
                    extensions.afterLoading && dispatch(extensions.afterLoading),
                ])

                // fetch next page if needed
                const newState = getState()
                if (newState.items[subtype].rest.length <= 0) {
                    await dispatch(this.load())
                }
            }
        },
    }
}

export const subscriptions = createActions<Subscription, 'subscriptions'>('subscriptions',
    subscriptionsHttp.fetch,
    subscriptionsHttp.updateStatus,
)

export const apps = createActions<SocialApp, 'apps'>('apps',
    socialApps.fetch,
    socialApps.updateStatus,
)

export const advertisers = createActions<SocialAdvertiser, 'advertisers'>('advertisers',
    socialAdvertisers.fetch,
    socialAdvertisers.updateSocialAdvertiserStatus,
)

export const interests = createActions<SocialInterest, 'interests'>('interests',
    socialInterests.fetch,
    socialInterests.updateStatus,
)

export const pictures = createActions<SocialPicture, 'pictures'>('pictures',
    socialPictures.fetch,
    socialPictures.updateStatus,
)

export function loadSubscriptionContentRequest(): Action {
    return {type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_REQUEST'}
}

export function loadSubscriptionContentSuccess(content: string): Action {
    return {type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_SUCCESS', content}
}

export function loadSubscriptionContentFailure(error: Error): Action {
    return {type: '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_FAILURE', error}
}

export function loadSubscriptionContent(subscription?: Subscription): Thunk<Promise<void>> {
    return async (dispatch, getState) => {
        const state = getState()
        const http  = createHttpApi(state)

        if (!subscription) {
            if (state.items.subscriptions.current._ !== 'success') {
                return
            }
            subscription = state.items.subscriptions.current.item
        }

        dispatch(loadSubscriptionContentRequest())
        try {
            const result = await subscriptionsHttp.getMessageContent(http, subscription.id, subscription.last_message.id, 'text/html')
            dispatch(loadSubscriptionContentSuccess(result))
        } catch (err) {
            dispatch(loadSubscriptionContentFailure(err))
        }
    }
}

export function loadInterestAdsRequest(): Action {
    return {type: '@Skeep/items--LOAD_INTEREST_ADS_REQUEST'}
}

export function loadInterestAdsSuccess(ads: Array<string>): Action {
    return {type: '@Skeep/items--LOAD_INTEREST_ADS_SUCCESS', ads}
}

export function loadInterestAdsFailure(error: Error): Action {
    return {type: '@Skeep/items--LOAD_INTEREST_ADS_FAILURE', error}
}

export function loadInterestAds(): Thunk<Promise<void>> {
    return async (dispatch, getState) => {
        const state = getState()
        const http  = createHttpApi(state)

        if (state.items.interests.current._ !== 'success') {
            return
        }
        const interest = state.items.interests.current.item

        dispatch(loadInterestAdsRequest())
        try {
            const results = await socialInterests.fetchAds(http, interest.id)
            dispatch(loadInterestAdsSuccess(results))
        } catch (err) {
            dispatch(loadInterestAdsFailure(err))
        }
    }
}

export function updatePermissions(permissions: { [permissionName: string]: boolean }): Thunk<Promise<void>> {
    return async (_dispatch, getState) => {
        const state = getState()
        const http  = createHttpApi(state)

        const current = state.items.apps.current
        if (current._ === 'success') {
            await socialApps.multiTogglePermission(http, current.item, permissions)
        }
    }
}

export function saveCurrentPhoto(): Thunk<Promise<void>> {
    return async (_dispatch, getState) => {
        const {items: {pictures: {current}}} = getState()

        if (current._ !== 'success') {
            return
        }
        const picture = current.item

        const destination       = RNFS.TemporaryDirectoryPath + '/' + picture.id + '.jpg'
        const {promise: result} = RNFS.downloadFile({
            fromUrl: picture.url,
            toFile : destination,
        })
        await result
        await CameraRoll.saveToCameraRoll(destination, 'photo')
    }
}
