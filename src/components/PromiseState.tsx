import React from 'react'

import { ActivityIndicator, ImageBackground, Platform, StyleSheet, View } from 'react-native'
import { Message }                                            from '../components/Message'
import Text                                                   from './Text'

export const mediumFont: string = Platform.select({
  ios    : 'Montserrat-Medium',
  android: 'montserrat_medium',
})

const logoDark = require('../../assets/GJLogo.png')
const ClapHand = require('../../assets/ClapsHands.png')
const Alertbutton = require('../../assets/AlertButton.png')

export function Loading() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator
        size="large"
        color="#FFFFFF"
      />
    </View>
  )
}

interface FailureProps {
  error: Error
}

export function Failure(props: FailureProps) {
  const error = props.error
  const failureName = error.name === 'HttpError' ? `HttpError ${(error as any).status}` : error.name
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
      <Text style={{fontSize: 18}} allowFontScaling={false}>Failure ({failureName})</Text>
      <Text style={{fontSize: 14}} allowFontScaling={false}>{error.message}</Text>
    </View>
  )
}

export function EndOfData() {
  return (
    <View style={{flex: 1, top: -30, marginHorizontal: 40}}>
      <View style={{alignSelf: 'center', marginBottom: 60}}>
        <ImageBackground source={logoDark} style={styles.logo} />
      </View>
      <View style={{ alignSelf: 'center', marginBottom: 10}}>
        <ImageBackground source={ClapHand} style={{width: 100, height: 100}} />
      </View>
      <Message
        id="screens.good_job.text1"
        defaultMessage="Congrats"
        style={styles.message1}
      />
      <Message
        id="screens.good_job.text2"
        defaultMessage="Congrats"
        style={styles.message2}
      />
      <Message
        id="screens.good_job.text3"
        defaultMessage="Congrats"
        style={[styles.message3, { marginBottom: 110 }]}
      />
      <Message
        id="screens.good_job.text4"
        defaultMessage="Congrats"
        style={styles.message4}
      />

    </View>
  )
}
// TODO: If this function isn't used, please remove it !
export function EndOfDeals() {
  return (
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center', top: -30, marginBottom: 60, marginHorizontal: 45}}>
        <ImageBackground source={logoDark} style={styles.logo} />
      </View>
      <Message
        id="screens.good_job.deal1"
        defaultMessage="Congrats"
        style={[styles.message3, { marginTop: 40 }]}
      />
      <Message
        id="screens.good_job.deal2"
        defaultMessage="Congrats"
        style={styles.message2b}
      />
      <Message
        id="screens.good_job.deal3"
        defaultMessage="Congrats"
        style={[styles.message4, {marginTop: 50, marginHorizontal: 30}]}
      />

    </View>

  )
}

const styles = StyleSheet.create({
  message1: {
    fontSize: 24,
    fontFamily: mediumFont,
    alignSelf: 'center',
  },

  message2: {
    fontSize: 20,
    fontFamily: mediumFont,
    alignSelf: 'center',
  },

  message3: {
    fontSize: 20,
    fontFamily: mediumFont,
    textAlign: 'center',
  },

  message4: {
    fontSize: 12,
    fontFamily: mediumFont,
    textAlign: 'center',
  },

  message5: {
    fontSize: 10,
    fontFamily: mediumFont,
    alignSelf: 'center',
  },

  message2b: {
    fontSize: 16,
    fontFamily: mediumFont,
    textAlign: 'center',
    marginVertical: 20,
    marginRight: 10,
    marginLeft: 10,
  },

  logo: {
    width: 80,
    height: 80,
  },

  button: {
    width: 350,
    height: 100,
  },
})
