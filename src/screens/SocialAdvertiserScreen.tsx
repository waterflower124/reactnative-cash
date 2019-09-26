import React                             from 'react'
import { NavigationScreenProps }         from 'react-navigation'
import { connect }                       from 'react-redux'
import { SocialAdvertiser, UserAccount } from '../httpapi'
import { Dispatch, State }               from '../store'

import { advertisers as socialAdvertisersActions } from '../store/items/actions'
import * as Styles from '../styles'
import {
  Image,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList
}                           from 'react-native'
import Interactable from 'react-native-interactable'
import Icon from 'react-native-vector-icons/Ionicons'
import LinearGradient       from 'react-native-linear-gradient'
import { CardTransitioner } from '../components/CardTransitioner'
import { KeepSkip }         from '../components/KeepSkip'
import { Message }          from '../components/Message'
import { SafeAreaView }     from '../components/SafeAreaView'
import Text                 from '../components/Text'
import { Header }           from '../containers/Header'
import { Wrapper }          from '../containers/Wrapper'
import * as mediaquery      from '../utils/mediaquery'
import { HeaderText } from '../components/HeaderText'

const IdCardLogo = require('../../assets/IdCard.png')

interface SocialAdvertiserScreenProps extends NavigationScreenProps {
  currentAccount: UserAccount
  current: PromiseState<SocialAdvertiser>
  previous: SocialAdvertiser | null
  eof: boolean

  onLoadAdvertiser(): void

  onAccept(): void

  onDecline(): void
}

class SocialAdvertiserScreen extends React.Component<SocialAdvertiserScreenProps> {
  private transitioner: CardTransitioner<SocialAdvertiser> | null = null

  public static mapStateToProps(state: State): Partial<SocialAdvertiserScreenProps> {
    return {
      currentAccount: state.navigation.currentAccount,
      current       : state.items.advertisers.current,
      previous      : state.items.advertisers.previous,
      eof           : state.items.advertisers.eof,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<SocialAdvertiserScreenProps> {
    return {
      onLoadAdvertiser() {
        dispatch(socialAdvertisersActions.load())
      },

      onAccept() {
        dispatch(socialAdvertisersActions.requestPop(false))
      },

      onDecline() {
        dispatch(socialAdvertisersActions.requestPop(true))
      },
    }
  }

  public componentDidMount() {
    this.props.onLoadAdvertiser()
  }

  public componentWillReceiveProps(nextProps: SocialAdvertiserScreenProps) {
    if (this.props.currentAccount.id !== nextProps.currentAccount.id) {
      this.props.onLoadAdvertiser()
    }
  }

  onDrawerSnap = () => {
    console.log('onDrawerSnap')
  }

  renderItem = ({item}) => {
    return (
      <View style={{ flexDirection: 'row',  marginHorizontal: 10, marginVertical: 8, position: 'relative', justifyContent: 'space-between' }}>
      <TouchableOpacity style={[styles.swipeButton, { borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]}>
        <Icon
          name="ios-checkmark"
          style={styles.swipeIcon}
        />
      </TouchableOpacity>
    <TouchableOpacity style={[styles.swipeButton, { backgroundColor: '#c46679'}, { borderTopRightRadius: 5, borderBottomRightRadius: 5 }]}>
        <Icon
          name="ios-close"
          style={styles.swipeIcon}
        />
      </TouchableOpacity>

      <Interactable.View
      horizontalOnly={true}
      snapPoints={[{x: 0}, {x: -80}, {x: 80}]}
      onSnap={this.onDrawerSnap}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      >
      <View style={[styles.item, styles.shadow]}>
        <View style={{ height: 120, width: 80, alignItems: 'center', justifyContent: 'flex-start'}}>
        <Image
          source={{ uri: 'https://birkeland.uib.no/wp-content/themes/bcss/images/no.png' }}
          resizeMode="cover"
          style={{ height: 60, width: 60 }}
        />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[Styles.text, { fontSize: 20, marginBottom: 5, color: '#000' }]}>Sustainability</Text>
          <Text style={[Styles.text, { fontSize: 15, marginBottom: 5, color: '#000' }]}>This company have your informations</Text>
          <Text style={[Styles.text, { fontSize: 10, color: '#ccc' }]}>
            Ils disposent de vos coordonnées car vous figuez dans leur listes clients
          </Text>
        </View>
      </View>
    </Interactable.View>
    </View>
    )
  }

  renderContent = () => {
    return (
      <View style={styles.background}>
        {/* <LinearGradient colors={['#00000080', '#00000040', '#00000000']} locations={[0.2, 0.7, 1]}
                        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                        style={styles.background2}> */}
        <SafeAreaView style={{ flex: 1 }}>
          {/* <LinearGradient colors={['#364a6b', '#1e293b']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.background2} /> */}
          <View style={styles.container}>
            <Header color="dark" style={{ alignItems: 'center' }}>
            </Header>
            <HeaderText dark>
              Companies
            </HeaderText>

            <FlatList
              data={[{}, {}, {}, {}, {}, {}]}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginVertical: 30, flex: 1 }}
              renderItem={this.renderItem}
            />
          </View>

          {/* <View style={styles.actionsContainer}>
            <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline} />
          </View> */}
        </SafeAreaView>
        {/* </LinearGradient> */}
      </View>
    )
  }

  public render() {
    return (
      <Wrapper>
        <StatusBar barStyle="light-content"/>
        {/* <CardTransitioner
          ref={x => this.transitioner = x}
          current={this.props.current}
          previous={this.props.previous}
          eof={this.props.eof}
          eod={false}
          renderScene={this.renderContent}
        /> */}
        {this.renderContent()}
      </Wrapper>
    )
  }

  // private renderContent = (advertiser: SocialAdvertiser) => {
  //   return (
  //     <View style={styles.background}>
  //       <LinearGradient colors={['#00000080', '#00000040', '#00000000']} locations={[0.2, 0.7, 1]}
  //                       start={{x: 0, y: 0}} end={{x: 1, y: 1}}
  //                       style={styles.background2}>
  //         <SafeAreaView style={{
  //           flex: 1,
  //         }}>
  //           <View style={{
  //             justifyContent: 'space-evenly',
  //             alignItems    : 'center',
  //             flex          : 1,
  //             alignSelf     : 'stretch',
  //           }}>
  //             <Header style={{alignItems: 'center'}}>
  //               <Image
  //                 source={IdCardLogo}
  //                 style={{width: 100, height: 100, resizeMode: 'contain'}}
  //               />
  //             </Header>

  //             <Text allowFontScaling={false} style={{fontSize: 20, textAlign: 'center'}}>
  //               {advertiser.name}{'\n'}
  //               <Message
  //                 id="screens.social_advertiser.explain_1"
  //                 defaultMessage="This company have your informations"
  //                 style={{fontSize: 18}}
  //               />
  //             </Text>

  //             <Message
  //               id="screens.social_advertiser.explain_2"
  //               defaultMessage="Ils disposent de vos coordonnées car vous figuez dans leur listes clients"
  //               style={{fontSize: 14, width: '70%', textAlign: 'center'}}
  //             />

  //             <Image
  //               source={{uri: advertiser.image_url}}
  //               style={{
  //                 width       : 180,
  //                 height      : 180,
  //                 resizeMode  : 'contain',
  //                 borderWidth : 1,
  //                 borderColor : '#FFF',
  //                 borderRadius: 90,
  //               }}
  //             />
  //           </View>

  //           <View style={styles.actionsContainer}>
  //             <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline}/>
  //           </View>
  //         </SafeAreaView>
  //       </LinearGradient>
  //     </View>
  //   )
  // }

  private onDecline = () => {
    this.props.onDecline()
    this.transitioner.transitionLeft()
  }

  private onAccept = () => {
    this.props.onAccept()
    this.transitioner.transitionRight()
  }
}

export default connect(SocialAdvertiserScreen.mapStateToProps, SocialAdvertiserScreen.mapDispatchToProps)(SocialAdvertiserScreen)

const styles = StyleSheet.create({
  background            : {backgroundColor: '#FFF', flex: 1},
  background2           : {flex: 1},
  container             : {
    flex          : 1,
    // alignItems    : 'center',
    // justifyContent: 'space-evenly',
    marginBottom  : 60,
  },
  logo                  : {
    ...mediaquery.screen({
      sm: {width: 50, height: 50},
      md: {width: 75, height: 75},
      lg: {width: 75, height: 75},
    }),
  },
  brandName             : {
    fontSize: mediaquery.screen({
      sm: 16,
      md: 20,
      lg: 20,
    }),
  },
  userID                : {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 18,
      lg: 18,
    }),
  },
  label                 : {
    fontSize: mediaquery.screen({
      sm: 10,
      md: 16,
      lg: 16,
    }),
  },
  details               : {
    flexDirection: 'row',
    alignItems   : 'center',
  },
  detailAmount          : {
    fontSize: mediaquery.screen({
      sm: 40,
      md: 40,
      lg: 40,
    }),
    margin  : 5,
    color   : '#c43652',
  },
  detailLabel           : {
    fontSize: 18,
    color   : '#c43652',
  },
  permissionIcon        : {
    ...mediaquery.screen({
      sm: {width: 20, height: 20},
      md: {width: 40, height: 40},
      lg: {width: 40, height: 40},
    }),
  },
  permissionName        : {
    fontSize: 14,
    color   : '#041f43',
  },
  permissionDetails     : {alignItems: 'center', paddingVertical: 5},
  permissionDescription : {alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 10, marginBottom: 5},
  permissionDisabledText: {alignSelf: 'stretch', textAlign: 'center', paddingHorizontal: 10, fontSize: 8, marginBottom: 5},
  actionsContainer      : {justifyContent: 'center', alignSelf: 'stretch', marginVertical: 20},
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  item: {
    width: '100%',
    height: 120,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    zIndex: 1122,
  },
  swipeButton: {
    // height: '100%',
    width: 80,
    height: 120,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#49edd4',
  },
  swipeIcon: {
    fontSize: 50,
    color: '#FFF',
  },
})
