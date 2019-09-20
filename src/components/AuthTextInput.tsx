import React from 'react'

import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextInput as BaseTextInput, TextStyle, View, ViewStyle,
} from 'react-native'

import * as Styles from '../styles'
import translate   from '../translate'
import { Message } from './Message'

export interface TextInputProps {
  value: string
  type: 'email' | 'password' | KeyboardTypeOptions
  autoFocus?: boolean
  autoCapitalize?: 'none' |'sentences' | 'words' | 'characters'
  placeholderId: string
  placeholderDefault: string
  isFinal?: boolean
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  error?: EntityValidationError | boolean
  errorMessageStyle?: StyleProp<TextStyle>

  leftAddon?: JSX.Element
  rightAddon?: JSX.Element

  onSubmit?(): void

  onChangeText?(text: string): void

  onFocus?(): void

  onBlur?(): void

  theRef?(x: BaseTextInput | null): void
}

export class TextInput extends React.PureComponent<TextInputProps> {
  public render() {
    if (typeof this.props.error === 'object') {
      return (
        <View style={this.props.style}>
          {this.renderComponent()}

          <Message
            id={`errors.${this.props.error.code}`}
            defaultMessage={this.props.error.code}
            values={this.props.error.params}
            style={[Styles.common.errorMessage, this.props.errorMessageStyle]}
          />
        </View>
      )
    }
    return this.renderComponent(this.props.style)
  }

  private renderComponent(style?: StyleProp<ViewStyle>) {
    return (
      <View style={[styles.textInputContainer, style]}>
        {this.props.leftAddon}

        <BaseTextInput
          autoCapitalize={this.props.autoCapitalize}
          value={this.props.value}
          ref={this.props.theRef as any}
          placeholder={translate(
            this.props.placeholderId,
            {},
            this.props.placeholderDefault,
          )}
          placeholderTextColor="#ffffff4f"
          style={[styles.textInput, this.props.inputStyle]}
          keyboardType={this.props.type === 'email' ? 'email-address' :
            this.props.type === 'password' ? 'default' :
              this.props.type}
          secureTextEntry={this.props.type === 'password'}
          returnKeyType={this.props.isFinal ? 'done' : 'next'}
          autoFocus={this.props.autoFocus}
          onSubmitEditing={this.props.onSubmit}
          onChangeText={this.props.onChangeText}
          underlineColorAndroid="rgba(0,0,0,0)"
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />

        {this.props.rightAddon}
      </View>
    )
  }
}

export type Base = BaseTextInput

const styles = StyleSheet.create({
  textInputContainer: {        
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor:'#ffffff10',
    borderRadius:10,
    padding:10
  },
  textInput: {
    flex: 1,
    fontSize: 15
  },
})
