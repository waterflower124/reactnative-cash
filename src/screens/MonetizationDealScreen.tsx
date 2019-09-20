import React from 'react'

import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { SponsoredDeal, SponsoredDealPlatform, SponsoredDealRule } from '../httpapi'
import { Dispatch, State } from '../store'

import * as dealsActions from '../store/deals/actions'
import * as navigationActions from '../store/navigation/actions'

import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { CardTransitioner } from '../components/CardTransitioner'
import { DealContent } from '../components/DealContent'
import { Money } from '../components/Money'
import { SafeAreaView } from '../components/SafeAreaView'
import Text from '../components/Text'
import { Header } from '../containers/Header'
import { Wrapper } from '../containers/Wrapper'

import * as mediaquery from '../utils/mediaquery'

const ChevronUp = require('../../assets/icons/chevronUp.png')
const Accept = require('../../assets/icons/accept.png')
const Decline = require('../../assets/icons/decline.png')

interface MonetizationDealScreenProps extends NavigationScreenProps {
  sessionToken: string
  lang: string
  current: PromiseState<SponsoredDeal>
  previous: SponsoredDeal | null
  eof: boolean
  eod: boolean

  onLoadDeal(): void

  onAccept(): Promise<void>

  onDecline(): Promise<void>

  onSummary(): void
}

interface ScreenState {
  declining: boolean
  accepting: boolean
}

class MonetizationDealScreen extends React.Component<MonetizationDealScreenProps, ScreenState> {
  public readonly state: ScreenState = {
    declining: false,
    accepting: false,
  }

  private transitioner: CardTransitioner<SponsoredDeal> | null = null

  public static mapStateToProps(state: State): Partial<MonetizationDealScreenProps> {
    return {
      sessionToken: state.session.token,
      lang: state.session.user.lang,
      current: state.deals.current,
      previous: state.deals.previous,
      eof: state.deals.eof,
      eod: state.deals.eod,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<MonetizationDealScreenProps> {
    return {
      onLoadDeal() {
        dispatch(dealsActions.loadCurrent())
      },

      onAccept() {
        return dispatch(dealsActions.acceptDeal())
      },

      onDecline() {
        return dispatch(dealsActions.declineDeal())
      },

      onSummary() {
        return dispatch(navigationActions.navigateTo('MonetizationDealSummary'))
      },
    }
  }

  public componentDidMount() {
    this.props.onLoadDeal()
  }

  public render() {
    return (
      <Wrapper>
        <CardTransitioner
          ref={x => this.transitioner = x}
          current={this.props.current}
          previous={this.props.previous}
          eof={this.props.eof}
          eod={this.props.eod}
          renderScene={this.renderScene}
        />
      </Wrapper>
    )
  }

  private renderScene = (deal: SponsoredDeal) => {
    return (
      <DealContent
        deal={deal}
        style={{ flex: 1, alignSelf: 'stretch' }}
        onSwiped={this.onAccept}
        renderContent={panResponder => (
          <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: '#041f4399' }}>
            <LinearGradient colors={['#0000007F', '#00000000']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{ flex: 1, alignSelf: 'stretch' }}>
              <SafeAreaView style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <Header style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: deal.advertiser_logo_url }}
                    style={{ width: '80%', height: 60, resizeMode: 'contain' }}
                  />
                </Header>

                <View {...panResponder} style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Image source={ChevronUp} />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                    }}>swipe up to know more</Text>
                </View>

                <View style={{
                  alignSelf: 'stretch',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingHorizontal: 20,
                }}>
                  <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text allowFontScaling={false} style={{
                      fontSize: 18,
                    }}>
                      {deal.advertiser_name}
                    </Text>

                    <Image
                      source={require('../../assets/icons/facebook.png')}
                      style={{ width: 28, height: 28, resizeMode: 'contain' }}
                    />

                    <Text allowFontScaling={false} style={{
                      fontSize: 18,
                      borderWidth: 1,
                      borderColor: '#FFF',
                      borderRadius: 5,
                      paddingHorizontal: 5,
                    }}>
                      <Money value={{ amount: deal.fees, currency: 'eur' }} />
                    </Text>
                  </View>

                  <Text allowFontScaling={false} style={{
                    alignSelf: 'stretch',
                    fontSize: 15,
                    marginBottom: 5,
                  }}>is looking for publishing a post on Facebook</Text>

                  <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                    <View
                      style={{
                        backgroundColor: '#c43652',
                        borderRadius: 5,
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        margin: 5,
                      }}
                    >
                      <Text allowFontScaling={false} style={{
                        fontSize: 12,
                      }}>
                        {deal.deal_rules[`${this.props.lang}`]}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'space-evenly',
                  alignSelf: 'stretch',
                  marginVertical: 20,
                }}>
                  {
                    this.state.declining
                      ? <ActivityIndicator
                        size="large"
                        color="#FFF"
                        style={[styles.declineAction, { justifyContent: 'center', alignItems: 'center' }]}
                      />
                      : <TouchableOpacity onPress={this.onDecline}>
                        <Image source={Decline} style={styles.declineAction} />
                      </TouchableOpacity>
                  }

                  {
                    this.state.accepting
                      ? <ActivityIndicator
                        size="large"
                        color="#FFF"
                        style={[styles.declineAction, { justifyContent: 'center', alignItems: 'center' }]}
                      />
                      : <TouchableOpacity onPress={this.onAccept}>
                        <Image source={Accept} style={styles.acceptAction} />
                      </TouchableOpacity>
                  }
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        )}
      />
    )
  }

  private onDecline = async () => {
    if (this.state.declining || this.state.accepting) {
      return
    }

    this.setState({ declining: true })
    await this.props.onDecline()

    this.setState({ declining: false }, () => {
      this.transitioner.transitionLeft()
    })
  }

  private onAccept = () => {
    this.props.onSummary()
  }
}

export default connect
  (MonetizationDealScreen.mapStateToProps, MonetizationDealScreen.mapDispatchToProps)
  (MonetizationDealScreen)

const styles = StyleSheet.create({
  swipeUpContainer: { alignItems: 'center' },
  swipeUpText: { fontSize: 14 },
  actions: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-evenly', alignSelf: 'stretch' },
  declineAction: {
    marginBottom: 20,
    ...mediaquery.screen({
      sm: { width: 40, height: 40 },
      md: { width: 60, height: 60 },
      lg: { width: 60, height: 60 },
    }),
  },
  acceptAction: {
    ...mediaquery.screen({
      sm: { width: 80, height: 80 },
      md: { width: 100, height: 100 },
      lg: { width: 100, height: 100 },
    }),
  },
})
