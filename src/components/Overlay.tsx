import React from 'react'

import {
    Animated,
    Dimensions,
    Image,
    PanResponder, PanResponderInstance,
    StatusBar,
    StyleProp,
    StyleSheet,
    View, ViewStyle,
} from 'react-native'
import LinearGradient   from 'react-native-linear-gradient'
import Text             from './Text'

const ChevronDownIcon = require('../../assets/icons/chevronDown.png')

export interface OverlayProps {
    overlaid?: JSX.Element
    overlaidStyle?: StyleProp<ViewStyle>

    label: string | JSX.Element

    renderContent(responder: PanResponderInstance): JSX.Element
}

interface State {
    overlayActive: boolean
}

export class Overlay extends React.Component<OverlayProps, State> {
    public readonly state: State = {
        overlayActive: true,
    }

    private windowDimensions = Dimensions.get('window')

    private scroll = new Animated.Value(0)

    private panResponder  = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onShouldBlockNativeResponder: () => true,
        onPanResponderTerminationRequest: () => true,

        onPanResponderMove: (_evt, gestureState) => {
            this.scroll.setValue(Math.min(gestureState.dy, 0))
        },
        onPanResponderRelease: (_evt, gestureState) => {
            if (gestureState.vy < 0) {
                Animated.timing(this.scroll, {toValue: 60 - this.windowDimensions.height}).start(() => {
                    this.setState({overlayActive: false})
                })
            } else {
                Animated.spring(this.scroll, {toValue: 0}).start()
            }
        },
    })
    private panResponder2 = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onShouldBlockNativeResponder: () => true,
        onPanResponderTerminationRequest: () => true,

        onPanResponderGrant: () => {
            this.setState({overlayActive: true})
            this.scroll.setValue(60 - this.windowDimensions.height)
        },
        onPanResponderMove: (_evt, gestureState) => {
            if (gestureState.dy > 60) {
                this.scroll.setValue(gestureState.dy - this.windowDimensions.height)
            }
        },
        onPanResponderRelease: (_evt, gestureState) => {
            if (gestureState.vy > 0) {
                Animated.spring(this.scroll, {toValue: 0}).start()
            } else {
                Animated.timing(this.scroll, {toValue: 60 - this.windowDimensions.height}).start(() => {
                    this.setState({overlayActive: false})
                })
            }
        },
    })

    public render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="light-content"/>

                <View style={[StyleSheet.absoluteFill, this.props.overlaidStyle]}>
                    <View {...this.panResponder2.panHandlers} style={{
                        opacity: this.state.overlayActive ? 0 : 1,
                        backgroundColor: '#5a6d86CC',
                        alignSelf: 'stretch',
                    }}>
                        <LinearGradient colors={['#00000032', '#00000000']}
                                        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                                        style={{
                                            alignSelf: 'stretch',
                                        }}>
                            <View style={{
                                alignSelf: 'stretch',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingTop: 30,
                            }}>
                                <Text style={{fontSize: 14, color: '#FFF', marginBottom: 25, marginTop: 5, textAlign: 'center'}} numberOfLines={2}  allowFontScaling={false}>
                                {this.props.label}
                                </Text>

                                <Image source={ChevronDownIcon} style={{marginBottom: 15}}/>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        {this.props.overlaid}
                    </View>
                </View>

                <Animated.View style={{
                    position: 'absolute',
                    top: this.scroll,
                    right: 0,
                    left: 0,
                    height: this.windowDimensions.height,
                    backgroundColor: '#5a6d86CC',
                    opacity: this.state.overlayActive ? 1 : 0,
                }}>
                    <LinearGradient colors={['#0000008C', '#00000032', '#00000000']} locations={[0.1, 0.8, 1]}
                                    start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                                    style={{flex: 1}}>
                        {this.props.renderContent(this.panResponder)}
                    </LinearGradient>
                </Animated.View>
            </View>
        )
    }
}