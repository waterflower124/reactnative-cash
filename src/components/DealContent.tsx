import React from 'react'
import {
  Animated,
  Dimensions,
  GestureResponderHandlers,
  ImageBackground,
  ImageBackgroundProps,
  PanResponder,
} from 'react-native'
import { SponsoredDeal } from '../httpapi'

// @ts-ignore
interface DealThumbnailProps extends Omit<ImageBackgroundProps, 'source' | 'children'> {
  deal: SponsoredDeal

  renderContent(gestureResponderHandlers: GestureResponderHandlers): JSX.Element

  onSwiped(): void
}

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)

export class DealContent extends React.PureComponent<DealThumbnailProps> {
  private scroll = new Animated.Value(0)

  private panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => true,
    onPanResponderTerminationRequest: () => true,

    onPanResponderMove: (_evt, gestureState) => {
      this.scroll.setValue(Math.min(gestureState.dy, 0))
    },
    onPanResponderRelease: (_evt, gestureState) => {
      if (gestureState.vy < 0) {
        const windowSize = Dimensions.get('window')
        Animated.timing(this.scroll, {toValue: -windowSize.height}).start(() => {
          this.props.onSwiped()
          this.scroll.setValue(0)
        })
      } else {
        Animated.spring(this.scroll, {toValue: 0}).start()
      }
    },
  })

  public render() {
    const {deal, style, ...props} = this.props
    return (
      <AnimatedImageBackground
        {...props}
        source={{uri: deal.deal_background_url}}
        style={[style, {
          transform: [
            {translateY: this.scroll},
          ],
        }]}
      >
        {this.props.renderContent(this.panResponder.panHandlers)}
      </AnimatedImageBackground>
    )
  }
}
