import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        height: getBottomSpace() + 40,
    },
})

class TabPadding extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Text>TabPadding</Text> */}
            </View>
        )
    }
}

export default TabPadding
