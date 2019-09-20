import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from '../store'
import * as deviceActions from '../store/device/actions'
import * as navigationActions from '../store/navigation/actions'

import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { GradientButton } from '../components/GradientButton'
import { Message } from '../components/Message'
import { Logo } from '../components/SpecialHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import Text, { TextStyle } from '../components/Text'
import { Header } from '../containers/Header'
import { StartedButton } from '../components/StartedButton'

const Facebook = require('../../assets/icons/facebook.png')
const Instagram = require('../../assets/icons/instagram.png')
const Medium = require('../../assets/icons/medium.png')
const Gmail = require('../../assets/icons/gmail.png')


enum AccountProvider {
  Facebook,
  Instagram,
  Email,
}

interface ConfigureAccountScreenProps {
  onReady(): void

  onConfigure(selected: AccountProvider): void
}

class ConfigureAccountScreen extends React.Component<ConfigureAccountScreenProps> {
  static mapDispatchToProps(dispatch: Dispatch): Partial<ConfigureAccountScreenProps> {
    return {
      onReady() {
        // dispatch(deviceActions.configurePushNotifications())
      },

      onConfigure(selected) {
        switch (selected) { // tslint:disable-line:switch-default
          case AccountProvider.Email:
            return dispatch(navigationActions.navigateTo('AddEmailAccount'))

          case AccountProvider.Facebook:
            return dispatch(navigationActions.navigateTo('AddFacebookAccount'))

          case AccountProvider.Instagram:
            return dispatch(navigationActions.navigateTo('AddInstagramAccount'))

        }
      },
    }
  }

  public componentDidMount() {
    this.props.onReady()
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Header color="dark" style={{ alignItems: 'center' }} noMenu>
          <Logo />
        </Header>

        <Image source={Facebook} style={{marginTop:30, marginBottom:50}}/>

        <View style={{ marginTop: 10 }}>
          <View style={styles.row}>
            <Icon name="ios-checkbox" style={styles.check as TextStyle} />
            <Message
              id="screens.configure_account.help_text_1"
              defaultMessage="Control the company who use Facebook Connect"
              style={styles.helpText}
            />
          </View>
          <View style={styles.row}>
            <Icon name="ios-checkbox" style={styles.check as TextStyle} />
            <Message
              id="screens.configure_account.help_text_2"
              defaultMessage="Identify the type of data company used and block"
              style={styles.helpText}
            />
          </View>
          <View style={styles.row}>
            <Icon name="ios-checkbox" style={styles.check as TextStyle} />
            <Message
              id="screens.configure_account.help_text_3"
              defaultMessage="Controle interests defined by Facebook"
              style={styles.helpText}
            />
          </View>
          <View style={styles.row}>
            <Icon name="ios-checkbox" style={styles.check as TextStyle} />
            <Message
              id="screens.configure_account.help_text_4"
              defaultMessage="Identify the list of advertisers who use your data"
              style={styles.helpText}
            />
          </View>
          <View style={styles.row}>
            <Icon name="ios-checkbox" style={styles.check as TextStyle} />
            <Message
              id="screens.configure_account.help_text_6"
              defaultMessage="Monetize and win money"
              style={styles.helpText}
            />
          </View>
        </View>

        <StartedButton
          textDefault="Add"
          textId="screens.add_instagram_account.submit"
          onPress={this.onPress(AccountProvider.Facebook)}
          style={styles.addButton}
        />
      </SafeAreaView>
    )
  }

  private onPress = (accountProvider: AccountProvider) => () => {
    this.props.onConfigure(accountProvider)
  }
}

export default connect(null, ConfigureAccountScreen.mapDispatchToProps)(ConfigureAccountScreen)

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, alignSelf: 'stretch', alignItems: 'center', },
  logo: { width: 53, height: 53 },
  disclaimer: { alignSelf: 'stretch', textAlign: 'left', fontSize: 24, color: '#041f43', marginTop: 60, marginBottom: 20 },
  bodyContainer: { flex: 1, marginTop: 5, alignSelf: 'stretch', marginHorizontal: 45 },
  card: { borderWidth: 1, borderColor: '#041f4319', borderRadius: 5, alignSelf: 'stretch', padding: 8, marginTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom:10 },
  accountProviderText: { flex: 1, fontSize: 14, color: '#041f43', marginLeft: 10 },
  accountProviderButton: { paddingHorizontal: 13 },
  check: { color: '#c43652', fontSize: 20 },
  helpText: { fontSize: 12, color: '#041f43', marginLeft: 6 },
  moreText: { fontSize: 12, color: '#041f43', alignSelf: 'stretch', textAlign: 'center', marginTop: 20 },
  addButton: { paddingHorizontal:60, marginTop:50}
})
