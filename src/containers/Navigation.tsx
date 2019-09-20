import React, { Component }                           from 'react'
import { BackHandler, Linking, Platform, StatusBar }  from 'react-native'
import { reduxifyNavigator }                          from 'react-navigation-redux-helpers'
import { connect, Provider }                          from 'react-redux'
import Routes                                         from '../Routes'
import { store }                                      from '../store'
import * as navigationActions                         from '../store/navigation/actions'
import * as sessionActions                            from '../store/session/actions'
import { restoreLanguage }                            from '../translate'

const App = reduxifyNavigator(Routes, 'root')
const mapStateToProps = (state) => ({ state: state.nav })
const AppWithNavigationState = connect(mapStateToProps)(App)

export default class Navigation extends Component {

  constructor(props) {
    super(props)
    this.onHardwareBackPress = this.onHardwareBackPress.bind(this)
    this.onLinkingUrl = this.onLinkingUrl.bind(this)
  }

  async componentDidMount() {
    Platform.select({
      ios: () => {
        StatusBar.setBarStyle('light-content')
      },
      android: () => {
        StatusBar.setTranslucent(true)
        StatusBar.setBackgroundColor('transparent')
      },
    })

    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
    Linking.addEventListener('url', this.onLinkingUrl)
    await restoreLanguage()
    this.forceUpdate()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardwareBackPress)
    Linking.removeEventListener('url', this.onLinkingUrl)
  }

  onHardwareBackPress() {
    // Force exit if we are in main screens.
    if (['Signin', 'Welcome'].includes(navigationActions.getCurrentRoute(store.getState()).routeName)) {
      return false
    }
    store.dispatch(navigationActions.navigateBack())
    return true
  }

  onLinkingUrl(evt: { url: string }) {
    store.dispatch(sessionActions.deepLink(evt.url))
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    )
  }
}
