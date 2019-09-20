import React from 'react'
import { Alert, Keyboard, StatusBar, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { Button } from '../components/Button'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/TextInput'
import { Header } from '../containers/Header'
import { Dispatch, State } from '../store'
import * as sessionActions from '../store/session/actions'

interface BasePasswordRecoveryScreenProps {
  first_name?: string
  result?: PromiseState<void, ErrorReasons>

  onSubmit(password: string): void

  onSignin(): void
}

class BasePasswordRecoveryScreen extends React.Component<BasePasswordRecoveryScreenProps> {
  public readonly state = {
    password: '',
  }

  private emailInput: Base | null = null

  public static mapStateToProps(state: State): Partial<BasePasswordRecoveryScreenProps> {
    return {
      first_name: state.session.user!.first_name,
      result: state.navigation.recoverPassword,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<BasePasswordRecoveryScreenProps> {
    return {
      async onSubmit(password) {
        await dispatch(sessionActions.recoverPassword(password))
        await dispatch(sessionActions.whenLoggedIn())
        Alert.alert('Your password has been reset!', 'You are now signed in.')
      },
    }
  }

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content"/>

        <Header style={styles.headerContainer} color="dark">
          <RegularHeader/>
        </Header>

        <View style={styles.formContainer}>
          {this.renderHelp()}

          <TextInput
            theRef={x => this.emailInput = x}
            type="password"
            placeholderId="screens.password_recovery.password_placeholder"
            placeholderDefault="New Password"
            onSubmit={this.onSubmit}
            value={this.state.password}
            onChangeText={this.onTextInputChange('password')}
            style={styles.input}
            autoFocus
          />

          <Button
            textId="screens.password_recovery.submit"
            textDefault="Reset Your Password"
            onPress={this.onSubmit}
            loading={this.props.result && this.props.result._ === 'loading'}
          />
        </View>
      </SafeAreaView>
    )
  }

  private renderHelp() {
    if (this.props.result && this.props.result._ === 'failure') {
      return Object.entries(this.props.result.error).map(([reasonCode, params]) => (
        <Message
          key={reasonCode}
          id={`screens.password_recovery.error.${reasonCode}`}
          defaultMessage={reasonCode}
          values={params}
          style={styles.errorMessage}
        />
      ))
    }

    if (this.props.first_name) {
      return (
        <Message
          id="screens.password_recovery.personalized_message"
          defaultMessage="Hello {first_name}! You are about to recover your account, last step is to assign a new password right here:"
          values={{first_name: this.props.first_name}}
          style={styles.message}
        />
      )
    }

    return (
      <Message
        id="screens.password_recovery.message"
        defaultMessage="Enter a new password"
        style={styles.message}
      />
    )
  }

  private onTextInputChange = (field: string) => (text: string) => {
    this.setState({[field]: text})
  }

  private onSubmit = () => {
    Keyboard.dismiss()

    this.props.onSubmit(this.state.password)
  }
}

export default connect(BasePasswordRecoveryScreen.mapStateToProps, BasePasswordRecoveryScreen.mapDispatchToProps)(BasePasswordRecoveryScreen)

const styles = StyleSheet.create({
  container      : {
    flex           : 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignSelf : 'stretch',
    alignItems: 'center',
  },
  headerText     : {
    borderWidth    : 1,
    borderColor    : '#041f43',
    color          : '#041f43',
    borderRadius   : 5,
    fontSize       : 12,
    marginTop      : 10,
    paddingVertical: 5,
    width          : 120,
    textAlign      : 'center',
  },
  formContainer  : {
    flex             : 1,
    paddingHorizontal: 50,
    marginTop        : 60,
  },
  message        : {
    color       : '#041f43',
    marginBottom: 30,
    alignSelf   : 'stretch',
    textAlign   : 'center',
  },
  errorMessage   : {
    color       : 'red',
    marginBottom: 30,
    alignSelf   : 'stretch',
    textAlign   : 'center',
  },
  input          : {
    marginBottom: 30,
  },
})
