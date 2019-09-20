import React from 'react'
import { Alert, Keyboard, StatusBar, StyleSheet, View, Dimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { connect } from 'react-redux'
import { Button } from '../components/Button'
import { Message } from '../components/Message'
import { RegularHeader } from '../components/RegularHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import { Base, TextInput } from '../components/AuthTextInput'
import { Header } from '../containers/Header'
import { StartedButton } from '../components/StartedButton'

import { Dispatch, State } from '../store'
import * as navigationActions from '../store/navigation/actions'
import * as sessionActions from '../store/session/actions'


const { width, height } = Dimensions.get('window')

interface BaseLostPasswordScreenProps {
  result?: PromiseState<void, ErrorReasons>

  onSubmit(email: string): void

  onSignin(): void
}

class BaseLostPasswordScreen extends React.Component<BaseLostPasswordScreenProps> {
  public readonly state = {
    email: '',
  }

  private emailInput: Base | null = null

  public static mapStateToProps(state: State): Partial<BaseLostPasswordScreenProps> {
    return {
      result: state.navigation.lostPassword,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<BaseLostPasswordScreenProps> {
    return {
      async onSubmit(email) {
        await dispatch(sessionActions.lostPassword(email))
        dispatch(navigationActions.navigateBack())
        Alert.alert('You will receive an email with instructions to reset your password.')
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
          <StatusBar barStyle="dark-content" />

          <Header style={styles.headerContainer} color="dark">
            <RegularHeader />
          </Header>

          <View style={styles.formContainer}>
            {
              this.props.result && this.props.result._ === 'failure' &&
              Object.entries(this.props.result.error).map(([reasonCode, params]) => (
                <Message
                  key={reasonCode}
                  id={`screens.lost_password.error.${reasonCode}`}
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
              placeholderId="screens.lost_password.email_placeholder"
              placeholderDefault="Email"
              onSubmit={this.onSubmit}
              value={this.state.email}
              onChangeText={this.onTextInputChange('email')}
              style={styles.input}
              autoFocus
            />
            <StartedButton
              textDefault="Get Password Back"
              textId="screens.lost_password.submit"
              onPress={this.onSubmit}
              loading={this.props.result && this.props.result._ === 'loading'}
            />
            {/* <Button
            textId="screens.lost_password.submit"
            textDefault="Get Password Back"
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

  private onSubmit = () => {
    Keyboard.dismiss()

    this.props.onSubmit(this.state.email)
  }
}

export default connect(BaseLostPasswordScreen.mapStateToProps, BaseLostPasswordScreen.mapDispatchToProps)(BaseLostPasswordScreen)

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
})
