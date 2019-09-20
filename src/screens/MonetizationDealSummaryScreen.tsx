import React                                from 'react'
import * as redux                           from 'react-redux'
import { SponsoredDeal, SponsoredDealRule } from '../httpapi'
import { Dispatch, State }                  from '../store'

import * as dealsActions      from '../store/deals/actions'
import * as navigationActions from '../store/navigation/actions'

import {
  Alert,
  Image,
  ScrollView,
  StatusBar, StyleProp, TextStyle,
  TouchableWithoutFeedback,
  View,
}                         from 'react-native'
import Icon               from 'react-native-vector-icons/MaterialCommunityIcons'
import { GradientButton } from '../components/GradientButton'
import { Message }        from '../components/Message'
import { Money }          from '../components/Money'
import { SafeAreaView }   from '../components/SafeAreaView'
import Text               from '../components/Text'
import { Header }         from '../containers/Header'
import { Wrapper }        from '../containers/Wrapper'
import { LegalDocument }  from './LegalDocumentScreen'

function extractRulesFromDeal(dealRules: SponsoredDealRule[]): string[] {
  const result = []
  for (const rule of dealRules) {
    if (rule.type === 'rule') {
      const description = rule.description.trim()
      if (description.length > 0) {
        result.push(description)
      }
    }
  }
  return result
}

interface MonetizationDealSummaryScreenProps {
  deal: PromiseState<SponsoredDeal>
  lang: string,
  isLoading: boolean,
  onAccept(): void
  onOpenGeneralTerms(): void
}

interface ScreenState {
  rules: boolean[]
  hardRules: boolean[]
}

class MonetizationDealSummaryScreen extends React.Component<MonetizationDealSummaryScreenProps, ScreenState> {
  public readonly state: ScreenState = {
    rules    : [false],
    hardRules: Array(1).fill(__DEV__),
  }

  public static mapStateToProps(state: State): Partial<MonetizationDealSummaryScreenProps> {
    return {
      lang: state.session.user.lang,
      deal: state.deals.current,
      isLoading: state.deals.isLoading,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<MonetizationDealSummaryScreenProps> {
    return {
      onAccept() {
        dispatch(dealsActions.acceptDeal())
      },

      onOpenGeneralTerms() {
        dispatch(navigationActions.navigateTo('LegalDocument', false, {document: LegalDocument.DEAL_GENERAL_TERMS}))
      },
    }
  }

  public render() {
    const dealPromise = this.props.deal
    if (dealPromise._ !== 'success') {
      return null
    }

    const deal = dealPromise.item
    return (
      <Wrapper>
        <StatusBar barStyle="dark-content"/>
        <SafeAreaView style={{flex: 1, alignSelf: 'stretch', backgroundColor: 'white', alignItems: 'center'}}>
          <Header color="dark" style={{alignItems: 'center'}}>
            <Image
              source={{uri: deal.advertiser_logo_url}}
              style={{width: '80%', height: 60, resizeMode: 'contain'}}
            />
          </Header>

          <Message
            id="screens.monetization_deal_summary.condition"
            defaultMessage="DEAL CONDITION"
            style={{
              fontSize : 22,
              color    : '#041f43',
              marginTop: 20,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.details"
            defaultMessage="Deal details"
            style={{
              alignSelf      : 'stretch',
              textAlign      : 'center',
              fontSize       : 14,
              backgroundColor: '#041f43',
              color          : '#FFF',
              marginTop      : 20,
              paddingVertical: 2,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.details_speech"
            defaultMessage="{advertiser} offer you to publish a post on Facebook."
            values={{advertiser: deal.advertiser_name}}
            style={{
              fontSize : 14,
              color    : '#041f43',
              marginTop: 10,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.profit"
            defaultMessage="Offer price"
            style={{
              alignSelf      : 'stretch',
              textAlign      : 'center',
              fontSize       : 14,
              backgroundColor: '#041f43',
              color          : '#FFF',
              marginTop      : 20,
              paddingVertical: 2,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.profit_speech"
            defaultMessage="You will earn : {amount} to post on Facebook."
            values={{amount: <Money value={{amount: deal.fees, currency: 'eur'}} style={{fontSize: 14, color: '#041f43'}}/>}}
            style={{
              fontSize : 14,
              color    : '#041f43',
              marginTop: 10,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.rules"
            defaultMessage="Pecular condition"
            style={{
              alignSelf      : 'stretch',
              textAlign      : 'center',
              fontSize       : 14,
              backgroundColor: '#041f43',
              color          : '#FFF',
              marginTop      : 20,
              paddingVertical: 2,
            }}
          />

          <Message
            id="screens.monetization_deal_summary.rules_speech"
            defaultMessage="Check if you want this deal"
            style={{
              fontSize : 12,
              color    : '#c43652',
              marginTop: 10,
            }}
          />

          <ScrollView alwaysBounceVertical={false}
                      style={{
                        alignSelf   : 'stretch',
                        marginBottom: 10,
                      }}
                      contentContainerStyle={{
                        flexGrow: 1,
                      }}>
            <View style={{
              marginBottom: 20,
              flex        : 1,
            }}>
              {
                extractRulesFromDeal([{type: 'rule', description: deal.deal_rules[this.props.lang]}]).map((rule, idx) => (
                  <DealRule
                    key={idx}
                    description={rule}
                    checked={this.state.rules[idx]}
                    onToggle={this.onToggleRule(idx)}
                  />
                ))
              }

              <DealRule
                labelId="screens.monetization_deal_summary.hard_rules.8"
                labelDefault="READ THE GENERAL TERMS"
                labelStyle={{textDecorationLine: 'underline'}}
                checked={this.state.hardRules[0]}
                onToggle={this.onToggleHardRule(0)}
                onPressLabel={this.props.onOpenGeneralTerms}
              />
            </View>

            <GradientButton
              textId="screens.monetization_deal_summary.submit"
              textDefault="I WANT THIS DEAL"
              loading={this.props.isLoading}
              style={{alignSelf: 'stretch', paddingHorizontal: 30}}
              onPress={this.onAccept}
            />
          </ScrollView>
        </SafeAreaView>
      </Wrapper>
    )
  }

  private onToggleRule = (idx: number) => () => {
    const rules = this.state.rules.slice()
    while (rules.length <= idx) {
      rules.push(false)
    }
    rules[idx] = !rules[idx]
    this.setState({rules})
  }

  private onToggleHardRule = (idx: number) => () => {
    const hardRules = this.state.hardRules.slice()
    hardRules[idx]  = !hardRules[idx]
    this.setState({hardRules})
  }

  private hasAcceptedRules(): boolean {
    return (
      this.state.rules.every(x => x) &&
      this.state.hardRules.every(x => x)
    )
  }

  private onAccept = () => {
    if (this.hasAcceptedRules()) {
      return this.props.onAccept()
    }

    Alert.alert(
      'Warning',
      'You must accept every condition in order to take this deal.',
    )
  }
}

interface DealRuleProps {
  description?: string
  labelId?: string
  labelDefault?: string
  labelValues?: { [key: string]: string }
  labelStyle?: StyleProp<TextStyle>
  checked: boolean

  onToggle(): void

  onPressLabel?(): void
}

function DealRule(props: DealRuleProps) {
  return (
    <TouchableWithoutFeedback onPress={props.onToggle}>
      <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
        <View style={{
          width         : 25,
          height        : 25,
          borderWidth   : 1,
          borderColor   : '#041f43',
          justifyContent: 'center',
          alignItems    : 'center',
          marginRight   : 20,
          marginLeft    : 15,
        }}>
          <Icon name="check" style={{
            opacity : props.checked ? 1 : 0,
            fontSize: 20,
            color   : '#c43652',
          }}/>
        </View>

        {
          typeof props.description === 'string'
            ? <Text allowFontScaling={false} style={{color: '#041f43', fontSize: 12, flex: 1, flexWrap: 'wrap'}}>
              {props.description}
            </Text>

            : <Message
              id={props.labelId}
              defaultMessage={props.labelDefault}
              values={props.labelValues}
              style={[{color: '#041f43', fontSize: 12, flex: 1, flexWrap: 'wrap'}, props.labelStyle]}
              onPress={props.onPressLabel}
            />
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

export default redux.connect
(MonetizationDealSummaryScreen.mapStateToProps, MonetizationDealSummaryScreen.mapDispatchToProps)
(MonetizationDealSummaryScreen)
