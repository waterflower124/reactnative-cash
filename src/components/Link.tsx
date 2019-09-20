import React from 'react'
import { Alert, Linking, StyleSheet, TextStyle } from 'react-native'

import translate from '../translate'
import Text, { TextProps } from './Text'

export interface LinkProps extends TextProps {
  prefix?: string
  prefixStyle?: TextStyle
  href: string
}

export function Link({ href, style, prefix, prefixStyle, ...props }: LinkProps) {
  async function onPress() {
    if (!await Linking.canOpenURL(href)) {
      const protocol = href.split(':', 2)[0]
      return Alert.alert(
        translate('components.link.cannot_open_title', {}, 'Oups, il y a un problème'),
        translate('components.link.cannot_open_message', { protocol, href },
          'Vous ne pouvez pas ouvrir l\'URL "{href}".'),
      )
    }

    await Linking.openURL(href)
  }

  if (prefix) {
    return (
      <Text>
        <Text style={[style, prefixStyle]} allowFontScaling={false}>{prefix}</Text>
        <Text {...props}
          allowFontScaling={false}
          style={[style, styles.text]}
          onPress={onPress}
        />
      </Text>
    )
  }

  return <Text {...props}
    allowFontScaling={false}
    style={[style, styles.text]}
    onPress={onPress}
  />
}

const styles = StyleSheet.create({
  text: {
    textDecorationLine: 'underline',
  },
})
