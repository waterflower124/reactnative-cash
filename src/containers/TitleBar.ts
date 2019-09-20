import { connect }            from 'react-redux'
import { TitleBar as Base }   from '../components/TitleBar'
import { Dispatch, State }    from '../store'
import * as navigationActions from '../store/navigation/actions'

const mapStateToProps = (state: State) => {
  return {
    enableBack: navigationActions.canBack(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onBack() {
      dispatch(navigationActions.navigateBack())
    },
  }
}

export const TitleBar = connect(mapStateToProps, mapDispatchToProps)(Base)
