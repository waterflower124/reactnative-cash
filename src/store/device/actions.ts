// import OneSignal        from 'react-native-onesignal'
// import PushNotification from 'react-native-push-notification'

// import PushNotificationConfig, { OneSignalAppId } from '../../pushNotifications'
import { Action, State as DeviceState }           from '.'
// import { createHttpApi }                             from '../http'
import { Dispatch, Thunk }                 from '..'
import Rate                                       from '../../rate'

import * as device from '../../httpapi/device'
// import * as users  from '../../httpapi/users'
//
// export function checkVersion(): Thunk<Promise<boolean>> {
//     return async (
//         dispatch: Dispatch,
//         getState: () => State,
//     ): Promise<boolean> => {
//         dispatch({type: '@Skeep/device--CHECKING_VERSION'} as Action)
//
//         const state  = getState()
//         const http   = createHttpApi(state)
//         const result = await device.checkVersion(http, state.device.version)
//
//         dispatch({
//             type : '@Skeep/device--CHECK_VERSION',
//             valid: result.valid,
//         } as Action)
//
//         return result.valid
//     }
// }

// export function configurePushNotifications(): Thunk<void> {
//     return async (_dispatch, getState) => {
//         PushNotification.configure({
//             ...PushNotificationConfig,
//
//             async onRegister({os, token}) {
//                 const state = getState()
//                 const http  = createHttpApi(state)
//                 await users.subscribeNotifications(http, token, os)
//
//                 OneSignal.init(OneSignalAppId)
//             },
//
//             onNotification(notification) {
//                 const {title, message} = notification.data || {} as any
//
//                 PushNotification.localNotification({
//                     title,
//                     message,
//                 })
//             },
//         })
//     }
// }

export function appLaunched(): Action {
    return {type: '@Skeep/device--APP_LAUNCHED'}
}

export function appRated(success: boolean): Action {
    return {type: '@Skeep/device--APP_RATED', success}
}

export function launchApp(): Thunk<Promise<void>> {
    return async (dispatch, getState) => {
        const {device: state, session} = getState()

        // Increment launch count only when logged
        if (session.token) {
            dispatch(appLaunched())
        }

        // Try to rate anyway
        await rateMyApp(state, dispatch)
    }
}

async function rateMyApp(state: DeviceState, dispatch: Dispatch): Promise<void> {
    if (!askRating(state)) {
        return
    }

    const rated = await Rate.request()
    dispatch(appRated(rated))
}

function askRating(state: DeviceState): boolean {
    if (state.rated) {
        return false
    }
    if (state.generation >= 2) {
        return state.generation % 2 === 0
    }
    return false
}
