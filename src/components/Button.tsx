import React from 'react'

import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { Message, MessageValues }                                                from './Message'

const noop = () => undefined

export function Button(props: Props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]}
                      activeOpacity={0.6}
                      onPress={props.loading ? noop : props.onPress}>
      {
        props.loading &&
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
        />
      }
      <Message
        style={styles.text}
        id={props.textId}
        defaultMessage={props.textDefault}
        values={props.textValues}
      />
    </TouchableOpacity>
  )
}

interface Props {
  textId: string
  textDefault: string
  textValues?: MessageValues
  loading?: boolean
  style?: StyleProp<ViewStyle>
  onPress?(): void
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#041f43',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#FFF',
    alignSelf: 'stretch',
    textAlign: 'center',
    paddingVertical: 10,
  },
})
