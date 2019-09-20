import React              from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
}                         from 'react-native'
import Icon               from 'react-native-vector-icons/Feather'
import { WrapperContext } from '../containers/Wrapper'
import Text               from './Text'

const Home      = require('../../assets/icons/home.png')
const HomeBlack = require('../../assets/icons/homeBlack.png')
const CheckAll = require('../../assets/icons/checkAll.png')
const Library  = require('../../assets/icons/library.png')

type HeaderColor = 'light' | 'dark'

interface HeaderProps {
  color?: HeaderColor
  floating?: boolean
  style?: StyleProp<ViewStyle>
  startStyle?: StyleProp<ViewStyle>
  endStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  canReturnBack?: boolean
  canToggleMulti?: boolean
  multi?: boolean
  children?: {}
  noMenu?: boolean

  onReturnBack?(): void

  onOpenMenu?(): void

  onToggleMulti?(): void
}

export class Header extends React.Component<HeaderProps> {
  public render() {
    return (
      <WrapperContext.Consumer
        children={wrapper => (
          <View style={[styles.container, this.props.containerStyle]}>
            {this.renderLeft(wrapper)}

            <View style={[styles.middle, this.props.style]}>
              {this.props.children}
            </View>

            {this.renderRight()}
          </View>
        )}
      />
    )
  }

  private renderLeft(wrapper: boolean) {
    if (this.props.canReturnBack) {
      return (
        <TouchableOpacity onPress={this.props.onReturnBack} style={[styles.start, this.props.startStyle]}>
          <Icon name="arrow-left" size={22} color={this.color}/>
        </TouchableOpacity>
      )
    }

    if (!this.props.noMenu && wrapper) {
      return (
        <TouchableOpacity onPress={this.props.onOpenMenu} style={[styles.start, this.props.startStyle]}>
          <Image source={this.props.color === 'dark' ? HomeBlack : Home} style={{
            width     : 30,
            height    : 30,
            resizeMode: 'contain',
            marginTop: 0,
          }}/>
          {/* <Text style={{color: this.color, fontSize: 8, fontWeight: '300'}}>home</Text> */}
        </TouchableOpacity>
      )
    }

    return <View style={styles.start}/>
  }

  private renderRight() {
    if (this.props.canToggleMulti) {
      return (
        <TouchableOpacity onPress={this.props.onToggleMulti} style={[styles.end, this.props.endStyle]}>
          <Image source={this.props.multi ? Library : CheckAll} style={{
            width     : 25,
            height    : 25,
            resizeMode: 'contain',
          }}/>
          <Text style={{color: this.color, fontSize: 8, fontWeight: '300'}} allowFontScaling={false}>{this.props.multi ? 'card' : 'list'}</Text>
        </TouchableOpacity>
      )
    }

    return <View style={styles.end}/>
  }

  private get color(): string {
    switch (this.props.color || 'light') { // tslint:disable-line:switch-default
      case 'light':
        return '#FFF'
      case 'dark':
        return '#041f43'
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf     : 'stretch',
    flexDirection : 'row',
    justifyContent: 'center',
    marginVertical:10
    // borderWidth: 1, borderColor: 'red',
  },

  start: {
    flex          : 1,
    justifyContent: 'center',
    alignItems    : 'center',
    opacity: 100,
  },

  end: {
    flex          : 1,
    justifyContent: 'center',
    alignItems    : 'center',
  },

  middle: {
    flex: 4,
  },
})
