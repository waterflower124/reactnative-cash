import React                    from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { connect }              from 'react-redux'
import { State }                from '../store'
import { AppMenu }              from './AppMenu'

export const WrapperContext = React.createContext(false)

interface WrapperProps extends JSX.ElementChildrenAttribute {
  menuOpen: boolean
  style?: StyleProp<ViewStyle>
  dark?: boolean
}

const mapStateToProps = (state: State) => {
  return {
    menuOpen: state.navigation.menuOpen,
  }
}

class BaseWrapper extends React.PureComponent<WrapperProps> {
  public render() {
    return (
      <WrapperContext.Provider value={true}>
        {
          this.props.menuOpen
            ? <AppMenu/>
            : this.props.children
        }
      </WrapperContext.Provider>
    )
  }
}

export const Wrapper = connect(mapStateToProps)(BaseWrapper)
