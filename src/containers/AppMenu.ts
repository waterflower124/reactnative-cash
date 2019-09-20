import * as redux          from 'react-redux'
import { Dispatch, State } from '../store'

import * as navigationActions from '../store/navigation/actions'
import * as sessionActions    from '../store/session/actions'

import * as AccountProviderIcon from '../components/AccountProviderIcon'
import {
  AppMenu as BaseAppMenu,
  AppMenuItem, AppMenuStats, AppMenuType,
}                               from '../components/AppMenu'
import { UserAccountStats }     from '../httpapi'

const AppMenuRedux = {
  mapStateToProps(state: State) {
    const providerName = state.navigation.currentAccount.provider.name.toLowerCase()
    return {
      currentAccount: {
        id   : state.navigation.currentAccount.id,
        icon : AccountProviderIcon.forAccount(state.navigation.currentAccount),
        label: state.navigation.currentAccount.email,
      },

      accounts: state.session.accounts.filter(x => x.id !== state.navigation.currentAccount.id).map(account => ({
        id   : account.id,
        icon : AccountProviderIcon.forAccount(account),
        label: account.email,
      })),

      stats: generateStats(state.navigation.menuStats),

      type: providerName === 'facebook' ? AppMenuType.Facebook :
        providerName === 'instagram' ? AppMenuType.Instagram :
          AppMenuType.Email,
    }
  },

  mapDispatchToProps(dispatch: Dispatch) {
    return {
      onSelect(menuItem) {
        switch (menuItem) {
          case AppMenuItem.OpenApplications:
            return dispatch(navigationActions.navigateTo('SocialApp', true))
          case AppMenuItem.OpenPhotos:
            return dispatch(navigationActions.navigateTo('SocialPicture', true))
          case AppMenuItem.OpenInterests:
            return dispatch(navigationActions.navigateTo('SocialInterest', true))
          case AppMenuItem.OpenCompanies:
            return dispatch(navigationActions.navigateTo('SocialAdvertiser', true))

          case AppMenuItem.OpenSubscriptions:
            return dispatch(navigationActions.navigateTo('Subscription', true))
          case AppMenuItem.OpenSubscriptionHistory:
            return dispatch(navigationActions.navigateTo('SubscriptionHistory', true))
          case AppMenuItem.OpenSubscriptionRecourses:
            return dispatch(navigationActions.navigateTo('SubscriptionRecourseList', true))

          case AppMenuItem.OpenMonetization:
            return dispatch(navigationActions.navigateTo('MonetizationDeal', true))
          case AppMenuItem.OpenWallet:
            return dispatch(navigationActions.navigateTo('Wallet', true))

          case AppMenuItem.AddAccount:
            return dispatch(navigationActions.navigateTo('ConfigureAccount'))

          case AppMenuItem.OpenSettings:
            return dispatch(navigationActions.navigateTo('ConfigureApp'))

          case AppMenuItem.LogOut:
            return dispatch(sessionActions.logout())

          default:
          // do nothing
        }
      },

      onSelectAccount(accountId) {
        dispatch(navigationActions.selectAccount(accountId))
        dispatch(navigationActions.loadMenuStats())
      },

      onClose() {
        return dispatch(navigationActions.closeMenu())
      },
    }
  },
}

export const AppMenu = redux.connect(AppMenuRedux.mapStateToProps, AppMenuRedux.mapDispatchToProps)(BaseAppMenu)

function generateStats(stats: PromiseState<UserAccountStats>): PromiseState<AppMenuStats> {
  switch (stats._) { // tslint:disable-line:switch-default
    case 'loading':
      return {_: 'loading'}

    case 'failure':
      return {_: 'success', item: {}}

    case 'success':
      return {
        _: 'success', item: {
          [AppMenuItem.OpenApplications]: stats.item.detected_items_details.apps,
          [AppMenuItem.OpenInterests]   : stats.item.detected_items_details.interests,
          [AppMenuItem.OpenCompanies]   : stats.item.detected_items_details.advertisers,
          [AppMenuItem.OpenPhotos]      : stats.item.detected_items_details.pictures,
          [AppMenuItem.OpenSubscriptions]        : stats.item.detected_items_details.subscriptions,
          [AppMenuItem.OpenSubscriptionRecourses]: stats.item.working_items_details.subscriptions,
        },
      }
  }
}
