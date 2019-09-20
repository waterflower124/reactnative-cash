import React from 'react'

import {
    StyleProp,
    Text as BaseText,
    TextProps as BaseTextProps,
    TextStyle as BaseTextStyle,
} from 'react-native'

import * as Styles from '../styles'

export type TextStyle = BaseTextStyle

export interface TextProps extends BaseTextProps {
    style?: StyleProp<TextStyle>,
    children?: React.ReactElement<any> | string | (React.ReactElement<any> | string)[]
}

export default ({children, style, ...props}: TextProps) => (
    <BaseText allowFontScaling={false} {...props} style={[Styles.text, style]}>
        {children}
    </BaseText>
)
