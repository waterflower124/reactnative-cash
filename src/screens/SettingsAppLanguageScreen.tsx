import React from 'react'

import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import RNRestart from 'react-native-restart'
import { NavigationScreenProps } from 'react-navigation'
import { connect }               from 'react-redux'
import { Background }   from '../components/Background'
import { Message }      from '../components/Message'
import { SafeAreaView } from '../components/SafeAreaView'
import { Header }       from '../containers/Header'
import { Wrapper }      from '../containers/Wrapper'
import { Dispatch }              from '../store'
import * as sessionActions from '../store/session/actions'
import {
  availableLanguages,
  getCurrentLanguage,
  Language,
  persistLanguage,
}                                from '../translate'
import { sleep }                 from '../utils'

interface SettingsAccountScreenProps extends NavigationScreenProps {
  onChangeLanguage(language: Language): void
}

interface SettingsAppLanguageState {
  loading: boolean
  selectingLanguage: boolean
}

class SettingsAccountScreen extends React.Component<SettingsAccountScreenProps, SettingsAppLanguageState> {
  public readonly state: SettingsAppLanguageState = {
    loading: false,
    selectingLanguage: false,
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<SettingsAccountScreenProps> {
    return {
      async onChangeLanguage(language) {
        await Promise.all([
          dispatch(sessionActions.patchLanguage(language)),
          persistLanguage(language),
        ])
        await sleep(750)
        RNRestart.Restart()
      },
    }
  }

  public render() {
    return (
      <Wrapper>
        <Background>
          <SafeAreaView>
            <Header containerStyle={{marginTop: 10}} style={{alignItems: 'center'}}>
              <Message
                id="screens.configure_app.settings_app_language"
                defaultMessage="Languages"
              />
            </Header>

            <View style={{flex: 1}}>
              {this.renderModal()}

              <View style={styles.container}>
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Message
                      id="screens.settings_app_language.select"
                      defaultMessage="Langue application :"
                      style={styles.rowLeftText}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.rowRight}
                    onPress={() => {
                      this.setState({
                        selectingLanguage: true,
                      })
                    }}
                  >
                    <Message
                      style={styles.rowRightText}
                      id={`languages.${getCurrentLanguage()}`}
                      defaultMessage={`languages.${getCurrentLanguage()}`}
                    />

                    <Image
                      source={require('../../assets/icons/pencil.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Background>
      </Wrapper>
    )
  }

  public renderModal() {
    const languages = availableLanguages.map((language, index) => {
      const borderBottom = index !== availableLanguages.length - 1
        ? {borderBottomWidth: 1, borderColor: 'gray'}
        : null

      return (
        <TouchableOpacity
          style={[styles.modalLanguageItem, borderBottom]}
          key={language}
          onPress={async () => {
            this.setState({loading: true})
            await this.props.onChangeLanguage(language)
            this.setState({selectingLanguage: false})
          }}
        >
          <Message
            style={styles.modalLanguageText}
            id={`languages.${language}`}
            defaultMessage={`languages.${language}`}
          />
        </TouchableOpacity>
      )
    })

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.selectingLanguage || this.state.loading}
        onRequestClose={() => {
          console.log('close')
        }}
      >
        {this.state.loading ? <ActivityIndicator/> : (
          // if !loading
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => {
              this.setState({
                selectingLanguage: false,
              })
            }}
          >
            <View style={styles.modalLanguageList}>
              {languages}
            </View>
          </TouchableOpacity>
        )}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: '10%',
  },

  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  modalLanguageList: {
    width: '50%',
    backgroundColor: 'white',
    padding: 10,
  },

  modalLanguageItem: {
    paddingVertical: 10,
  },

  modalLanguageText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '300',
  },

  row: {
    flexDirection: 'row',
  },

  rowLeft: {
    flex: 1,
    justifyContent: 'center',
  },

  rowLeftText: {
    fontSize: 14,
  },

  rowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },

  rowRightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '300',
  },
})

export default connect(null, SettingsAccountScreen.mapDispatchToProps)(SettingsAccountScreen)
