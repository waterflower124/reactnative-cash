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
import Icon from 'react-native-vector-icons/FontAwesome'
import { GradientButton } from '../components/GradientButton'
import { Message } from '../components/Message'
import { Logo } from '../components/SpecialHeader'
import { SafeAreaView } from '../components/SafeAreaView'
import Text, { TextStyle } from '../components/Text'
import { Header } from '../containers/Header'
import { dispatch } from 'rxjs/internal/observable/pairs';

const Facebook = require('../../assets/icons/facebook.png')
const Instagram = require('../../assets/icons/instagram.png')
const Medium = require('../../assets/icons/medium.png')
const Gmail = require('../../assets/icons/gmail.png')


enum AccountProvider {
  Facebook,
  Instagram,
  Email,
}

interface SelectAccountScreenProps {
  onReady(): void

  onConfigure(selected: AccountProvider): void
}

class SelectAccountScreen extends React.Component<SelectAccountScreenProps> {
  static mapDispatchToProps(dispatch: Dispatch): Partial<SelectAccountScreenProps> {
    return {
      onReady() {
        // dispatch(deviceActions.configurePushNotifications())
      },

      onConfigure(selected) {
        switch (selected) { // tslint:disable-line:switch-default
          case AccountProvider.Email:
            return dispatch(navigationActions.navigateTo('AddEmailAccount'))

          case AccountProvider.Facebook:
            return dispatch(navigationActions.navigateTo('ConfigureAccount'))

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

        <Header color="dark" style={{ alignItems: 'center' }}>
          <Logo />
        </Header>

        <Message
          id="screens.configure_account.disclaimer"
          defaultMessage={`ADD AN ACCOUNT\nTO CONTROL AND GET\nTHE VALUE`}
          style={styles.disclaimer}
        />

        <TouchableOpacity onPress={this.onPress(AccountProvider.Facebook)}>
          <Image source={Facebook} />
        </TouchableOpacity>
        <View>
          <Message
            id="screens.configure_account.more_text"
            defaultMessage="More tools soon"
            style={styles.moreText}
          />
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={Instagram} />
            <Image source={Medium} style={{marginLeft:30}}/>
            <Image source={Gmail} style={{marginLeft:30}}/>
          </View>

        </View>

        {/* <ScrollView style={styles.bodyContainer}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={Facebook} />
              <Text style={styles.accountProviderText}>Facebook</Text>
              <GradientButton textDefault="ADD" textId="screens.configure_account.add_button"
                size="small" style={styles.accountProviderButton}
                onPress={this.onPress(AccountProvider.Facebook)} />
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={styles.row}>
                <Icon name="check" style={styles.check as TextStyle} />
                <Message
                  id="screens.configure_account.help_text_1"
                  defaultMessage="Control the company who use Facebook Connect"
                  style={styles.helpText}
                />
              </View>
              <View style={styles.row}>
                <Icon name="check" style={styles.check as TextStyle} />
                <Message
                  id="screens.configure_account.help_text_2"
                  defaultMessage="Identify the type of data company used and block"
                  style={styles.helpText}
                />
              </View>
              <View style={styles.row}>
                <Icon name="check" style={styles.check as TextStyle} />
                <Message
                  id="screens.configure_account.help_text_3"
                  defaultMessage="Controle interests defined by Facebook"
                  style={styles.helpText}
                />
              </View>
              <View style={styles.row}>
                <Icon name="check" style={styles.check as TextStyle} />
                <Message
                  id="screens.configure_account.help_text_4"
                  defaultMessage="Identify the list of advertisers who use your data"
                  style={styles.helpText}
                />
              </View>
              <View style={styles.row}>
                <Icon name="check" style={styles.check as TextStyle} />
                <Message
                  id="screens.configure_account.help_text_6"
                  defaultMessage="Monetize and win money"
                  style={styles.helpText}
                />
              </View>
            </View>
          </View>
          <Message
            id="screens.configure_account.more_text"
            defaultMessage="More tools soon"
            style={styles.moreText}
          />
        </ScrollView> */}
      </SafeAreaView>
    )
  }

  private onPress = (accountProvider: AccountProvider) => () => {
    this.props.onConfigure(accountProvider)
  }
}

export default connect(null, SelectAccountScreen.mapDispatchToProps)(SelectAccountScreen)

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1, alignSelf: 'stretch', alignItems: 'center',  },
  logo: { width: 53, height: 53 },
  disclaimer: { alignSelf: 'stretch', textAlign: 'left', fontSize: 24, color: '#041f43', marginTop: 60, marginBottom:20, marginHorizontal:30 },  
  moreText: { fontSize: 13, color: '#041f43', alignSelf: 'stretch', textAlign: 'center', marginBottom: 20, marginTop:50 },
})
