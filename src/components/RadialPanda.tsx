import React, { PureComponent } from 'react'

import {
    Animated,
    Image,
    ImageStyle,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native'

const panda         = require('../../assets/icons/radialPanda.png')
const radial        = require('../../assets/icons/radialPandaCircle.png')
const radialMaxSize = 250
const radialMinSize = 200
// const RADIAL_BOTTOM     = -61
// const RADIAL_PANDA_SIZE = radialMaxSize + RADIAL_BOTTOM
// const CONTAINER_SIZE    = radialMaxSize

export interface RadialPandaProps extends ViewProps {
    onPress(): void
}

interface State {
    radialSize: Animated.Value
}

export class RadialPandaButton extends PureComponent<RadialPandaProps, State> {
    public readonly state: State = {
        radialSize: new Animated.Value(0),
    }

    public componentDidMount() {
        Animated.sequence([
            // Animated.delay(500),
            Animated.spring(
                this.state.radialSize,
                {
                    bounciness: 10,
                    speed     : 3,
                    toValue   : radialMaxSize,
                },
            ),
        ]).start(() => {
            this.runLoopedAnimation()
        })
    }

    public render() {
        const radialSize = {
            width : this.state.radialSize,
            height: this.state.radialSize,
        }

        return (
            <View {...this.props} style={[styles.container, this.props.style]}>
                <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
                    <Image source={panda} style={styles.panda}/>
                </TouchableOpacity>

                <Animated.Image source={radial} style={[styles.radial, radialSize]}/>
            </View>
        )
    }

    private runLoopedAnimation() {
        Animated.sequence([
            Animated.timing(
                this.state.radialSize,
                {
                    toValue : radialMinSize,
                    duration: 1000,
                },
            ),

            Animated.timing(
                this.state.radialSize,
                {
                    toValue : radialMaxSize,
                    duration: 1000,
                },
            ),
        ]).start(() => this.runLoopedAnimation())
    }
}

const styles = StyleSheet.create({
    container: {
        width         : '100%',
        alignItems    : 'center',
        justifyContent: 'center',
        height        : radialMaxSize,
    } as ViewStyle,

    loadingContainer: {
        width         : radialMaxSize,
        height        : radialMaxSize,
        alignItems    : 'center',
        justifyContent: 'center',
    } as ViewStyle,

    button: {
        zIndex: 1,
    } as ViewStyle,

    panda: {
        width     : 56,
        height    : 56,
        resizeMode: 'contain',
    } as ImageStyle,

    radial: {
        zIndex    : 0,
        position  : 'absolute',
        resizeMode: 'contain',
    } as ImageStyle,
})