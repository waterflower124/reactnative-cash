import { Action, State, Subaction, Substate } from './index'

const initialSubstate: Substate<any> = {
    previous: null,
    current : {_: 'loading'},
    rest    : [],
    page    : 1,
    eof     : false,
}

const initialState: State = {
    subscriptions: {
        ...initialSubstate,
        previousContent: {_: 'loading'},
        content        : {_: 'loading'},
    },
    apps         : initialSubstate,
    interests    : {
        ...initialSubstate,
        previousAds: {_: 'loading'},
        ads        : {_: 'loading'},
    },
    advertisers  : initialSubstate,
    pictures     : initialSubstate,
}

export function subreducer<Item, ItemType extends keyof State>(state: Substate<Item>, action: Subaction<Item, ItemType>): Substate<Item> {
    const previous: Item | null = state.current._ === 'success'
        ? state.current.item : null

    switch (action.type) {
        case '@Skeep/items--LOAD_REQUEST':
            return {
                ...state,
                current: {_: 'loading'},
            }

        case '@Skeep/items--LOAD_SUCCESS':
            if (action.items.length <= 0) {
                return {
                    ...state,
                    current: {_: 'loading'},
                    rest   : [],
                    eof    : true,
                }
            }
            return {
                ...state,
                current: {_: 'success', item: action.items[0]},
                rest   : action.items.slice(1),
                eof    : false,
            }

        case '@Skeep/items--LOAD_FAILURE':
            return {
                ...state,
                current: {_: 'failure', error: action.error},
            }

        case '@Skeep/items--POP':
            if (state.rest.length <= 0) {
                return {
                    ...state,
                    previous,
                    current: {_: 'loading'},
                    rest   : [],
                }
            }
            return {
                ...state,
                previous,
                current: {_: 'success', item: state.rest[0]},
                rest   : state.rest.slice(1),
            }

        default:
            return state
    }
}

export function reducers(state: State = initialState, action: Action): State {
    switch (action.type) {
        case '@Skeep/items--LOAD_REQUEST':
        case '@Skeep/items--LOAD_SUCCESS':
        case '@Skeep/items--LOAD_FAILURE':
        case '@Skeep/items--POP':
            return {
                ...state,
                [action.subtype]: subreducer(state[action.subtype] as any, action as any),
            }

        case '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_REQUEST':
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    content: {_: 'loading'},
                },
            }

        case '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_SUCCESS':
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    previousContent: state.subscriptions.content,
                    content        : {_: 'success', item: action.content},
                },
            }

        case '@Skeep/items--LOAD_SUBSCRIPTION_CONTENT_FAILURE':
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    content: {_: 'failure', error: action.error},
                },
            }

        case '@Skeep/items--LOAD_INTEREST_ADS_REQUEST':
            return {
                ...state,
                interests: {
                    ...state.interests,
                    ads: {_: 'loading'},
                },
            }

        case '@Skeep/items--LOAD_INTEREST_ADS_SUCCESS':
            return {
                ...state,
                interests: {
                    ...state.interests,
                    previousAds: state.interests.ads,
                    ads        : {_: 'success', item: action.ads},
                },
            }

        case '@Skeep/items--LOAD_INTEREST_ADS_FAILURE':
            return {
                ...state,
                interests: {
                    ...state.interests,
                    ads: {_: 'failure', error: action.error},
                },
            }

        case '@Skeep/navigation--SET_CURRENT_ACCOUNT':
            return initialState

        default:
            return state
    }
}