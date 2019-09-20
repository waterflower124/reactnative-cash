declare module 'react-native-onesignal' {
    interface Notification {
        payload: {}
        isAppInFocus: boolean
    }

    interface OpenResult {
        notification: Notification
    }

    interface Device {}

    interface OneSignalStatic {
        init(appId: string): void

        addEventListener(evt: 'received', handler: (notification: Notification) => void)
        addEventListener(evt: 'opened', handler: (openResult: OpenResult) => void)
        addEventListener(evt: 'ids', handler: (device: Device) => void)
        addEventListener(evt: string, handler: (payload: any) => void)

        removeEventListener(evt: 'received', handler: (notification: Notification) => void)
        removeEventListener(evt: 'opened', handler: (openResult: OpenResult) => void)
        removeEventListener(evt: 'ids', handler: (device: Device) => void)
        removeEventListener(evt: string, handler: (payload: any) => void)
    }

    const OneSignal: OneSignalStatic
    export default OneSignal
}