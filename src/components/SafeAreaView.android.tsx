import React from 'react'

import { SafeAreaView as BaseSafeAreaView } from 'react-native'

export function SafeAreaView({style, ...props}) {
    return (
        <BaseSafeAreaView
            {...props}
            style={[
                style,
                {paddingTop: 20},
            ]}
        />
    )
}
