import { createStackNavigator, NavigationRouteConfigMap } from 'react-navigation'
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
import SelectAccountScreen from './screens/SelectAccountScreen';

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

export default createStackNavigator(screens, {
  initialRouteName  : 'Welcome',
  cardStyle         : {
    shadowOpacity: 0,
  },
  headerMode        : 'none',
})
