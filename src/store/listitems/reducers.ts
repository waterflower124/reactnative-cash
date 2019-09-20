import { Action, State, Subaction, Substate } from './index'

const initialSubstate: Substate<any> = {
    items: [],
    page: 1,
    eof: false,
}

export function subreducer
    <Item, ItemType extends keyof State>
    (state: Substate<Item>, action: Subaction<Item, ItemType>)
    : Substate<Item> {
    switch (action.type) {
        case '@Skeep/listitems--LOAD_REQUEST':
            return {
                ...state,
                result: {_: 'loading'},
            }

        case '@Skeep/listitems--LOAD_SUCCESS':
            if (action.page) {
                return {
                    ...state,
                    result: {_: 'success', item: void(0)},
                    items: state.items.concat(action.items),
                }
            }
            return {
                ...state,
                result: {_: 'success', item: void(0)},
                items: state.items.concat(action.items),
                page: state.page + 1,
                eof: action.items.length <= 0,
            }

        case '@Skeep/listitems--LOAD_FAILURE':
            return {
                ...state,
                result: {_: 'failure', error: action.error},
            }

        default:
            return state
    }
}

const initialState: State = {
    subscriptions: initialSubstate,
}

export function reducers(state: State = initialState, action: Action): State {
    switch (action.type) {
        case '@Skeep/listitems--LOAD_REQUEST':
        case '@Skeep/listitems--LOAD_SUCCESS':
        case '@Skeep/listitems--LOAD_FAILURE':
            return {
                ...state,
                [action.subtype]: subreducer(state[action.subtype], action),
            }

        case '@Skeep/navigation--SET_CURRENT_ACCOUNT':
            return initialState

        default:
            return state
    }
}