import moment                    from 'moment'
import React                     from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect }               from 'react-redux'

import { ScrollView, StyleSheet, View } from 'react-native'
import { Background }                   from '../components/Background'
import { Link }                         from '../components/Link'
import { Message }                      from '../components/Message'
import { SafeAreaView }                 from '../components/SafeAreaView'
import Text                             from '../components/Text'
import { Header }                       from '../containers/Header'
import { Wrapper }                      from '../containers/Wrapper'
import { User, UserAccount }            from '../httpapi'
import { State }                        from '../store'

interface SettingsAccountScreenProps extends NavigationScreenProps {
  user: User
  accounts: Array<UserAccount>
}

class SettingsAccountScreen extends React.Component<SettingsAccountScreenProps> {
  public static mapStateToProps(state: State): Partial<SettingsAccountScreenProps> {
    return {
      user: state.session.user,
      accounts: state.session.accounts,
    }
  }

  public render() {
    return (
      <Wrapper>
        <Background>
          <SafeAreaView>
            <Header containerStyle={{marginTop: 10}} style={{alignItems: 'center'}}>
              <Message
                id="screens.configure_app.settings_account"
                defaultMessage="My Account"
              />
            </Header>

            <ScrollView alwaysBounceVertical={false}>
              <View style={styles.container}>
                <View style={styles.row}>
                  <View style={styles.left}>
                    <Message
                      id="screens.settings_account.account_id"
                      defaultMessage="ID Skeep :"
                      style={styles.leftText}
                    />
                  </View>

                  <View style={styles.right}>
                    <Text allowFontScaling={false} style={styles.rightText}>{this.props.user.id.toString()}</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.left}>
                    <Message
                      id="screens.settings_account.accounts"
                      defaultMessage="Comptes associés :"
                      style={styles.leftText}
                    />
                  </View>

                  <View style={styles.right}>
                    <Text allowFontScaling={false} style={styles.rightText}>
                      {
                        this.props.accounts.map(account => account.email).join('\n')
                      }
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.left}>
                    <Message
                      id="screens.settings_account.account_created_at"
                      defaultMessage="Inscrit le :"
                      style={styles.leftText}
                    />
                  </View>

                  <View style={styles.right}>
                    <Text allowFontScaling={false} style={styles.rightText}>
                      {moment(this.props.user.created_at).format('LL')}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.left}>
                    <Message
                      id="screens.settings_account.contact_email"
                      defaultMessage="Email de contact :"
                      style={styles.leftText}
                    />
                  </View>

                  <View style={styles.right}>
                    <Message
                      id="screens.settings_account.contact_email_description"
                      defaultMessage="{email} (utilisée pour la 1ère connexion)"
                      values={{
                        email: (
                          <Text allowFontScaling={false} style={styles.rightText}>
                            {this.props.user.email}
                          </Text>
                        ),
                      }}
                      style={[styles.rightText, {fontSize: 10}]}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.left}>
                    <Message
                      id="screens.settings_account.skeep_assistant"
                      defaultMessage="Assistant Skeep :"
                      style={styles.leftText}
                    />
                  </View>

                  <View style={styles.right}>
                    <Link href="mailto:contact@skeep.co"
                          style={styles.rightText}>contact@skeep.co</Link>
                    <Link href="https://twitter.com/Skeep_FR" style={styles.rightText}
                          prefix="@">Skeep_FR</Link>
                    <Link href="https://twitter.com/Skeep_CO" style={styles.rightText}
                          prefix="@">Skeep_CO</Link>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Background>
      </Wrapper>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: '10%',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  left: {
    flex: 1,
    marginRight: 10,
  },

  leftText: {
    fontSize: 12,
  },

  right: {
    flex: 1.7,
  },

  rightText: {
    fontSize: 12,
  },
})

export default connect(SettingsAccountScreen.mapStateToProps)(SettingsAccountScreen)
