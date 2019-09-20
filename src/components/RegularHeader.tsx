import React from 'react'
import { Image } from 'react-native'
import Text from './Text'

const LogoNewDark = require('../../assets/Logo2.png')

export const Logo = () => (
    <Image source={LogoNewDark} style={{marginTop:0}} resizeMode="contain"/>
)

export const RegularHeader = () => (
    <React.Fragment>
        <Logo/>

        {/* <Text style={{
            borderWidth    : 1,
            borderColor    : '#041f43',
            color          : '#041f43',
            borderRadius   : 5,
            fontSize       : 12,
            marginTop      : 10,
            paddingVertical: 5,
            width          : 120,
            textAlign      : 'center',
        }}>
            Skeep
        </Text> */}
    </React.Fragment>
)
