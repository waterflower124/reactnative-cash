import React                         from 'react'
import { NavigationScreenProps }     from 'react-navigation'
import { connect }                   from 'react-redux'
import { Subscription, UserAccount } from '../httpapi'
import { Dispatch, State }           from '../store'

import {
  Image,
  StyleSheet,
  View,
}                              from 'react-native'
import { CardTransitioner }    from '../components/CardTransitioner'
import { Message }             from '../components/Message'
import { SafeAreaView }        from '../components/SafeAreaView'
import { SubscriptionContent } from '../components/SubscriptionContent'
import Text                    from '../components/Text'
import { Wrapper }             from '../containers/Wrapper'
import * as mediaquery         from '../utils/mediaquery'

import { KeepSkip }     from '../components/KeepSkip'
import { Header }       from '../containers/Header'
import * as itemActions from '../store/items/actions'

const ChevronUp = require('../../assets/icons/chevronUp.png')

interface SubscriptionScreenParams {
  subscription?: Subscription
}

interface SubscriptionScreenProps extends NavigationScreenProps<SubscriptionScreenParams> {
  currentAccount: UserAccount
  previous: Subscription | null
  previousContent: PromiseState<string>
  current: PromiseState<Subscription>
  currentContent: PromiseState<string>
  eof: boolean
  hideActions?: boolean

  onLoadSubscription(): void

  onDecline(): void

  onAccept(): void
}

class SubscriptionScreen extends React.PureComponent<SubscriptionScreenProps> {
  private transitioner: CardTransitioner<Subscription> | null = null

  public static mapStateToProps(state: State, ownProps: SubscriptionScreenProps): Partial<SubscriptionScreenProps> {
    const {subscription = undefined} = ownProps.navigation.state.params || {}

    if (subscription) {
      return {
        currentAccount : state.navigation.currentAccount,
        previous       : state.items.subscriptions.previous,
        previousContent: state.items.subscriptions.previousContent,
        current        : {_: 'success', item: subscription},
        currentContent : state.items.subscriptions.content,
        eof            : false,
        hideActions    : true,
      }
    }

    return {
      currentAccount : state.navigation.currentAccount,
      previous       : state.items.subscriptions.previous,
      previousContent: state.items.subscriptions.previousContent,
      current        : state.items.subscriptions.current,
      currentContent : state.items.subscriptions.content,
      eof            : state.items.subscriptions.eof,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch, ownProps: SubscriptionScreenProps): Partial<SubscriptionScreenProps> {
    return {
      async onLoadSubscription() {
        const {subscription = undefined} = ownProps.navigation.state.params || {}

        if (!subscription) {
          await dispatch(itemActions.subscriptions.load())
        }

        await dispatch(itemActions.loadSubscriptionContent(subscription))
      },

      async onDecline() {
        await dispatch(itemActions.subscriptions.requestPop(true))
        await dispatch(itemActions.loadSubscriptionContent())
      },

      async onAccept() {
        await dispatch(itemActions.subscriptions.requestPop(false))
        await dispatch(itemActions.loadSubscriptionContent())
      },
    }
  }

  public componentDidMount() {
    this.props.onLoadSubscription()
  }

  public componentWillReceiveProps(nextProps: SubscriptionScreenProps) {
    if (this.props.currentAccount.id !== nextProps.currentAccount.id) {
      this.props.onLoadSubscription()
    }
  }

  public render() {
    return (
      <Wrapper>
        <CardTransitioner
          ref={x => this.transitioner = x}
          previous={this.props.previous}
          current={this.props.current}
          eof={this.props.eof}
          eod={false}
          renderScene={this.renderContent}
        />
      </Wrapper>
    )
  }

  private renderContent = (subscription: Subscription) => {
    const content = this.props.previous && this.props.previous.id === subscription.id
      ? this.props.previousContent : this.props.currentContent

    return (
      <SubscriptionContent
        label={subscription.newsletter.name}
        content={content}
        renderContent={responder => (
          <SafeAreaView style={{flex: 1}}>
            <Header style={{alignItems: 'center'}} canToggleMulti>
              {
                subscription.newsletter.logo_url !== null
                  ? <Image source={{uri: subscription.newsletter.logo_url}}
                           style={styles.headerLogo}/>
                  : <View style={[styles.headerLogo, {backgroundColor: 'red'}]}/>
              }
            </Header>

            <View style={styles.headerContainer}>
              <Text allowFontScaling={false} style={styles.headerTextBrand} numberOfLines={2}>{subscription.newsletter.name}</Text>
              <Text allowFontScaling={false} style={styles.headerTextFrom} numberOfLines={1}>{subscription.newsletter.email}</Text>
            </View>

            <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'space-evenly'}}>
              <View style={styles.swipeUpContainer} {...responder.panHandlers}>
                <Image source={ChevronUp}/>
                <Message
                  id="screens.subscription.swipe_up"
                  defaultMessage="swipe up to see newsletters"
                  style={styles.swipeUpText}
                />
              </View>

              <View style={styles.details}>
                <View style={styles.detailContainer}>
                  <Text allowFontScaling={false} style={styles.detailTextAmount}>{subscription.total_emails.toString()}</Text>
                  <Message
                    id="screens.subscription.total_emails_1"
                    defaultMessage="mails received"
                    style={styles.detailText1}
                  />
                  <Message
                    id="screens.subscription.total_emails_2"
                    defaultMessage="since 3 month"
                    style={styles.detailText2}
                  />
                </View>

                <View style={styles.detailContainer}>
                  <Text allowFontScaling={false} style={styles.detailTextAmount}>
                    {Math.round(subscription.opening_rate * 100).toString()}
                    {' %'}
                  </Text>
                  <Message
                    id="screens.subscription.opening_rate_1"
                    defaultMessage="have been"
                    style={styles.detailText1}
                  />
                  <Message
                    id="screens.subscription.opening_rate_2"
                    defaultMessage="opened"
                    style={styles.detailText2}
                  />
                </View>
              </View>
            </View>

            {
              !this.props.hideActions &&
              <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline}
                        style={{marginVertical: 20}}/>
            }
          </SafeAreaView>
        )}
      />
    )
  }

  private onDecline = () => {
    this.props.onDecline()
    this.transitioner.transitionLeft()
  }
  private onAccept  = () => {
    this.props.onAccept()
    this.transitioner.transitionRight()
  }
}

export default connect(SubscriptionScreen.mapStateToProps, SubscriptionScreen.mapDispatchToProps)(SubscriptionScreen)

const styles = StyleSheet.create({
  headerContainer : {alignItems: 'center', paddingHorizontal: 20, marginTop: 10},
  headerLogo      : {
    ...mediaquery.screen({
      sm: {width: 96, height: 96, borderRadius: 48},
      md: {width: 112, height: 112, borderRadius: 56},
      lg: {width: 112, height: 112, borderRadius: 56},
    }),
  },
  headerTextBrand : {fontSize: 20, alignSelf: 'stretch', textAlign: 'center'},
  headerTextFrom  : {fontSize: 18, alignSelf: 'stretch', textAlign: 'center'},
  swipeUpContainer: {alignItems: 'center', justifyContent: 'center', flexGrow: 1},
  swipeUpText     : {fontSize: 14},
  details         : {
    flexDirection   : 'row',
    alignSelf       : 'stretch',
    marginHorizontal: 15,
  },
  detailContainer : {
    flex           : 1,
    borderWidth    : 1,
    borderColor    : '#FFF',
    borderRadius   : 5,
    alignItems     : 'center',
    paddingVertical: 20,
    margin         : 5,
  },
  detailTextAmount: {
    fontSize: mediaquery.screen({
      sm: 24,
      md: 30,
      lg: 30,
    }),
  },
  detailText1     : {
    fontSize: mediaquery.screen({
      sm: 14,
      md: 20,
      lg: 20,
    }),
  },
  detailText2     : {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 18,
      lg: 18,
    }),
  },
})
