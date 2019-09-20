import React from 'react'

import { connect } from 'react-redux'
import { Dispatch, State } from '../store'
import * as navigationActions from '../store/navigation/actions'
import * as sessionActions from '../store/session/actions'

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Button } from '../components/Button'
import { GradientButton } from '../components/GradientButton'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/AuthTextInput'
import { Header } from '../containers/Header'
import { StartedButton } from '../components/StartedButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


const { width, height } = Dimensions.get('window')

interface BaseSigninScreenProps {
  result?: PromiseState<void, ErrorReasons>

  onSignin(email: string, password: string): void

  onSignup(): void

  onLostPassword(): void
}

class BaseSigninScreen extends React.Component<BaseSigninScreenProps> {
  public readonly state = {
    email: '',
    password: '',
  }

  private emailInput: Base | null = null
  private passwordInput: Base | null = null

  public static mapStateToProps(state: State): Partial<BaseSigninScreenProps> {
    return {
      result: state.navigation.signin,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<BaseSigninScreenProps> {
    return {
      async onSignin(email, password) {
        await dispatch(sessionActions.signin(email, password))
      },

      onSignup() {
        dispatch(navigationActions.navigateTo('Signup'))
      },

      onLostPassword() {
        dispatch(navigationActions.navigateTo('LostPassword'))
      },
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
              this.props.result && this.props.result._ === 'failure' && this.props.result.error &&
              Object.entries(this.props.result.error).map(([reasonCode, params]) => (
                <Message
                  key={reasonCode}
                  id={`screens.signin.error.${reasonCode}`}
                  defaultMessage={reasonCode}
                  values={params}
                  style={styles.errorMessage}
                />
              ))
            }

            <TextInput
              autoCapitalize="none"
              theRef={x => this.emailInput = x}
              type="email"
              placeholderId="screens.signin.email_placeholder"
              placeholderDefault="Email"
              onSubmit={this.onSubmitEmail}
              value={this.state.email}
              onChangeText={this.onTextInputChange('email')}
              style={styles.input}
              inputStyle = {{color: '#ffffff'}}
            />

            <TextInput
              theRef={x => this.passwordInput = x}
              type="password"
              placeholderId="screens.signin.password_placeholder"
              placeholderDefault="Password"
              onSubmit={this.onSubmit}
              value={this.state.password}
              onChangeText={this.onTextInputChange('password')}
              isFinal
              style={styles.input}
              inputStyle = {{color: '#ffffff'}}
              rightAddon={<Icon name="eye-outline" style={styles.eyeIcon} />}
            />

            {/* <Button
              textId="screens.signin.submit"
              textDefault="Sign in"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            /> */}
            <StartedButton
              textDefault="Sign in"
              textId="screens.signin.submit"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
              style={{marginTop:10}}
            />

            <TouchableOpacity onPress={this.props.onLostPassword} style={styles.lostPassword}>
              <Message
                id="screens.signin.lost_password"
                defaultMessage="Forgot Password ?"
                style={styles.lostPasswordText}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Message
              id="screens.signin.signup_help"
              defaultMessage="Don't have an account?"
              style={styles.footerText}
            />
            <Message
              id="screens.signin.signup"
              defaultMessage="Sign up"
              style={styles.footerSignup}
              onPress={this.props.onSignup}
            />

            {/* <GradientButton
              textId="screens.signin.signup"
              textDefault="Sign up"
              onPress={this.props.onSignup}
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
    if (this.passwordInput) {
      this.passwordInput.focus()
    }
  }

  private onSubmit = () => {
    Keyboard.dismiss()

    this.props.onSignin(
      this.state.email,
      this.state.password,
    )
  }
}

export default connect(BaseSigninScreen.mapStateToProps, BaseSigninScreen.mapDispatchToProps)(BaseSigninScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  headerText: {
    borderWidth: 1,
    borderColor: '#041f43',
    color: '#041f43',
    borderRadius: 5,
    fontSize: 12,
    marginTop: 10,
    paddingVertical: 5,
    width: 120,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 50,
    ...Platform.select({
      ios: {
        marginTop: 100,
      },
      android: {
        marginTop: 30,
      },
    }),
  },
  errorMessage: {
    color: 'red',
    marginBottom: 30,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#ffffff4f'
  },
  footerContainer: {
    marginBottom: 100,
    paddingHorizontal: 50,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 13,
    color: '#ffffff',
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 20,
  },
  footerSignup: {
    fontSize: 13,
    color: '#ffffff',
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  lostPassword: {
    alignSelf: 'stretch',
    marginTop: 20,
  },
  lostPasswordText: {
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'left',
  },

})
