import React from 'react'

import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch, State } from '../store'
import * as navigationActions from '../store/navigation/actions'
import * as sessionActions from '../store/session/actions'
import LinearGradient from 'react-native-linear-gradient'

import {
  Keyboard,
  Linking,
  StatusBar,
  StyleSheet,
  View,
  Dimensions
} from 'react-native'
import { Button } from '../components/Button'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/AuthTextInput'
import { Header } from '../containers/Header'
import { UserAccount } from '../httpapi'
import { StartedButton } from '../components/StartedButton'


const { width, height } = Dimensions.get('window')

interface AddEmailAccountScreenProps extends NavigationScreenProps {
  currentAccount?: UserAccount
  result?: PromiseState<void, ErrorReasons>

  onAddAccount(email: string, password: string): void
}

class AddEmailAccountScreen extends React.Component<AddEmailAccountScreenProps> {
  public readonly state = {
    email: this.props.currentAccount && this.props.currentAccount.email,
    password: '',
    needsPassword: false,
  }

  private emailInput: Base | null = null
  private passwordInput: Base | null = null

  public static mapStateToProps(state: State, ownProps: AddEmailAccountScreenProps): Partial<AddEmailAccountScreenProps> {
    const currentAccount = (
      ownProps.navigation.state.params &&
      ownProps.navigation.state.params.currentAccount === true &&
      state.navigation.currentAccount
    )

    return {
      result: state.navigation.addAccount,
      currentAccount,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<AddEmailAccountScreenProps> {
    return {
      async onAddAccount(email, password) {
        const success = await dispatch(sessionActions.createEmailAccount(email, password))

        if (success) {
          dispatch(navigationActions.navigateTo('ScanResult', true))
        }
      },
    }
  }

  public componentWillReceiveProps(nextProps: AddEmailAccountScreenProps) {
    const result = nextProps.result
    if (result) {
      if (result._ === 'failure' && 'requiredPassword' in result.error) {
        this.setState({ needsPassword: true })
      }

      if (result._ === 'failure' && 'redirect' in result.error) {
        Linking.openURL(result.error.redirect['to']) // tslint:disable-line:no-string-literal
      }
    }
  }

  public render() {
    return (
      <LinearGradient
        colors={['#c23652', '#051f43']}
        // start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
        style={{ width: width, height: height }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          <Header style={styles.headerContainer} color="dark" noMenu>
            <RegularHeader />
          </Header>

          <View style={styles.formContainer}>
            {
              this.props.result && this.props.result._ === 'failure' &&
              Object.entries(this.props.result.error)
                .filter(([reasonCode]) => reasonCode !== 'requiredPassword' || this.state.needsPassword)
                .map(([reasonCode, params]) => (
                  <Message
                    key={reasonCode}
                    id={`screens.add_email_account.error.${reasonCode}`}
                    defaultMessage={reasonCode}
                    values={params}
                    style={styles.errorMessage}
                  />
                ))
            }

            <TextInput
              theRef={x => this.emailInput = x}
              type="email"
              placeholderId="screens.add_email_account.email_placeholder"
              placeholderDefault="Email"
              onSubmit={this.onSubmitEmail}
              value={this.state.email}
              onChangeText={this.onTextInputChange('email')}
              isFinal={!this.state.needsPassword}
              style={styles.input}
            />

            {
              this.state.needsPassword &&
              <TextInput
                theRef={x => this.passwordInput = x}
                type="password"
                placeholderId="screens.add_email_account.password_placeholder"
                placeholderDefault="Password"
                onSubmit={this.onSubmit}
                value={this.state.password}
                onChangeText={this.onTextInputChange('password')}
                isFinal
                style={styles.input}
              />
            }

            <StartedButton
              textDefault="Add account"
              textId="screens.add_email_account.submit"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            />

            {/* <Button
              textId="screens.add_email_account.submit"
              textDefault="Add account"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            /> */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  private onTextInputChange = (field: string) => (text: string) => {
    this.setState({ [field]: text })
  }

  private onSubmitEmail = () => {
    if (this.state.needsPassword) {
      if (this.passwordInput) {
        this.passwordInput.focus()
      }
    } else {
      this.onSubmit()
    }
  }

  private onSubmit = () => {
    Keyboard.dismiss()

    this.props.onAddAccount(
      this.state.email,
      this.state.password,
    )
  }
}

export default connect(AddEmailAccountScreen.mapStateToProps, AddEmailAccountScreen.mapDispatchToProps)(AddEmailAccountScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  headerContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 50,
    marginTop: 60,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 30,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  input: {
    marginBottom: 30,
  },
  footerContainer: {
    marginBottom: 20,
    paddingHorizontal: 50,
  },
  footerText: {
    fontSize: 12,
    color: '#041f43',
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 20,
  },
})
