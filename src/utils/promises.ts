interface PromiseStateSelector<T, R, E> {
    loading(): R
    failure(error: E): R
    success(item: T): R
}

export function select<T, R, E = Error>(state: PromiseState<T, E>, selector: PromiseStateSelector<T, R, E>): R {
    switch (state._) { // tslint:disable-line:switch-default
        case 'loading':
            return selector.loading()

        case 'failure':
            return selector.failure(state.error)

        case 'success':
            return selector.success(state.item)
    }
}

export function unwrap<T>(state: PromiseState<T, Error>, defaultValue?: T): T {
    switch (state._) {
        case 'loading':
            if (defaultValue) {
                return defaultValue
            }
            throw new Error('cannot unwrap loading value')

        case 'failure':
            if (defaultValue) {
                return defaultValue
            }
            throw state.error

        case 'success':
            return state.item

        default:
          throw new Error('cannot unwrap value')
    }
}

export function map<T, R>(state: PromiseState<T>, fun: (item: T) => R): PromiseState<R> {
    switch (state._) {
        case 'success':
            return {_: 'success', item: fun(state.item)}

        default:
            return state
    }
}
