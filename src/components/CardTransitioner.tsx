import React from 'react'

import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { Header }                                 from '../containers/Header'
import { Background }                             from './Background'
import { Background2 }                            from './Background2'
import * as PromiseStateRender                    from './PromiseState'

interface CardTransitionerProps<T> {
  previous: T | null
  current: PromiseState<T>
  eof: boolean
  eod: boolean

  renderScene(subject: T): JSX.Element

  renderEof?(): JSX.Element

  renderEoD?(): JSX.Element

  renderFailure?(error: Error): JSX.Element

  renderLoading?(): JSX.Element
}

interface State {
  transitioning: boolean
}

export class CardTransitioner<T> extends React.Component<CardTransitionerProps<T>, State> {
  public readonly state: State = {
    transitioning: false,
  }

  private scenePosition = new Animated.Value(0)

  public render() {
    const windowDimensions = Dimensions.get('window')

    const currentScene = this.renderCurrent()
    const nextScene    = this.renderNext()

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
        >
          {nextScene}
        </View>

        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            transform: [
              {
                translateX: this.scenePosition.interpolate({
                  inputRange : [-1, 0, 1],
                  outputRange: [-windowDimensions.width, 0, windowDimensions.width],
                }),
              },
            ],
          }}
        >
          {currentScene}
        </Animated.View>
      </View>
    )
  }

  public transitionLeft() {
    return this.transition(false)
  }

  public transitionRight() {
    return this.transition(true)
  }

  /**
   * @param {boolean} direction {@code true} for right, {@code false} for left
   */
  private transition(direction: boolean): Promise<void> {
    return new Promise(resolve => {
      this.setState({transitioning: true}, () => {
        Animated.timing(this.scenePosition, {toValue: direction ? 1 : -1})
          .start(() => {
            this.scenePosition.setValue(0)
            this.setState({transitioning: false}, resolve)
          })
      })
    })
  }

  private renderCurrent() {
    if (this.props.eof && this.props.eod) {
      return this.renderEoD()
    }
    if (this.props.eof && !this.props.eod) {
      return this.renderEof()
    }
    if (this.state.transitioning && this.props.previous) {
      return this.props.renderScene(this.props.previous)
    }

    return this.renderPromiseState()
  }

  private renderNext() {
    if (this.state.transitioning) {
      if (this.props.eof) {
        return this.renderEof()
      }
      return this.renderPromiseState()
    }

    return null
  }

  private renderPromiseState() {
    switch (this.props.current._) { // tslint:disable-line:switch-default
      case 'loading':
        if (this.props.renderLoading) {
          return this.props.renderLoading()
        }
        return (
          <Background>
            <PromiseStateRender.Loading/>
          </Background>
        )

      case 'failure':
        if (this.props.renderFailure) {
          return this.props.renderFailure(this.props.current.error)
        }
        return (
          <Background>
            <PromiseStateRender.Failure error={this.props.current.error}/>
          </Background>
        )

      case 'success':
        return this.props.renderScene(this.props.current.item)
    }
  }

  private renderEof() {
    if (this.props.renderEof) {
      return this.props.renderEof()
    }
    return (
      <Background2>
        <View style={{flex: 1}}>
          <Header startStyle={{height: 100, width: 200, backgroundColor: 'transparent'}}/>

          <PromiseStateRender.EndOfData/>
        </View>
      </Background2>
    )
  }

  private renderEoD() {
    if (this.props.renderEof) {
      return this.props.renderEof()
    }
    return (
      <Background2>
        <View style={{flex: 1}}>
          <Header startStyle={{height: 100, width: 200, backgroundColor: 'transparent'}}/>

          <PromiseStateRender.EndOfDeals/>
        </View>
      </Background2>
    )
  }
}
