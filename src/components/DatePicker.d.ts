import React                    from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { TextStyle }            from './Text'

export interface DatePickerProps {
    date?: Date
    placeholderId?: string
    placeholderDefault?: string
    style?: StyleProp<ViewStyle>
    error?: EntityValidationError | boolean | void
    errorMessageStyle?: StyleProp<TextStyle>
    onChange(date: Date): void
}

export class DatePicker extends React.Component<DatePickerProps> {
}
