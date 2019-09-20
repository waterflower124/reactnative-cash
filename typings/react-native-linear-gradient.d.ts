declare module 'react-native-linear-gradient' {
    import React         from 'react'
    import { ViewProps } from 'react-native'

    interface LinearGradientProps extends ViewProps {
        colors: string[],
        start?: { x: number, y: number },
        end?: { x: number, y: number },
        locations?: number[]
    }

    export default class LinearGradient extends React.Component<LinearGradientProps> {
    }
}
