import React from 'react'

import {
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
}                      from 'react-native'
import { UserAccount } from '../httpapi'

const icons = {
    gmail: require('../../assets/icons/gmail.png'),
    yahoo: require('../../assets/icons/yahoo.png'),
    facebook: require('../../assets/icons/facebook.png'),
    instagram: require('../../assets/icons/instagram.png'),
    mediutm: require('../../assets/icons/medium.png')
}

export type AccountProviderIconName = keyof typeof icons

export interface AccountProviderIconProps {
    name: AccountProviderIconName
    style?: StyleProp<ImageStyle>
    size?: number
}

export const AccountProviderIcon = ({name, style, size = 40}: AccountProviderIconProps) => (
    <Image
        source={icons[name] || icons.gmail}
        style={[{width: size, height: size}, styles.icon, style]}
    />
)

const styles = StyleSheet.create({
    icon: {margin: 10, resizeMode: 'contain'},
})

export function forAccount(account: UserAccount): AccountProviderIconName {
    const name = account.provider.name.toLowerCase()
    if (name in icons) {
        return name as AccountProviderIconName
    }
    return 'gmail'
}