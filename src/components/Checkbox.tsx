import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'

export function Checkbox(props: Props) {
  return (
    <TouchableWithoutFeedback onPress={props.onChecked}>
      <View style={{padding: 10}}>
        <View
          style={
            props.checked
              ? {width: 15, height: 15, borderWidth: 2, borderColor: '#ffffff', backgroundColor: '#e2778d', borderRadius: 7.5}
              : {width: 15, height: 15, backgroundColor:'#ffffff', borderRadius: 7.5}
          }
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

export interface Props {
  checked: boolean

  onChecked(): void
}
