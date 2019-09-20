import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  View,
  WebView,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-snap-carousel'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { CardTransitioner } from '../components/CardTransitioner'
import { KeepSkip } from '../components/KeepSkip'
import { Message } from '../components/Message'
import { SafeAreaView } from '../components/SafeAreaView'
import Text from '../components/Text'
import { Header } from '../containers/Header'
import { Wrapper } from '../containers/Wrapper'
import { SocialInterest, UserAccount } from '../httpapi'
import { Dispatch, State } from '../store'
import * as itemsActions from '../store/items/actions'
import * as mediaquery from '../utils/mediaquery'

interface SocialInterestScreenProps extends NavigationScreenProps {
  currentAccount: UserAccount
  current: PromiseState<SocialInterest>
  previous: SocialInterest | null
  ads: PromiseState<Array<string>>
  previousAds: PromiseState<string>
  eof: boolean

  onFetchInterest(): void

  onAccept(): void

  onDecline(): void
}

class SocialInterestScreen extends React.Component<SocialInterestScreenProps> {
  private transitioner: CardTransitioner<SocialInterest> | null = null

  public static mapStateToProps(state: State): Partial<SocialInterestScreenProps> {
    return {
      currentAccount: state.navigation.currentAccount,
      current       : state.items.interests.current,
      previous      : state.items.interests.previous,
      ads           : state.items.interests.ads,
      eof           : state.items.interests.eof,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<SocialInterestScreenProps> {
    return {
      async onFetchInterest() {
        await dispatch(itemsActions.interests.load())
        await dispatch(itemsActions.loadInterestAds())
      },

      async onAccept() {
        await dispatch(itemsActions.interests.requestPop(false))
        await dispatch(itemsActions.loadInterestAds())
      },

      async onDecline() {
        await dispatch(itemsActions.interests.requestPop(true))
        await dispatch(itemsActions.loadInterestAds())
      },
    }
  }

  public componentDidMount() {
    this.props.onFetchInterest()
  }

  public componentWillReceiveProps(nextProps: SocialInterestScreenProps) {
    if (this.props.currentAccount.id !== nextProps.currentAccount.id) {
      this.props.onFetchInterest()
    }
  }

  public render() {
    return (
      <Wrapper>
        <StatusBar barStyle="light-content"/>
        <CardTransitioner
          ref={x => this.transitioner = x}
          current={this.props.current}
          previous={this.props.previous}
          eof={this.props.eof}
          eod={false}
          renderScene={this.renderContent}
        />
      </Wrapper>
    )
  }

  private renderContent = (interest: SocialInterest) => {
    return (
      <View style={styles.background}>
        <LinearGradient colors={['#00000080', '#00000040', '#00000000']} locations={[0.2, 0.7, 1]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        style={styles.background2}>
          <SafeAreaView style={{
            flex: 1,
          }}>
            <View style={{
              justifyContent: 'space-evenly',
              alignItems    : 'center',
              flex          : 1,
              alignSelf     : 'stretch',
            }}>
              <Header style={{alignItems: 'center'}}>
                <Image
                  source={{uri: interest.image_url}}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Header>

              <Text allowFontScaling={false} style={{fontSize: 20}}>
                {interest.name}
              </Text>
              <Message
                id="screens.social_interest.explain_1"
                defaultMessage={`Ads based on:\nYour interests`}
                style={{fontSize: 18}}
              />

              <Message
                id="screens.social_interest.explain_2"
                defaultMessage="You have this interest because you click on {interestName} Ads"
                values={{interestName: interest.name}}
                style={{fontSize: 14, width: '70%', textAlign: 'center'}}
              />

              {this.renderCarousel(interest)}
            </View>

            <View style={styles.actionsContainer}>
              <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline}/>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    )
  }

  private renderCarousel(_interest: SocialInterest) {
    const windowSize = Dimensions.get('window')

    switch (this.props.ads._) {
      case 'loading':
        return (
          <View style={{width: windowSize.width, height: windowSize.width * 0.57, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#FFF"/>
          </View>
        )

      case 'failure':
        return null

      case 'success':
        const ads = this.props.ads.item
        if (ads.length <= 0) {
          return null
        }

        return (
          <View style={{alignItems: 'center'}}>
            <Message
              id="screens.social_interest.label_ads"
              defaultMessage="Example of ads as you can see"
              style={{
                fontSize    : 12,
                marginBottom: 10,
              }}
            />

            <Carousel
              itemWidth={windowSize.width * 0.7}
              sliderWidth={windowSize.width}
              enableSnap={true}
              data={ads}
              containerCustomStyle={{flexGrow: 0}}
              renderItem={({item: adhtml, index}) => (
                <View style={{width: windowSize.width * 0.7, height: windowSize.width * 0.57}} key={index}>
                  <WebView
                    source={{
                      html: adhtml.replace('</body>', `
                                                <style>
                                                    .fbInternPreview {
                                                        transform-origin: top left;
                                                        transform: scale(${windowSize.width * 0.7 / 502});
                                                    }
                                                </style>
                                            </body>`),
                    }}
                    style={{width: windowSize.width * 0.7, height: windowSize.width * 0.57}}
                    scalesPageToFit={false}
                    renderToHardwareTextureAndroid={true}
                    scrollEnabled={false}
                  />
                </View>
              )}
            />
          </View>
        )

      default:
        return null
    }
  }

  private onDecline = () => {
    this.props.onDecline()
    this.transitioner.transitionLeft()
  }

  private onAccept = () => {
    this.props.onAccept()
    this.transitioner.transitionRight()
  }
}

export default connect(SocialInterestScreen.mapStateToProps, SocialInterestScreen.mapDispatchToProps)(SocialInterestScreen)

const styles = StyleSheet.create({
  background            : {backgroundColor: '#3c5277', flex: 1},
  background2           : {flex: 1},
  container             : {
    flex          : 1,
    alignItems    : 'center',
    justifyContent: 'space-evenly',
    marginBottom  : 60,
  },
  logo                  : {
    ...mediaquery.screen({
      sm: {width: 50, height: 50, borderRadius: 25},
      md: {width: 75, height: 75, borderRadius: 37.5},
      lg: {width: 75, height: 75, borderRadius: 37.5},
    }),
    resizeMode: 'contain',
  },
  brandName             : {
    fontSize: mediaquery.screen({
      sm: 16,
      md: 20,
      lg: 20,
    }),
  },
  userID                : {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 18,
      lg: 18,
    }),
  },
  label                 : {
    fontSize: mediaquery.screen({
      sm: 10,
      md: 16,
      lg: 16,
    }),
  },
  details               : {
    flexDirection: 'row',
    alignItems   : 'center',
  },
  detailAmount          : {
    fontSize: mediaquery.screen({
      sm: 40,
      md: 40,
      lg: 40,
    }),
    margin  : 5,
    color   : '#c43652',
  },
  detailLabel           : {
    fontSize: 18,
    color   : '#c43652',
  },
  permissionIcon        : {
    ...mediaquery.screen({
      sm: {width: 20, height: 20},
      md: {width: 40, height: 40},
      lg: {width: 40, height: 40},
    }),
  },
  permissionName        : {
    fontSize: 14,
    color   : '#041f43',
  },
  permissionDetails     : {alignItems: 'center', paddingVertical: 5},
  permissionDescription : {alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 10, marginBottom: 5},
  permissionDisabledText: {alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 8, marginBottom: 5},
  actionsContainer      : {justifyContent: 'center', alignSelf: 'stretch', marginVertical: 20},
})
