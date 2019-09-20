import React                                       from 'react'
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import LinearGradient                              from 'react-native-linear-gradient'
import Text                                        from './Text'

const Logo = require('../../assets/Logo.png')

interface SplashProps {
    style?: StyleProp<ViewStyle>
}

export const Splash = (props: SplashProps) => (
    <LinearGradient colors={['#041f43', '#c43652']} start={{x: 0, y: 0}} end={{x: 0, y: 1}}
                    style={[styles.container, props.style]}>
        <Image source={Logo} style={styles.image}/>

        <Text style={styles.text} allowFontScaling={false}>Made with love by Skeep Team</Text>
    </LinearGradient>
)

const styles = StyleSheet.create({
    container: {
        flex          : 1,
        alignItems    : 'center',
        justifyContent: 'center',
    },

    image: {

    },

    text: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
    },
})