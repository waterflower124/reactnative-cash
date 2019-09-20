import React from 'react'
import {
    StyleProp,
    Text as BaseText,
    TextProps as BaseTextProps,
    TextStyle as BaseTextStyle,
    StyleSheet
} from 'react-native'

import * as Styles from '../styles'
import { bold } from 'ansi-colors';

type HeaderColor = 'light' | 'dark'

interface TextProps extends BaseTextProps {
    style?: StyleProp<TextStyle>,
    children?: React.ReactElement<any> | string | (React.ReactElement<any> | string)[],
    dark?: boolean
}
export type TextStyle = BaseTextStyle


export class HeaderText extends React.Component<TextProps> {

    constructor(props) {
        super(props);
    }
    public render() {
        const props = this.props;
        return (
            <BaseText allowFontScaling={false} {...props} style={[Styles.text, { fontSize: 34, textAlign: 'left', alignSelf: 'flex-start', marginLeft: 20, fontWeight: 'bold', lineHeight: 41, color: props.dark ? '#000' : '#fff' }]}>
                {this.props.children}
            </BaseText>
        )
    }

}



