import React        from 'react'
import SplashScreen from 'react-native-splash-screen'
import Navigation   from './containers/Navigation'

export default class App extends React.Component {

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return <Navigation/>
  }
}
