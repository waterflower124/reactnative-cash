import React from 'react'
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { Message } from './Message'
import * as mediaquery from '../utils/mediaquery'

const Accept = require('../../assets/icons/keep.png')
const Decline = require('../../assets/icons/skip.png')

interface KeepSkipProps {
    style?: StyleProp<ViewStyle>

    onAccept(): void

    onDecline(): void
}

export const KeepSkip = (props: KeepSkipProps) => (
    <View style={[styles.container, props.style]}>
        {/* <TouchableOpacity onPress={props.onDecline}>
            <Image source={Decline} style={styles.declineAction}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onAccept}>
            <Image source={Accept} style={styles.acceptAction}/>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={props.onDecline} style={styles.declineButton}>
            <Message
                id="components.keepskip.cancel"
                defaultMessage="Cancel"
                style={{ fontSize: 18, color: '#ffffff',  }}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onAccept} style={styles.acceptButton}>
            <Message
                id="components.keepskip.validate"
                defaultMessage="Validate"
                style={{ fontSize: 18, color: '#ffffff', }}
            />
        </TouchableOpacity>

    </View>
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },

    declineAction: {
        ...mediaquery.screen({
            sm: { width: 40, height: 40 },
            md: { width: 60, height: 60 },
            lg: { width: 60, height: 60 },
        }),
    },

    acceptAction: {
        ...mediaquery.screen({
            sm: { width: 40, height: 40 },
            md: { width: 60, height: 60 },
            lg: { width: 60, height: 60 },
        }),
    },

    declineButton: {
        backgroundColor: '#cccccc',
        borderRadius: 10,
        paddingHorizontal: 40,
        paddingVertical: 20,
        marginRight: 10
    },

    acceptButton: {
        backgroundColor: '#49edd4',
        borderRadius: 10,
        paddingHorizontal: 40,
        paddingVertical: 20,
        marginLeft: 10
    }
})