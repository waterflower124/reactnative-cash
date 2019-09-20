import React                          from 'react'
import { Money as MoneyValue }        from '../httpapi'
import Text, { TextProps } from './Text'

interface MoneyProps extends TextProps {
    value: MoneyValue
}

export const Money = ({value, ...props}: MoneyProps) => (
    <Text {...props} allowFontScaling={false}>
        {new Intl.NumberFormat(undefined, {style: 'currency', currency: value.currency})
            .format(value.amount / 100)}
    </Text>
)
