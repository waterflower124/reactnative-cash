import React from 'react'

import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ScrollView,
  StatusBar, StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Dimensions,
  StyleSheet,
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { AccountProviderIcon, AccountProviderIconName } from './AccountProviderIcon'
import { Message } from './Message'
import { SafeAreaView } from './SafeAreaView'
import Text from './Text'

const AnimatedSafeArea = Animatable.createAnimatableComponent(SafeAreaView)

interface Account {
  id: string
  icon: AccountProviderIconName
  label: string
}

export enum AppMenuItem {
  ChangeAccount,
  OpenApplications,
  OpenInterests,
  OpenCompanies,
  OpenPhotos,
  OpenMonetization,
  OpenWallet,
  OpenSettings,
  AddAccount,
  OpenSubscriptions,
  OpenSubscriptionHistory,
  OpenSubscriptionRecourses,
  LogOut,
}

export type AppMenuStats = {
  [K in AppMenuItem]?: number
}

export enum AppMenuType {
  Email,
  Facebook,
  Instagram,
}

export interface AppMenuProps {
  currentAccount: Account
  accounts: Array<Account>
  stats: PromiseState<AppMenuStats>
  type: AppMenuType
  showCloseButton?: boolean

  onSelect(menuItem: AppMenuItem): void

  onSelectAccount(accountId: string): void

  onClose(): void
}

const ApplicationLogo = require('../../assets/icons/bx-mobile-landscape.png')
const InterestsLogo = require('../../assets/icons/bx-target-lock.png')
const AdvertisersLogo = require('../../assets/icons/bx-award.png')
const MonetizationLogo = require('../../assets/icons/bx-dollar.png')
const SettingsLogo = require('../../assets/icons/setting.png')
const UserAddLogo = require('../../assets/icons/userAdd.png')
const ChevronUpDarkIcon = require('../../assets/icons/chevronUpDark.png')
const ChevronBottomSmallIcon = require('../../assets/icons/chevronBottomSmall.png')
const CloseSmallIcon = require('../../assets/icons/closeSmall.png')
const UserAddDarkIcon = require('../../assets/icons/userAddDark.png')
const WalletIcon = require('../../assets/icons/wallet.png')
const LogOutIcon = require('../../assets/icons/bx-log-out.png')

export class AppMenu extends React.Component<AppMenuProps> {
  public readonly state = {
    changingAccount: false,
  }

  public render() {
    // animation="slideInLeft" duration={250} ...StyleSheet.absoluteFillObject ,
    return (
      <SafeAreaView style={{ backgroundColor: '#0000', zIndex: 12 }}>
        <View style = {{width: '100%', height: '100%', backgroundColor: '#ffffff', borderTopRightRadius: 20, borderBottomRightRadius: 20, overflow: 'hidden'}}>
        <StatusBar barStyle="dark-content" />

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
          marginTop: 10,
        }}>
          <Message
            id="components.menu.title"
            defaultMessage="MENU"
            style={{ fontSize: 22, color: '#041f43' }}
          />

          {
            this.props.showCloseButton || true &&
            <TouchableOpacity onPress={this.onClose} style={{ margin: 10, position: 'absolute', right: 0 }}>
              <Image source={CloseSmallIcon} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          }
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 }}>
          <AccountProviderIcon name={this.props.currentAccount.icon} />

          <Message
            id="components.menu.current_account"
            defaultMessage="You control your Facebook account: {account}"
            values={{ account: this.props.currentAccount.label }}
            style={{ flex: 3, fontSize: 12, color: '#041f43' }}
          />

          <TouchableOpacity
            onPress={this.onSelect(AppMenuItem.ChangeAccount)}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {
              !this.state.changingAccount &&
              <Message
                id="components.menu.change_account"
                defaultMessage="Change account"
                style={{ fontSize: 8, color: '#041f43', marginBottom: 5 }}
              />
            }

            <Image source={this.state.changingAccount ? ChevronUpDarkIcon : ChevronBottomSmallIcon} />
          </TouchableOpacity>
        </View>

        {this.renderContent()}
        </View>
      </SafeAreaView>
    )
  }

  private renderContent() {
    if (this.state.changingAccount) {
      return (
        <ScrollView style={{}}>
          {this.props.accounts.map(account => (
            <TouchableOpacity key={account.id} onPress={this.onSelectAccount(account.id)}>
              <View style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#a4a4a4',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  marginRight: 10,
                }}>
                  <AccountProviderIcon name={account.icon} size={30} />
                </View>

                <Text style={{ flex: 1, fontSize: 12, color: '#041f43' }} allowFontScaling={false}>{account.label}</Text>

                <Message
                  id="components.menu.select_account"
                  defaultMessage="GO"
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    minWidth: 60,
                    borderWidth: 1,
                    borderColor: '#041f43',
                    borderRadius: 5,
                    fontSize: 14,
                    color: '#041f43',
                    textAlign: 'center',
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={this.onSelect(AppMenuItem.AddAccount)}>
            <View style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
              <Image source={UserAddDarkIcon} style={{ width: 40, height: 40, marginRight: 10 }}
                resizeMode="center" />

              <Message
                id="components.menu.add_account"
                defaultMessage="Add account"
                style={{ flex: 1, fontSize: 12, color: '#041f43' }}
              />

              <LinearGradient
                colors={['#051f43', '#c23652']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  minWidth: 60,
                  justifyContent: 'center',
                }}>
                <Message
                  id="components.menu.add_account_button"
                  defaultMessage="ADD"
                  style={{
                    fontSize: 14,
                    color: '#FFF',
                  }}
                />
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )
    }

    return (
      <ScrollView style={{}}>
        {this.renderItems()}
        <LastAppMenuItemComponent
          labelId="components.menu.settings_label"
          labelDefault="Settings"
          descriptionId="components.menu.settings_description"
          descriptionDefault=""
          logoSource={SettingsLogo}
          onSelect={this.onSelect(AppMenuItem.OpenSettings)}
          onLogOut={this.onSelect(AppMenuItem.LogOut)}
        />
        {/* <AppMenuItemComponent
          labelId="components.menu.add_account_label"
          labelDefault="Add account"
          descriptionId="components.menu.add_account_description"
          descriptionDefault=""
          logoSource={UserAddLogo}
          buttonLabelId="components.menu.add_account_button_label"
          buttonLabelDefault="ADD"
          onSelect={this.onSelect(AppMenuItem.AddAccount)}
          style={{borderBottomWidth: 1, borderBottomColor: '#041f4319'}}
        /> */}
        {/* <AppMenuItemComponent
          labelId="components.menu.logout_label"
          labelDefault="Log out"
          descriptionId="components.menu.logout_description"
          descriptionDefault=""
          // logo={<Icon name="logout" size={41} />}
          logoSource = {LogOutIcon}
          onSelect={this.onSelect(AppMenuItem.LogOut)}
          style={{ borderBottomWidth: 1, borderBottomColor: '#041f4319' }}
        /> */}
      </ScrollView>
    )
  }

  private renderItems() {
    switch (this.props.type) { // tslint:disable-line:switch-default
      case AppMenuType.Facebook:
        return (
          <React.Fragment>
            <AppMenuItemComponent
              labelId="components.menu.applications_label"
              labelDefault="Applications"
              descriptionId="components.menu.applications_description"
              descriptionDefault="Control application connected with Facebook Connect"
              logoSource={ApplicationLogo}
              buttonLabelAsync={this.getItemLabel(AppMenuItem.OpenApplications)}
              onSelect={this.onSelect(AppMenuItem.OpenApplications)}
            />
            <AppMenuItemComponent
              labelId="components.menu.interests_label"
              labelDefault="Interests"
              descriptionId="components.menu.interests_description"
              descriptionDefault="Control interests based on your Facebook activities"
              logoSource={InterestsLogo}
              buttonLabelAsync={this.getItemLabel(AppMenuItem.OpenInterests)}
              onSelect={this.onSelect(AppMenuItem.OpenInterests)}
            />
            <AppMenuItemComponent
              labelId="components.menu.companies_label"
              labelDefault="Companies"
              descriptionId="components.menu.companies_description"
              descriptionDefault="Control the companies with which you interacted"
              logoSource={AdvertisersLogo}
              buttonLabelAsync={this.getItemLabel(AppMenuItem.OpenCompanies)}
              onSelect={this.onSelect(AppMenuItem.OpenCompanies)}
            />
            <AppMenuItemComponent
              labelId="components.menu.wallet_label"
              labelDefault="Wallet"
              descriptionId="components.menu.wallet_description"
              descriptionDefault="Manage and transfer funds from your Skeep account"
              // logo={<Icon name="wallet" size={41} />}
              logoSource={WalletIcon}
              onSelect={this.onSelect(AppMenuItem.OpenWallet)}
            />
            <SpecialAppMenuItemComponent
              labelId="components.menu.monetization_label"
              labelDefault="Monetization"
              descriptionId="components.menu.monetization_description"
              descriptionDefault="Control the value of your personal data and get paid"
              badgeLabelId="components.menu.monetization_badge_label"
              badgeLabelDefault="ALPHA"
              logoSource={MonetizationLogo}
              buttonLabelId="components.menu.monetization_button"
              buttonLabelDefault="GET NOW"
              onSelect={this.onSelect(AppMenuItem.OpenMonetization)}
            />
          </React.Fragment>
        )

      case AppMenuType.Email:
        return (
          <React.Fragment>
            <AppMenuItemComponent
              labelId="components.menu.newsletters_label"
              labelDefault="Newsletters"
              descriptionId="components.menu.newsletters_description"
              descriptionDefault="Control your mailbox"
              logoSource={AdvertisersLogo}
              buttonLabelAsync={this.getItemLabel(AppMenuItem.OpenSubscriptions)}
              onSelect={this.onSelect(AppMenuItem.OpenSubscriptions)}
            />
            <AppMenuItemComponent
              labelId="components.menu.recourses_label"
              labelDefault="Recourses"
              descriptionId="components.menu.recourses_description"
              descriptionDefault="Track your newsletters"
              logoSource={AdvertisersLogo}
              buttonLabelAsync={this.getItemLabel(AppMenuItem.OpenSubscriptionRecourses)}
              onSelect={this.onSelect(AppMenuItem.OpenSubscriptionRecourses)}
            />
            <AppMenuItemComponent
              labelId="components.menu.history_label"
              labelDefault="History"
              descriptionId="components.menu.history_description"
              descriptionDefault="Newsletters you have reviewed"
              logoSource={AdvertisersLogo}
              onSelect={this.onSelect(AppMenuItem.OpenSubscriptionHistory)}
            />
          </React.Fragment>
        )

      case AppMenuType.Instagram:
        return (
          <React.Fragment>
            <SpecialAppMenuItemComponent
              labelId="components.menu.monetization_label"
              labelDefault="Monetization"
              descriptionId="components.menu.monetization_description"
              descriptionDefault="Control the value of your personal data and get paid"
              badgeLabelId="components.menu.monetization_badge_label"
              badgeLabelDefault="ALPHA"
              logoSource={MonetizationLogo}
              buttonLabelId="components.menu.monetization_button"
              buttonLabelDefault="GET NOW"
              onSelect={this.onSelect(AppMenuItem.OpenMonetization)}
            />
            <AppMenuItemComponent
              labelId="components.menu.wallet_label"
              labelDefault="Wallet"
              descriptionId="components.menu.wallet_description"
              descriptionDefault="Manage and transfer funds from your Skeep account"
              logo={<Icon name="wallet" size={41} />}
              // buttonLabelAsync={{_: 'success', item: '30 €'}}
              onSelect={this.onSelect(AppMenuItem.OpenWallet)}
            />
          </React.Fragment>
        )
    }
  }

  private getItemLabel(item: AppMenuItem): PromiseState<string> {
    switch (this.props.stats._) { // tslint:disable-line:switch-default
      case 'loading':
        return { _: 'loading' }

      case 'failure':
        return { _: 'success', item: '!' }

      case 'success':
        const stat = this.props.stats.item[item]
        if (stat) {
          return { _: 'success', item: stat.toString() }
        }
        return { _: 'success', item: '0' }
    }
  }

  private onClose = () => {
    this.props.onClose()
  }

  private onSelect = (menuItem: AppMenuItem) => () => {
    switch (menuItem) {
      case AppMenuItem.ChangeAccount:
        return this.setState({ changingAccount: !this.state.changingAccount })

      default:
        return this.props.onSelect(menuItem)
    }
  }

  private onSelectAccount = (accountId: string) => () => {
    this.props.onSelectAccount(accountId)
    this.setState({ changingAccount: false })
  }
}

interface AppMenuItemProps {
  labelId: string
  labelDefault: string
  descriptionId: string
  descriptionDefault: string
  logoSource?: ImageSourcePropType
  logo?: JSX.Element
  buttonLabelId?: string
  buttonLabelDefault?: string
  buttonLabelAsync?: PromiseState<string>
  style?: StyleProp<ViewStyle>

  onSelect(): void
}

interface LastAppMenuItemProps {
  labelId: string
  labelDefault: string
  descriptionId: string
  descriptionDefault: string
  logoSource?: ImageSourcePropType
  logo?: JSX.Element
  buttonLabelId?: string
  buttonLabelDefault?: string
  buttonLabelAsync?: PromiseState<string>
  style?: StyleProp<ViewStyle>

  onSelect(): void
  onLogOut(): void
}

function AppMenuItemComponent(props: AppMenuItemProps) {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={[{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#041f4319',
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: 'center',
      }, props.style]}>
        {
          props.logo
            ? <View style={{ marginRight: 10 }}>{props.logo}</View>

            : <View
              style={{ width: 42, height: 42, marginRight: 10, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
              <Image source={props.logoSource} resizeMode='cover' />
            </View>

        }

        <View style={{ flex: 1 }}>
          <Message
            id={props.labelId}
            defaultMessage={props.labelDefault}
            style={{ fontSize: 14, color: '#041f43' }}
          />
          <Message
            id={props.descriptionId}
            defaultMessage={props.descriptionDefault}
            style={{ fontSize: 8, color: '#041f43' }}
          />
        </View>

        {
          (props.buttonLabelId || props.buttonLabelAsync) &&
          <LinearGradient
            colors={['#051f43', '#c23652']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              minWidth: 56,
              paddingHorizontal: 5,
              paddingVertical: 5,
              borderRadius: 5,
              height: 27,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {
              props.buttonLabelId &&
              <Message
                id={props.buttonLabelId}
                defaultMessage={props.buttonLabelDefault}
              />
            }
            {
              props.buttonLabelAsync && (
                props.buttonLabelAsync._ === 'loading' ?
                  <ActivityIndicator color="#FFF" size="small" /> :
                  props.buttonLabelAsync._ === 'success' ?
                    <Text style={{ fontSize: 14 }} allowFontScaling={false}>{props.buttonLabelAsync.item}</Text> :
                    undefined
              )
            }
          </LinearGradient>
        }
      </View>
    </TouchableOpacity>
  )
}

function SpecialAppMenuItemComponent(props: AppMenuItemProps & { badgeLabelId?: string, badgeLabelDefault?: string }) {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      {/* <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: '#c43652',
      }}> */}
      <LinearGradient colors={['#041f43', '#c43652']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 30,
        }}>
        {/* <Image source={props.logoSource} style={{ width: 41, height: 41, resizeMode: 'contain', marginRight: 10 }} /> */}
        <View
          style={{ width: 42, height: 42, marginRight: 10, backgroundColor: '#f8f8f810', justifyContent: 'center', alignItems: 'center', borderRadius: 8, }}>
          <Image source={props.logoSource} resizeMode='cover' />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Message
              id={props.labelId}
              defaultMessage={props.labelDefault}
              style={{ fontSize: 14, color: '#FFF' }}
            />
            {/* <Message
              id={props.badgeLabelId}
              defaultMessage={props.badgeLabelDefault}
              style={{
                fontSize: 8,
                color: '#FFF',
                paddingHorizontal: 6,
                minWidth: 40,
                textAlign: 'center',
                borderWidth: 1,
                borderColor: '#FFF',
                borderRadius: 5,
                marginLeft: 16,
                height: 10,
              }}
            /> */}
          </View>
          <Message
            id={props.descriptionId}
            defaultMessage={props.descriptionDefault}
            style={{ fontSize: 8, color: '#FFF' }}
          />
        </View>

        {/* {
          (props.buttonLabelId || props.buttonLabelAsync) &&
          <View style={{
            borderWidth: 1,
            borderColor: '#FFF',
            minWidth: 56,
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderRadius: 5,
            height: 27,
            alignItems: 'center',
          }}>
            {
              props.buttonLabelId &&
              <Message
                id={props.buttonLabelId}
                defaultMessage={props.buttonLabelDefault}
              />
            }
            {
              props.buttonLabelAsync && (
                props.buttonLabelAsync._ === 'loading' ?
                  <ActivityIndicator color="#FFF" size="small" /> :
                  props.buttonLabelAsync._ === 'success' ?
                    <Text style={{ fontSize: 14 }}>{props.buttonLabelAsync.item}</Text> :
                    undefined
              )
            }
          </View>
        } */}
      </LinearGradient>
    </TouchableOpacity >
  )
}

function LastAppMenuItemComponent(props: LastAppMenuItemProps) {
  return (
    <View style={[{
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#041f4319',
      paddingVertical: 20,
      paddingHorizontal: 30,
      alignItems: 'center',
      justifyContent:'space-between'
    }, props.style]}>
      <TouchableOpacity onPress={props.onSelect}>
        <View style={[{
          flexDirection: 'row',
          alignItems: 'center',
          flex:1
        }, ]}>
          {
            props.logo
              ? <View style={{ marginRight: 10 }}>{props.logo}</View>
              : <View
                style={{ width: 42, height: 42, marginRight: 10, backgroundColor: '#f8f8f8', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
                <Image source={props.logoSource} resizeMode='cover' />
              </View>
          }
            <Message
              id={props.labelId}
              defaultMessage={props.labelDefault}
              style={{ fontSize: 14, color: '#041f43' }}
            />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.onLogOut} >
        <Image source={LogOutIcon} resizeMode='cover' />
      </TouchableOpacity>

    </View>
  )
}
