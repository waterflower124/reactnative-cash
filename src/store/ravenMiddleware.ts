import { Sentry }        from 'react-native-sentry'
import { MiddlewareAPI } from 'redux'

export default (store: MiddlewareAPI<any>) => (next: (action: any) => any) => (action: any) => {
    try {
        const result = next(action)

        if (result instanceof Promise) {
            return result.catch(err => {
                reportException(store, action, err)
            })
        }

        return result
    } catch (err) {
        reportException(store, action, err)
    }
}

function reportException(store: MiddlewareAPI<any>, action: any, err: Error): void {
    if (__DEV__) {
        throw err
    }
    Sentry.captureException(err, {
        extra: {
            action,
            state: store.getState(),
        },
    })
}
