import { connect }            from 'react-redux'
import { Header as Base }     from '../components/Header'
import { Dispatch, State }    from '../store'
import * as navigationActions from '../store/navigation/actions'

const mapStateToProps = (state: State) => {
  return {
    canReturnBack: navigationActions.canBack(state),
    multi: ['SubscriptionList'].includes(navigationActions.getCurrentRoute(state).routeName),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onReturnBack() {
      dispatch(navigationActions.navigateBack())
      dispatch(navigationActions.openMenu())
    },
    onOpenMenu() {
      dispatch(navigationActions.openMenu())
      dispatch(navigationActions.loadMenuStats())
    },
    onToggleMulti() {
      dispatch(navigationActions.toggleMulti())
    },
  }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(Base)
