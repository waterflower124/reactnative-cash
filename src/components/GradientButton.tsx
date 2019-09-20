import React from 'react'
import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Message }    from './Message'

export function GradientButton(props: Props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style} activeOpacity={0.6}>
      <LinearGradient colors={['#ff8e61', '#c43652']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={[styles.buttonGradient, props.style]}>
        {
          props.loading &&
          <ActivityIndicator color="#FFFFFF" size="small"/>
        }

        <Message
          id={props.textId}
          defaultMessage={props.textDefault}
          style={
            props.size === 'small' ? styles.buttonTextSmall :
              props.size === 'big' ? styles.buttonTextBig :
                styles.buttonTextRegular
          }
        />
      </LinearGradient>
    </TouchableOpacity>
  )
}

type Size = 'small' | 'regular' | 'big'

interface Props {
  textId: string
  textDefault: string
  style?: StyleProp<ViewStyle>
  size?: Size
  loading?: boolean

  onPress?(): void
}

const styles = StyleSheet.create({
  buttonGradient: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonTextSmall: {
    marginVertical: 5,
    fontSize: 14,
  },
  buttonTextRegular: {
    marginVertical: 13,
    fontSize: 20,
  },
  buttonTextBig: {
    marginVertical: 13,
    fontSize: 26,
  },
})
