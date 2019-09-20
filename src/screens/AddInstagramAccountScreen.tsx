import React from 'react'
import { Keyboard, StatusBar, StyleSheet, View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import { Button } from '../components/Button'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/AuthTextInput'
import { Header } from '../containers/Header'
import { StartedButton } from '../components/StartedButton'

import { Dispatch, State } from '../store'
import * as sessionActions from '../store/session/actions'

const { width, height } = Dimensions.get('window')

interface BaseAddInstagramAccountScreenProps {
  result?: PromiseState<void, ErrorReasons>

  onCreate(email: string, password: string): void
}

class BaseAddInstagramAccountScreen extends React.Component<BaseAddInstagramAccountScreenProps> {
  public readonly state = {
    email: '',
    password: '',
  }

  private emailInput: Base | null = null
  private passwordInput: Base | null = null

  public static mapStateToProps(state: State): Partial<BaseAddInstagramAccountScreenProps> {
    return {
      result: state.navigation.addAccount,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<BaseAddInstagramAccountScreenProps> {
    return {
      async onCreate(email, password) {
        await dispatch(sessionActions.createInstagramAccount(email, password))
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

          <Header style={styles.headerContainer} color="dark" noMenu>
            <RegularHeader />
          </Header>

          <View style={styles.formContainer}>
            {
              this.props.result && this.props.result._ === 'failure' &&
              Object.entries(this.props.result.error).map(([reasonCode, params]) => (
                <Message
                  key={reasonCode}
                  id={`screens.add_instagram_account.error.${reasonCode}`}
                  defaultMessage={reasonCode}
                  values={params}
                  style={styles.errorMessage}
                />
              ))
            }

            <TextInput
              theRef={x => this.emailInput = x}
              type="email"
              placeholderId="screens.add_instagram_account.email_placeholder"
              placeholderDefault="Email"
              onSubmit={this.onSubmitEmail}
              value={this.state.email}
              onChangeText={this.onTextInputChange('email')}
              style={styles.input}
            />

            <TextInput
              theRef={x => this.passwordInput = x}
              type="password"
              placeholderId="screens.add_instagram_account.password_placeholder"
              placeholderDefault="Password"
              onSubmit={this.onSubmit}
              value={this.state.password}
              onChangeText={this.onTextInputChange('password')}
              isFinal
              style={styles.input}
            />

            <StartedButton
              textDefault="Create"
              textId="screens.add_instagram_account.submit"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            />

            {/* <Button
            textId="screens.add_instagram_account.submit"
            textDefault="Create"
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
    if (this.passwordInput) {
      this.passwordInput.focus()
    }
  }

  private onSubmit = () => {
    Keyboard.dismiss()

    this.props.onCreate(
      this.state.email,
      this.state.password,
    )
  }
}

export default connect(BaseAddInstagramAccountScreen.mapStateToProps, BaseAddInstagramAccountScreen.mapDispatchToProps)(BaseAddInstagramAccountScreen)

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
