import React from 'react'

import { connect } from 'react-redux'
import { Dispatch } from '../store'
import * as announceActions from '../store/announces/actions'
import * as navigationActions from '../store/navigation/actions'
import * as sessionActions from '../store/session/actions'

import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Swiper from 'react-native-swiper'
import { Message } from '../components/Message'
import { SafeAreaView } from '../components/SafeAreaView'
import { Splash } from '../components/Splash'
import { StartedButton } from '../components/StartedButton'

const OnBoarding1 = require('../../assets/Welcome.png')
const OnBoarding2 = require('../../assets/Welcome2.png')
const OnBoarding3 = require('../../assets/Welcome3.png')

const Logo = require('../../assets/Logo2.png')

const { width, height } = Dimensions.get('window')

export const mediumFont: string = Platform.select({
  ios: 'Montserrat-Medium',
  android: 'montserrat_medium',
})

interface Properties {
  onDeepLink(): Promise<boolean>

  onFetchLastAnnounce(): Promise<void>

  onAppStart(): Promise<boolean>

  onGetStarted(): void
}

class WelcomeScreen extends React.Component<Properties> {
  public readonly state = {
    loaded: false,
  }

  public async componentDidMount() {
    if (await this.props.onDeepLink()) {
      return
    }

    // Fetch last annonce
    await this.props.onFetchLastAnnounce()

    if (await this.props.onAppStart()) {
      // the user is now logged, do nothing
      // as a new screen will be navigated to
    } else {
      // noinspection JSIgnoredPromiseFromCall
      this.startWelcome()
    }
  }

  public render() {
    if (!this.state.loaded) {
      return <Splash />
    }

    return (
      <Swiper renderPagination={this.renderPagination} loop={false}>
        <View style={{ flex: 1 }}>
          {/* <LinearGradient
            colors={['#041F43', '#c43652']}
            // start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            style={{width: width, height: height}}
          >
            <Message
              id="screens.welcome.title1"
              defaultMessage="CONTROL"
              style={styles.slideHeaderText1}
            />
            <Message
              id="screens.welcome.content1"
              defaultMessage="your personal data against companies"
              style={styles.slideContentText}
            /> */}
          <ImageBackground source={OnBoarding1} style={styles.slideBackground}>
            <Image source={Logo} style={styles.slideLogo} />
            <Message
              id="screens.welcome.descrtion1"
              defaultMessage="EVERYONE CAN CONTROL AND MONETIZE THEIR DATA."
              style={styles.slideText1}
            />
          </ImageBackground>
          {/* </LinearGradient> */}
        </View>

        <View style={styles.slide}>
          {/* <LinearGradient
            colors={['#041F43', '#c43652']}
            // start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            style={{ width: width, height: height }}
          >
            <Message
              id="screens.welcome.title2"
              defaultMessage="MONETIZE"
              style={styles.slideHeaderText2}
            />
            <Message
              id="screens.welcome.content2"
              defaultMessage="your data and earn money with ease"
              style={styles.slideContentText}
            /> */}
          <ImageBackground source={OnBoarding2} style={styles.slideBackground}>
            <Image source={Logo} style={styles.slideLogo} />
            <Message
              id="screens.welcome.descrtion2"
              defaultMessage="FEEL FREE TO RELEASE THE VALUE OF YOUR DATA."
              style={styles.slideText2}
            />
          </ImageBackground>
          {/* </LinearGradient> */}
        </View>

        <View style={styles.slide}>
          {/* <LinearGradient
            colors={['#041F43', '#c43652']}
            // start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            style={{ width: width, height: height }}
          >
            <Message
              id="screens.welcome.title3"
              defaultMessage="CASH"
              style={styles.slideHeaderText3}
            />
            <Message
              id="screens.welcome.content3"
              defaultMessage="your money in your bank account"
              style={styles.slideContentText}
            /> */}
          <ImageBackground source={OnBoarding3} style={styles.slideBackground}>
            <Image source={Logo} style={styles.slideLogo} />
            <Message
              id="screens.welcome.descrtion3"
              defaultMessage="I CHOOSE MYSELF WHO USE MY DATA AND I DECIDE TO MAKE MONEY."
              style={styles.slideText3}
            />
          </ImageBackground>
          {/* </LinearGradient> */}
        </View>
      </Swiper>
    )
  }

  private renderPagination = (index: number, total: number) => (
    <Pagination index={index} total={total}
      onGetStarted={this.props.onGetStarted} />
  )

  private async startWelcome() {
    this.setState({ loaded: true })
  }
}

function mapDispatchToProps(dispatch: Dispatch): Partial<Properties> {
  return {
    onDeepLink() {
      return dispatch(sessionActions.deepLink())
    },

    onFetchLastAnnounce() {
      return dispatch(announceActions.requestFetchLast())
    },

    onAppStart() {
      return dispatch(sessionActions.appStart())
    },

    onGetStarted() {
      dispatch(navigationActions.navigateTo('Signin'))
    },
  }
}

export default connect(null, mapDispatchToProps)(WelcomeScreen)

function Pagination(props: { index: number, total: number, onGetStarted: () => void }) {
  return (
    <SafeAreaView style={styles.paginationContainer}>
      <StatusBar barStyle={'light-content'} />
      {
        props.index < 2 ?
          Array(props.total).fill(0).map((_, key) => (
            <View
              key={key}
              style={[
                props.index === key ? styles.paginationDotActive : styles.paginationDot,
                key > 0 && { marginLeft: 30 },
              ]}
            />
          ))
          : <StartedButton textDefault="GET STARTED" textId="screens.welcome.get_started"
            onPress={props.onGetStarted} style={styles.getStartedButton} />
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slide: {
    flex: 1,
  },
  slideBackground: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  slideContainer: {
    flex: 1,
    marginBottom: 150,
    alignItems: 'center',
  },
  slideLogo: {
    marginTop: 50,
    alignSelf: 'center'
  },
  slideHeader: {
    alignItems: 'center',
  },

  slideText1: {
    fontSize: 24,
    lineHeight: 37,
    width:220,
    marginLeft:20,
    marginTop:'80%'
  },
  slideText2: {
    fontSize: 24,
    lineHeight: 37,
    width:220,
    marginLeft:20,
    marginTop:'80%'
  },
  slideText3: {
    fontSize: 24,
    lineHeight: 37,
    width:280,
    marginLeft:20,
    marginTop:'80%',
    fontWeight:'bold'
  },

  slideHeaderText1: {
    fontFamily: mediumFont,
    fontSize: 48,
    textAlign: 'center',
    marginTop: 50,
    color: '#FF8E61',
  },

  slideHeaderText2: {
    fontFamily: mediumFont,
    fontSize: 48,
    textAlign: 'center',
    marginTop: 50,
    color: '#C43652',
  },

  slideHeaderText3: {
    fontFamily: mediumFont,
    fontSize: 48,
    textAlign: 'center',
    marginTop: 50,
    color: '#227FBB',
  },

  slideContentText: {
    fontFamily: mediumFont,
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 40,
    // alignSelf: 'flex-start',
  },
  slideContentTextInverted: {
    fontSize: 30,
    color: '#000',
    backgroundColor: '#FFF',
  },

  slideContentButton: {
    marginTop: 20,
  },

  getStartedButton: {
    flex: 1,
    marginHorizontal: 30,
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  paginationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  paginationDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d67085'
  },
})
