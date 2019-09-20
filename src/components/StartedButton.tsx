import React from 'react'

import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Message } from './Message'

export function StartedButton(props: Props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style} activeOpacity={0.6}>
      <View style={[styles.buttonGradient, props.style, { backgroundColor: '#d67085' }]}>
        {
          props.loading &&
          <ActivityIndicator color="#FFFFFF" size="small" />
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
      </View>
    </TouchableOpacity>
  )
}

export type Size = 'small' | 'regular' | 'big'

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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonTextSmall: {
    marginVertical: 5,
    fontSize: 14,
  },
  buttonTextRegular: {
    marginVertical: 20,
    fontSize: 20,
  },
  buttonTextBig: {
    marginVertical: 13,
    fontSize: 26,
  },
})
