import React                          from 'react'
import { NavigationScreenProps }      from 'react-navigation'
import { connect }                    from 'react-redux'
import { SocialPicture, UserAccount } from '../httpapi'
import { Dispatch, State }            from '../store'

import * as items from '../store/items/actions'

import {
  Image,
  StyleSheet,
  View,
}                           from 'react-native'
import { CardTransitioner } from '../components/CardTransitioner'
import { ImageOverlay }     from '../components/ImageOverlay'
import { KeepSkip }         from '../components/KeepSkip'
import { Message }          from '../components/Message'
import { SafeAreaView }     from '../components/SafeAreaView'
import Text                 from '../components/Text'
import { Header }           from '../containers/Header'
import { Wrapper }          from '../containers/Wrapper'
import * as mediaquery      from '../utils/mediaquery'

const ChevronUp = require('../../assets/icons/chevronUp.png')
const Users     = require('../../assets/icons/users.png')
const Comment   = require('../../assets/icons/comment.png')

interface SocialPictureScreenProps extends NavigationScreenProps {
  currentAccount: UserAccount
  previous: SocialPicture | null
  current: PromiseState<SocialPicture>
  eof: boolean

  onLoadPicture(): void

  onAccept(): void

  onDecline(): void
}

class SocialPictureScreen extends React.Component<SocialPictureScreenProps> {
  private transitioner: CardTransitioner<SocialPicture> | null = null

  public static mapStateToProps(state: State): Partial<SocialPictureScreenProps> {
    return {
      currentAccount: state.navigation.currentAccount,
      current       : state.items.pictures.current,
      eof           : state.items.pictures.eof,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<SocialPictureScreenProps> {
    return {
      onLoadPicture() {
        dispatch(items.pictures.load())
      },

      onAccept() {
        dispatch(items.pictures.requestPop(false))
      },

      async onDecline() {
        await dispatch(items.saveCurrentPhoto())
        await dispatch(items.pictures.requestPop(true))
      },
    }
  }

  public componentDidMount() {
    this.props.onLoadPicture()
  }

  public componentWillReceiveProps(nextProps: SocialPictureScreenProps) {
    if (this.props.currentAccount.id !== nextProps.currentAccount.id) {
      this.props.onLoadPicture()
    }
  }

  public render() {
    return (
      <Wrapper>
        <CardTransitioner
          ref={x => this.transitioner = x}
          current={this.props.current}
          previous={this.props.previous}
          eof={this.props.eof}
          eod={false}
          renderScene={this.renderContent}
        />
      </Wrapper>
    )
  }

  private renderContent = (picture: SocialPicture) => {
    const tagged = this.getTaggedText(picture)
    return (
      <ImageOverlay
        imageProps={{source: {uri: picture.url}}}
        label={picture.visibility}

        renderContent={responder => (
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'space-between'}}>
              <View style={styles.headerContainer}>
                <Header style={{alignItems: 'center'}}>
                  <Image
                    source={{uri: picture.creator_avatar_url}}
                    style={styles.headerLogo}
                  />
                </Header>

                <Text allowFontScaling={false} allowFontScaling={false} style={{fontSize: 20}}>{picture.creator}</Text>
                {
                  tagged !== null &&
                  <Text style={{fontSize: 18}}>with {tagged}</Text>
                }
                <Text allowFontScaling={false} style={{fontSize: 12}}>{picture.date}</Text>
                <Text allowFontScaling={false} style={{fontSize: 12}}>
                  <Image source={Users}/>{' '}
                  {picture.visibility}
                </Text>
              </View>

              <View style={styles.swipeUpContainer} {...responder.panHandlers}>
                <Image source={ChevronUp}/>
                <Message
                  id="screens.social_picture.swipe_up"
                  defaultMessage="swipe up to see photo"
                  style={styles.swipeUpText}
                />
              </View>

              <View style={{
                backgroundColor: '#FFFFFFBA',
                padding: 10,
              }}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
                  <Message
                    id="screens.social_picture.good_to_know"
                    defaultMessage="GOOD TO KNOW"
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#c43652',
                      marginRight: 10,
                    }}
                  />

                  <Image source={Comment}/>
                </View>

                <Message
                  id={picture.owning ? 'screens.social_picture.help_owning' : 'screens.social_picture.help_related'}
                  defaultMessage={picture.owning ? HELP_OWNING : HELP_RELATED}
                  values={{creator: picture.creator}}
                  style={{
                    fontSize: 12,
                    color: '#041f43',
                  }}
                />
              </View>
            </View>

            <KeepSkip onAccept={this.onAccept} onDecline={this.onDecline}
                      style={{marginVertical: 20}}/>
          </SafeAreaView>
        )}
      />
    )
  }

  private getTaggedText(picture: SocialPicture): string | null {
    const tagged = picture.tagged
      .filter(x => x)
      .map(x => x.trim())
      .filter(x => x.length > 0)

    if (tagged.length <= 0) {
      return null
    }
    if (tagged.length === 1) {
      return tagged[0]
    }
    return tagged.slice(0, tagged.length - 1).join(', ') + ' and ' + tagged[tagged.length - 1]
  }

  private onDecline = () => {
    this.props.onDecline()
    this.transitioner.transitionLeft()
  }

  private onAccept = () => {
    this.props.onAccept()
    this.transitioner.transitionRight()
  }
}

export default connect(SocialPictureScreen.mapStateToProps, SocialPictureScreen.mapDispatchToProps)(SocialPictureScreen)

const styles = StyleSheet.create({
  headerContainer : {alignItems: 'center'},
  headerLogo      : {
    borderWidth: 1,
    borderColor: '#FFF',
    ...mediaquery.screen({
      sm: {width: 96, height: 96, borderRadius: 48},
      md: {width: 112, height: 112, borderRadius: 56},
      lg: {width: 112, height: 112, borderRadius: 56},
    }),
  },
  headerTextBrand : {fontSize: 20},
  headerTextFrom  : {fontSize: 18},
  swipeUpContainer: {alignItems: 'center', justifyContent: 'center', flexGrow: 1},
  swipeUpText     : {fontSize: 14},
  details         : {
    flexDirection   : 'row',
    alignSelf       : 'stretch',
    marginHorizontal: 15,
  },
  detailContainer : {
    flex           : 1,
    borderWidth    : 1,
    borderColor    : '#FFF',
    borderRadius   : 5,
    alignItems     : 'center',
    paddingVertical: 20,
    margin         : 5,
  },
  detailTextAmount: {
    fontSize: mediaquery.screen({
      sm: 24,
      md: 30,
      lg: 30,
    }),
  },
  detailText1     : {
    fontSize: mediaquery.screen({
      sm: 14,
      md: 20,
      lg: 20,
    }),
  },
  detailText2     : {
    fontSize: mediaquery.screen({
      sm: 12,
      md: 18,
      lg: 18,
    }),
  },
})

const HELP_OWNING = `- Vous avez publié cette photo

- Si vous supprimez la photo, cette photo sera plus sur Facebook

- Si vous supprimez la photo, Skeep vous permet d'automatiquement de récupérer cette photo dans les photos de votre téléphone.`

const HELP_RELATED = `- {creator} a publié cette photo

- Si vous supprimez la photo, cette photo sera toujours dans les photo de {creator}, mais vous n'apparaitrez plus dessus.

- Si vous supprimez la photo, Skeep vous permet d'automatiquement de récupérer cette photo dans les photos de votre téléphone. `
