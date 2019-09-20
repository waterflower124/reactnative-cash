import React                                               from 'react'
import { Animated, Keyboard, ScrollView, ScrollViewProps } from 'react-native'

interface ScrollViewAvoidKeyboardProps extends ScrollViewProps {
    theRef?(inst: {_component: ScrollView}): void
}

export class ScrollViewAvoidKeyboard extends React.Component<ScrollViewAvoidKeyboardProps> {
    private keyboardShowing = new Animated.Value(0)

    public componentDidMount() {
        Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShow)
        Keyboard.addListener('keyboardDidHide', this.onKeyboardDidHide)
    }

    public render() {
        const {style} = this.props
        return (
            <Animated.ScrollView
                {...this.props}
                ref={this.props.theRef}
                style={[
                    style,
                    {marginBottom: this.keyboardShowing},
                ]}
            />
        )
    }

    private onKeyboardDidShow = (evt: { endCoordinates: { height: number } }) => {
        Animated.timing(this.keyboardShowing, {
            toValue : evt.endCoordinates.height,
            duration: 0.6,
        }).start()
    }

    private onKeyboardDidHide = () => {
        Animated.timing(this.keyboardShowing, {
            toValue : 0,
            duration: 0.6,
        }).start()
    }
}