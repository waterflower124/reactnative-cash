import React from 'react'
import {
    Animated,
    Easing,
    StyleProp,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
}            from 'react-native'

export interface SwitchProperties {
    value?: boolean
    disabled?: boolean
    style?: StyleProp<ViewStyle>

    colors?: { on: string, off: string }

    onValueChange?(value: boolean): void
}

const switchWidth          = 41
const switchHeight         = 21
const switchBorderRadius   = 10
const thumbSize            = 18
const thumbBackgroundColor = 'white'

export default class Switch extends React.Component<SwitchProperties> {
    private slideAnim = new Animated.Value(this.computeThumbPosition(this.props.value))

    componentWillReceiveProps(nextProps: SwitchProperties) {
        Animated.timing(
            this.slideAnim,
            {
                toValue: this.computeThumbPosition(nextProps.value),
                easing: Easing.ease,
                duration: 200,
            },
        ).start()
    }

    render() {
        const {colors = {on: '#49edd4', off: '#c46679'}} = this.props

        const style = {
            opacity: this.props.disabled ? 0.4 : 1.0,
            backgroundColor: this.props.value ? colors.on : colors.off,
        }

        return (
            <TouchableWithoutFeedback onPress={this.onPress}>
                <View
                    style={[
                        styles.switch,
                        style,
                        this.props.style,
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.thumb,
                            {left: this.slideAnim},
                        ]}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    private computeThumbPosition(enabled: boolean) {
        return enabled
            ? switchWidth - thumbSize - (switchHeight - thumbSize) / 2
            : (switchHeight - thumbSize) / 2
    }

    private onPress = () => {
        if (this.props.onValueChange && !this.props.disabled) {
            this.props.onValueChange(!this.props.value)
        }
    }
}

const styles = StyleSheet.create({
    switch: {
        width: switchWidth,
        height: switchHeight,
        justifyContent: 'center',
        borderRadius: switchBorderRadius,
    },

    thumb: {
        position: 'absolute',
        width: thumbSize,
        height: thumbSize,
        borderRadius: thumbSize / 2,
        backgroundColor: thumbBackgroundColor,
    },
})
