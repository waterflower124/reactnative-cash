import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { SocialApp, SocialAppPermission, UserAccount } from '../httpapi'
import { Dispatch, State } from '../store'

import * as itemsActions from '../store/items/actions'

import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  Platform
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-snap-carousel'
import { CardTransitioner } from '../components/CardTransitioner'
import { KeepSkip } from '../components/KeepSkip'
import { Message } from '../components/Message'
import { SafeAreaView } from '../components/SafeAreaView'
import Switch from '../components/Switch'
import Text from '../components/Text'
import { Header } from '../containers/Header'
import { Wrapper } from '../containers/Wrapper'
import * as mediaquery from '../utils/mediaquery'
import { HeaderText } from '../components/HeaderText';
import TabPadding from '../components/TabPadding';

interface Permissions {
  [permissionName: string]: boolean
}

interface SocialAppScreenProps extends NavigationScreenProps {
  currentAccount: UserAccount
  previous: SocialApp | null
  current: PromiseState<SocialApp>
  eof: boolean

  onFetchSocialApp(): void

  onAccept(permissions: Permissions): void

  onDecline(): void
}

interface SocialAppScreenState {
  permissions: Permissions,
  
}

class SocialAppScreen extends React.Component<SocialAppScreenProps, SocialAppScreenState> {

  public readonly state: SocialAppScreenState = {
    permissions: {},
  }

  private transitioner: CardTransitioner<SocialApp> | null = null

  public static mapStateToProps(state: State): Partial<SocialAppScreenProps> {
    return {
      currentAccount: state.navigation.currentAccount,
      previous: state.items.apps.previous,
      current: state.items.apps.current,
      eof: state.items.apps.eof,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<SocialAppScreenProps> {
    return {
      onFetchSocialApp() {
        dispatch(itemsActions.apps.load())
      },

      async onAccept(permissions) {
        await dispatch(itemsActions.updatePermissions(permissions))
        await dispatch(itemsActions.apps.requestPop(false))
      },

      onDecline() {
        dispatch(itemsActions.apps.requestPop(true))
      },
    }
  }

  public componentDidMount() {
    this.props.onFetchSocialApp()
  }

  public componentWillReceiveProps(nextProps: SocialAppScreenProps) {
    if (this.props.currentAccount.id !== nextProps.currentAccount.id) {
      this.props.onFetchSocialApp()
    }

    if (nextProps.current._ === 'success') {
      const app = nextProps.current.item
      this.setState({
        permissions: app.permissions.reduce((acc, x) => {
          acc[x.name] = !x.disabled
          return acc
        }, {}),
      })
    }
  }

  public render() {
    return (
      <Wrapper>
        <StatusBar barStyle="light-content" />
        <CardTransitioner
          ref={x => this.transitioner = x}
          previous={this.props.previous}
          current={this.props.current}
          eof={this.props.eof}
          eod={false}
          renderScene={this.renderContent}
        />
      </Wrapper>
    )
  }

  private renderContent = (socialApp: SocialApp) => {
    return (
      <View style={styles.background}>
        {/* <LinearGradient colors={['#00000080', '#00000040', '#00000000']} locations={[0.2, 0.7, 1]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        style={styles.background2}> */}
        <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient colors={['#364a6b', '#1e293b']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.background2} />
          <View style={styles.container}>
            <Header style={{ alignItems: 'center' }}>
            </Header>
            <HeaderText>
              Application
            </HeaderText>
            <View style={[{
              // flexDirection: 'row', left:40, position:'absolute',
              // ...mediaquery.screen({
              //   sm: { top: Dimensions.get('window').height * 0.4 - 80 },
              //   md: { top: Dimensions.get('window').height * 0.4 - 95  },
              //   lg: { top: Dimensions.get('window').height * 0.4 - 145},
              // })},
              flexDirection: 'row', marginLeft: 30},
              Platform.OS == "ios" ? {...mediaquery.screen({
                sm: { marginTop: Dimensions.get('window').height * 0.4 - 156.5 },
                md: { marginTop: Dimensions.get('window').height * 0.4 - 181.5 },
                lg: { marginTop: Dimensions.get('window').height * 0.4 - 230.5 },
              }),
              } : {
                ...mediaquery.screen({
                  sm: { marginTop: Dimensions.get('window').height * 0.4 - 121 },
                  md: { marginTop: Dimensions.get('window').height * 0.4 - 156 },
                  lg: { marginTop: Dimensions.get('window').height * 0.4 - 195 },
              })}
            ]}>
              <Image
                source={{ uri: socialApp.logo_url }}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={{ marginLeft: 20, }}>
                <View style={{
                  ...mediaquery.screen({
                    sm: { height: 50, },
                    md: { height: 65, },
                    lg: { height: 65, },
                  }),
                  justifyContent: 'space-evenly'
                }}>
                  <Text allowFontScaling={false} style={styles.brandName}>
                    {socialApp.name}
                  </Text>
                  <Message
                    id="screens.social_app.show_user_id"
                    defaultMessage="User ID : {vendor_uid}"
                    values={{ vendor_uid: socialApp.vendor_uid }}
                    style={styles.userID}
                  />
                </View>
                <View style={{
                  ...mediaquery.screen({
                    sm: { height: 50, },
                    md: { height: 65, },
                    lg: { height: 65, },
                  }),
                  justifyContent: 'space-evenly'
                }}>
                  <Message
                    id="screens.social_app.explain"
                    defaultMessage="This application access to :"
                    style={styles.label}
                  />

                  <View style={styles.details}>
                    <Text allowFontScaling={false} style={styles.detailAmount}>{socialApp.permissions.length.toString()}</Text>
                    <Message
                      id="screens.social_app.label_authorizations"
                      defaultMessage="authorizations"
                      style={styles.detailLabel}
                    />
                  </View>
                </View>
              </View>
            </View>

            <FlatList
              data={socialApp.permissions}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginVertical: 30, }}
              renderItem={({ item }: { item: SocialAppPermission }) => (
                <SocialAppPermissionComponent
                  key={item.name}
                  permission={item}
                  enabled={this.state.permissions[item.name]}
                  onToggle={this.onToggle(item)}
                />
              )}
            />
          </View>

          <View style={styles.actionsContainer}>
            <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline} />
          </View>
          <TabPadding />
        </SafeAreaView>
        {/* </LinearGradient> */}
      </View>
    )
  }

  private onDecline = () => {
    this.props.onDecline()
    this.transitioner.transitionLeft()
  }

  private onAccept = () => {
    this.props.onAccept(this.state.permissions)
    this.transitioner.transitionRight()
  }

  private onToggle = (permission: SocialAppPermission) => (enabled: boolean) => {
    this.setState({
      permissions: {
        ...this.state.permissions,
        [permission.name]: enabled,
      },
    })
  }
}

interface SocialAppPermissionComponentProps {
  permission: SocialAppPermission
  enabled: boolean

  onToggle(enabled: boolean): void
}

class SocialAppPermissionComponent extends React.Component<SocialAppPermissionComponentProps> {
  public render() {
    return (
      <View style={{ borderBottomWidth: 1, borderColor: '#f8f8f8', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: Dimensions.get('window').width, paddingHorizontal: 30, paddingVertical: 20 }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={this.iconSource}
            style={styles.permissionIcon}
          />
          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            <Message
              id={`screens.social_app.permissions.${this.props.permission.name}`}
              defaultMessage={this.props.permission.name}
              style={styles.permissionName}
            />

            <Text allowFontScaling={false} style={styles.permissionDescription} numberOfLines={3}>
              {this.props.permission.description}
            </Text>

            {
              this.props.permission.required &&
              <Message
                id="screens.social_app.required_permission"
                defaultMessage="Cette autorisation ne peut être désactivée"
                style={styles.permissionDisabledText}
              />
            }
          </View>
        </View>

        <Switch
          value={this.props.enabled}
          disabled={this.props.permission.required}
          onValueChange={this.props.onToggle}
          colors={{ on: '#49edd4', off: '#c46679' }}
        />
      </View>
    )
  }

  private get iconSource(): ImageSourcePropType {
    switch (this.props.permission.name) {
      // TODO: complete the list
      case 'Name and profile picture':
        return require('../../assets/icons/permissions/Public_Profile.png')

      case 'Friends list':
        return require('../../assets/icons/permissions/user_friends.png')

      case 'Email address':
        return require('../../assets/icons/permissions/email.png')

      case 'Birthday':
        return require('../../assets/icons/permissions/user_birthday.png')

      case 'user_education_history':
        return require('../../assets/icons/permissions/user_education_history.png')

      case 'user_hometown':
        return require('../../assets/icons/permissions/user_hometown.png')

      case 'Current city':
        return require('../../assets/icons/permissions/user_location.png')

      case 'Page likes':
        return require('../../assets/icons/permissions/user_likes.png')

      case 'notifications':
        return require('../../assets/icons/permissions/user_events.png')

      default:
        return require('../../assets/icons/permissions/Public_Profile.png')
    }
  }
}

export default connect(SocialAppScreen.mapStateToProps, SocialAppScreen.mapDispatchToProps)(SocialAppScreen)

const styles = StyleSheet.create({
  background: { backgroundColor: '#ffffff', flex: 1 },
  background2: { width: '100%', height: '40%', position: 'absolute', left: 0, top: 0 },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    // justifyContent: 'space-evenly',
  },
  logo: {
    ...mediaquery.screen({
      sm: { width: 100, height: 100, borderRadius: 50 },
      md: { width: 130, height: 130, borderRadius: 65 },
      lg: { width: 130, height: 130, borderRadius: 65 },
    }),
  },
  brandName: {
    fontSize: mediaquery.screen({
      sm: 20,
      md: 25,
      lg: 25,
    }),
  },
  userID: {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 12,
      lg: 12,
    }),
  },
  label: {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 12,
      lg: 12,
    }),
    color: '#000000A0'
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailAmount: {
    fontSize: mediaquery.screen({
      sm: 25,
      md: 25,
      lg: 25,
    }),
    color: '#000000',
    marginRight: 5
  },
  detailLabel: {
    fontSize: 12,
    color: '#000000',
    alignSelf: 'flex-end',
    marginBottom: 5
  },
  permissionIcon: {
    ...mediaquery.screen({
      sm: { width: 20, height: 20 },
      md: { width: 40, height: 40 },
      lg: { width: 40, height: 40 },
    }),
    resizeMode: 'contain',
    backgroundColor: '#041f43',
    padding: 3,
    marginRight: 10
  },
  permissionName: {
    fontSize: 16,
    color: '#000000',
  },
  permissionDetails: { alignItems: 'center', paddingVertical: 5, flex: 1 },
  permissionDescription: { alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 10, marginBottom: 5 },
  permissionDisabledText: { alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 8, marginBottom: 5 },
  actionsContainer: { justifyContent: 'center', alignSelf: 'stretch', marginVertical: 20 },
})
