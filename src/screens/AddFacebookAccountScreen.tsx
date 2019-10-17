import React                                  from 'react'
import { View }                               from 'react-native'
import { connect }                            from 'react-redux'
import { FacebookCredentials, FacebookLogin } from '../components/FacebookLogin'
import { TitleBar }                           from '../containers/TitleBar'
import { Dispatch }                           from '../store'
import * as navigationActions                 from '../store/navigation/actions'
import * as sessionActions                    from '../store/session/actions'

interface AddFacebookAccountScreenProps {
  onLogin(email: string, password: string, credentials: FacebookCredentials): void
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch): Partial<AddFacebookAccountScreenProps> => {
  return {
    async onLogin(email, password, cookies) {
      await dispatch(sessionActions.createFacebookAccount(email, password, cookies))
      // dispatch(navigationActions.navigateTo('ScanResult', true))
      dispatch(navigationActions.navigateTo('ScanResult'))
    },
  }
}

class AddFacebookAccountScreen extends React.PureComponent<AddFacebookAccountScreenProps> {
  public render() {
    return (
      <View style={{flex: 1}}>
        <TitleBar titleId="screens.add_facebook_account.skeep_branding" titleDefault="Skeep"/>
        <FacebookLogin onLogin={this.props.onLogin} />
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFacebookAccountScreen)
