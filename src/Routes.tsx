import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { createAppContainer, createBottomTabNavigator, createDrawerNavigator, createStackNavigator, NavigationRouteConfigMap } from 'react-navigation'
import { AppMenu } from './containers/AppMenu'
import AddEmailAccountScreen          from './screens/AddEmailAccountScreen'
import AddFacebookAccountScreen       from './screens/AddFacebookAccountScreen'
import AddInstagramAccountScreen      from './screens/AddInstagramAccountScreen'
import ConfigureAccountScreen         from './screens/ConfigureAccountScreen'
import ConfigureAppScreen             from './screens/ConfigureAppScreen'
import LegalDocumentScreen            from './screens/LegalDocumentScreen'
import LostPasswordScreen             from './screens/LostPasswordScreen'
import MonetizationConfigureScreen    from './screens/MonetizationConfigureScreen'
import MonetizationDealScreen         from './screens/MonetizationDealScreen'
import MonetizationDealSummaryScreen  from './screens/MonetizationDealSummaryScreen'
import PasswordRecoveryScreen         from './screens/PasswordRecoveryScreen'
import ScanResultScreen               from './screens/ScanResultScreen'
import SelectAccountScreen from './screens/SelectAccountScreen'
import SettingsAccountScreen          from './screens/SettingsAccountScreen'
import SettingsAlertFrequencyScreen   from './screens/SettingsAlertFrequencyScreen'
import SettingsAppLanguageScreen      from './screens/SettingsAppLanguageScreen'
import SigninScreen                   from './screens/SigninScreen'
import SignupScreen                   from './screens/SignupScreen'
import SocialAdvertiserScreen         from './screens/SocialAdvertiserScreen'
import SocialAppScreen                from './screens/SocialAppScreen'
import SocialInterestScreen           from './screens/SocialInterestScreen'
import SocialPictureScreen            from './screens/SocialPictureScreen'
import SubscriptionHistoryScreen      from './screens/SubscriptionHistoryScreen'
import SubscriptionListScreen         from './screens/SubscriptionListScreen'
import SubscriptionRecourseListScreen from './screens/SubscriptionRecourseListScreen'
import SubscriptionScreen             from './screens/SubscriptionScreen'
import WalletAddBankAccountScreen     from './screens/WalletAddBankAccountScreen'
import { WalletScreen }               from './screens/WalletScreen'
import WalletWithdrawScreen           from './screens/WalletWithdrawScreen'
import WelcomeScreen                  from './screens/WelcomeScreen'

const screens: NavigationRouteConfigMap = {
  Welcome                 : {screen: WelcomeScreen},
  Signin                  : {screen: SigninScreen},
  Signup                  : {screen: SignupScreen},
  ConfigureApp            : {screen: ConfigureAppScreen},
  SettingsAccount         : {screen: SettingsAccountScreen},
  ConfigureAccount        : {screen: ConfigureAccountScreen},
  SelectAccount           : {screen: SelectAccountScreen},
  SettingsAppLanguage     : {screen: SettingsAppLanguageScreen},
  LegalDocument           : {screen: LegalDocumentScreen},
  SettingsAlertFrequency  : {screen: SettingsAlertFrequencyScreen},
  AddEmailAccount         : {screen: AddEmailAccountScreen},
  AddFacebookAccount      : {screen: AddFacebookAccountScreen},
  AddInstagramAccount     : {screen: AddInstagramAccountScreen},
  Subscription            : {screen: SubscriptionScreen},
  SubscriptionHistory     : {screen: SubscriptionHistoryScreen},
  SubscriptionRecourseList: {screen: SubscriptionRecourseListScreen},
  SubscriptionList        : {screen: SubscriptionListScreen},
  SocialApp               : {screen: SocialAppScreen},
  SocialPicture           : {screen: SocialPictureScreen},
  SocialInterest          : {screen: SocialInterestScreen},
  SocialAdvertiser        : {screen: SocialAdvertiserScreen},
  MonetizationDeal        : {screen: MonetizationDealScreen},
  MonetizationDealSummary : {screen: MonetizationDealSummaryScreen},
  MonetizationConfigure   : {screen: MonetizationConfigureScreen},
  Wallet                  : {screen: WalletScreen},
  WalletWithdraw          : {screen: WalletWithdrawScreen},
  WalletAddBankAccount    : {screen: WalletAddBankAccountScreen},
  ScanResult              : {screen: ScanResultScreen},
  LostPassword            : {screen: LostPasswordScreen},
  PasswordRecovery        : {screen: PasswordRecoveryScreen},
}

export type ScreenName = keyof typeof screens
const authStack = createStackNavigator({
  Welcome                 : {screen: WelcomeScreen},
  Signin                  : {screen: SigninScreen},
  Signup                  : {screen: SignupScreen},
  LostPassword            : {screen: LostPasswordScreen},
  PasswordRecovery        : {screen: PasswordRecoveryScreen},
  LegalDocument           : {screen: LegalDocumentScreen},
}, {
  initialRouteName  : 'Welcome',
  cardStyle         : {
    shadowOpacity: 0,
  },
  headerMode        : 'none',
})

const HomeNav = createStackNavigator({
  ConfigureApp            : {screen: ConfigureAppScreen},
  SettingsAccount         : {screen: SettingsAccountScreen},
  ConfigureAccount        : {screen: ConfigureAccountScreen},
  SelectAccount           : {screen: SelectAccountScreen},
  SettingsAppLanguage     : {screen: SettingsAppLanguageScreen},
  LegalDocument           : {screen: LegalDocumentScreen},
  SettingsAlertFrequency  : {screen: SettingsAlertFrequencyScreen},
  AddEmailAccount         : {screen: AddEmailAccountScreen},
  AddFacebookAccount      : {screen: AddFacebookAccountScreen},
  AddInstagramAccount     : {screen: AddInstagramAccountScreen},
  Subscription            : {screen: SubscriptionScreen},
  SubscriptionHistory     : {screen: SubscriptionHistoryScreen},
  SubscriptionRecourseList: {screen: SubscriptionRecourseListScreen},
  SubscriptionList        : {screen: SubscriptionListScreen},
  SocialApp               : {screen: SocialAppScreen},
  SocialPicture           : {screen: SocialPictureScreen},
  // SocialInterest          : {screen: SocialInterestScreen},
  // SocialAdvertiser        : {screen: SocialAdvertiserScreen},
  MonetizationDeal        : {screen: MonetizationDealScreen},
  MonetizationDealSummary : {screen: MonetizationDealSummaryScreen},
  MonetizationConfigure   : {screen: MonetizationConfigureScreen},
  Wallet                  : {screen: WalletScreen},
  WalletWithdraw          : {screen: WalletWithdrawScreen},
  WalletAddBankAccount    : {screen: WalletAddBankAccountScreen},
  ScanResult              : {screen: ScanResultScreen},
}, {
  initialRouteName: 'SocialApp',
  headerMode: 'none',
})

const tabNav = createBottomTabNavigator({
  SocialApp: {
    screen: HomeNav,
    navigationOptions: {
      header: null,
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => {
        return (
          <Icon
          name="home"
          size={30}
          color={tintColor}
          />
        )
      },
    },
  },
  SocialInterest: {
    screen: SocialInterestScreen,
    navigationOptions: {
      tabBarLabel: 'My Profile',
      tabBarIcon: ({ tintColor }) => {
      return (
        <MIcon
        name="person"
        size={30}
        color={tintColor}
        />
      )
    },
  },
  },
  SocialAdvertiser: {
    screen: SocialAdvertiserScreen,
    navigationOptions: {
      tabBarLabel: 'Alerts',
      tabBarIcon: ({ tintColor }) => {
        return (
          <Icon
          name="bell-ring"
          size={30}
          color={tintColor}
          />
        )
      },
    },
  },
}, {
  tabBarOptions: {
    inactiveTintColor: '#cccccc',
    activeTintColor: '#c46679',
    style: {
      backgroundColor: '#FFF',
      position: 'absolute',
      left: 30,
      right: 30,
      bottom: 0,
      height: 70,
      borderRadius: 35,
      borderTopWidth: 0,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        height: 2,
        width: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 8,
      zIndex: 1122,
    },
  },
})

const drawerStack = createDrawerNavigator({
  HomeTabs: { screen: tabNav },
  SocialInterest: {
    screen: SocialInterestScreen,
  },
  SocialAdvertiser: {
    screen: SocialAdvertiserScreen,
  },
}, {
  drawerBackgroundColor: '#0000',
  contentComponent: AppMenu,
  overlayColor: '#0008',
  drawerType: 'front',
})

const mainNav = createStackNavigator({
  authStack: { screen: authStack },
  drawerStack: { screen: drawerStack },
}, {
  initialRouteName  : 'authStack',
  cardStyle         : {
    shadowOpacity: 0,
  },
  headerMode        : 'none',
})

const mainNavigation = createAppContainer(mainNav)

export default mainNavigation
