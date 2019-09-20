import React                           from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import LinearGradient                  from 'react-native-linear-gradient'

export const Background2 = ({style, ...props}: ViewProps & JSX.ElementChildrenAttribute) => (
  <View style={styles.background}>
    <LinearGradient {...props} style={[styles.background2, style]}
                    colors={['#041F43', '#c43652']}
                    start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
      {props.children}
    </LinearGradient>
  </View>
)

const styles = StyleSheet.create({
  background : {backgroundColor: '#3c5277', flex: 1},
  background2: {flex: 1},
})
