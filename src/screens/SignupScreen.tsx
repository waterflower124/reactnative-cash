import React from 'react'

import { connect } from 'react-redux'
import { Dispatch, State } from '../store'
import * as navigationActions from '../store/navigation/actions'
import * as sessionActions from '../store/session/actions'

import { Keyboard, ScrollView, StatusBar, StyleSheet, View, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'
import { GradientButton } from '../components/GradientButton'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/AuthTextInput'
import { Header } from '../containers/Header'
import { LegalDocument } from './LegalDocumentScreen'
import { StartedButton } from '../components/StartedButton'

const { width, height } = Dimensions.get('window')

interface BaseSignupScreenProps {
  result?: PromiseState<void, ErrorReasons>

  onSignup(email: string, password: string): void

  onSignin(): void

  onViewDocument(document: LegalDocument): void
}

class BaseSignupScreen extends React.Component<BaseSignupScreenProps> {
  public readonly state = {
    email: '',
    password: '',
    privacyPolicyConsent: false,
    termsOfUseConsent: false,
    errors: [],
  }

  private emailInput: Base | null = null
  private passwordInput: Base | null = null

  public static mapStateToProps(state: State): Partial<BaseSignupScreenProps> {
    return {
      result: state.navigation.signup,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<BaseSignupScreenProps> {
    return {
      async onSignup(email, password) {
        await dispatch(sessionActions.signup(email, password))
      },

      onSignin() {
        dispatch(navigationActions.navigateBack())
      },

      onViewDocument(document) {
        dispatch(navigationActions.navigateTo('LegalDocument', false, { document }))
      },
    }
  }

  render() {
    return (
      <LinearGradient
        colors={['#c23652', '#051f43']}
        // start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
        style={{ width: width, height: height }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />

          <Header color="dark" style={styles.headerContainer} noMenu>
            <RegularHeader />
          </Header>

          <ScrollView style={styles.formContainer}>
            {
              this.state.errors.map(error => (
                <Message
                  key={error}
                  id={`screens.signup.error.${error}`}
                  defaultMessage={error}
                  style={styles.errorMessage}
                />
              ))
            }
            {
              this.props.result && this.props.result._ === 'failure' &&
              Object.entries(this.props.result.error).map(([errorCode, params]) => (
                <Message
                  key={errorCode}
                  id={`screens.signup.error.${errorCode}`}
                  defaultMessage={errorCode}
                  values={params}
                  style={styles.errorMessage}
                />
              ))
            }

            <TextInput
              theRef={x => this.emailInput = x}
              type="email"
              placeholderId="screens.signup.email_placeholder"
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
              placeholderId="screens.signup.password_placeholder"
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
              textId="screens.signup.submit"
              textDefault="Sign up"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            /> */}
            <StartedButton
              textDefault="Sign up"
              textId="screens.signup.submit"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
              style={{ marginTop: 10 }}
            />

            <View style={styles.checkboxes}>
              <View style={styles.checkboxContainer}>
                <Checkbox checked={this.state.privacyPolicyConsent} onChecked={this.onToggleConsent('privacyPolicyConsent')} />

                <Message
                  id="screens.signup.privacy_policy"
                  defaultMessage="By ticking this box, you expressly consent to our {privacy_policy}"
                  values={{
                    privacy_policy: (
                      <Message
                        id="privacy_policy"
                        defaultMessage="Privacy Policy"
                        style={styles.checkboxTextUnderline}
                        onPress={() => this.props.onViewDocument(LegalDocument.PRIVACY_POLICY)}
                      />
                    ),
                  }}
                  style={styles.checkboxText}
                />
              </View>

              <View style={styles.checkboxContainer}>
                <Checkbox checked={this.state.termsOfUseConsent} onChecked={this.onToggleConsent('termsOfUseConsent')} />

                <Message
                  id="screens.signup.terms_of_uses"
                  defaultMessage="By ticking this box, you expressly consent to our {terms_of_uses}"
                  values={{
                    terms_of_uses: (
                      <Message
                        id="terms_of_uses"
                        defaultMessage="Terms of uses"
                        style={styles.checkboxTextUnderline}
                        onPress={() => this.props.onViewDocument(LegalDocument.TERMS_OF_USE)}
                      />
                    ),
                  }}
                  style={styles.checkboxText}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footerContainer}>
            <Message
              id="screens.signup.already"
              defaultMessage="Already have an account?"
              style={styles.footerText}
            />
            <Message
              id="screens.signin.signin"
              defaultMessage="Sign in"
              style={styles.footerSignin}
              onPress={this.props.onSignin}
            />
            {/* <GradientButton textDefault="Sign in" textId="screens.signup.signin"
              onPress={this.props.onSignin} /> */}
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  private onTextInputChange = (field: string) => (text: string) => {
    this.setState({ [field]: text })
  }

  private onToggleConsent = (field: string) => () => {
    this.setState({ [field]: !this.state[field] })
  }

  private onSubmitEmail = () => {
    if (this.passwordInput) {
      this.passwordInput.focus()
    }
  }

  private onSubmit = () => {
    Keyboard.dismiss()

    if (!this.state.privacyPolicyConsent) {
      return this.setState({
        errors: ['privacyPolicyConsent'],
      })
    }

    if (!this.state.termsOfUseConsent) {
      return this.setState({
        errors: ['termsOfUseConsent'],
      })
    }

    let { email, password } = this.state
    email = email.trim()
    password = password.trim()

    if (email.length <= 0) {
      return this.setState({
        errors: ['requiredEmail'],
      })
    }
    if (password.length <= 0) {
      return this.setState({
        errors: ['requiredPassword'],
      })
    }

    this.setState({ errors: [] })

    this.props.onSignup(
      this.state.email,
      this.state.password,
    )
  }
}

export default connect(BaseSignupScreen.mapStateToProps, BaseSignupScreen.mapDispatchToProps)(BaseSignupScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
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
    marginTop: 100,
  },
  input: {
    marginBottom: 15,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 30,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: '#ffffff4f'
  },
  checkboxes: {
    marginTop: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
    alignItems:'center'
  },
  checkboxText: {
    fontSize: 10,
    color: '#ffffff',
  },
  checkboxTextUnderline: {
    fontSize: 10,
    color: '#ffffff',
    textDecorationLine: 'underline',
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
  footerSignin: {
    fontSize: 13,
    color: '#ffffff',
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
})
