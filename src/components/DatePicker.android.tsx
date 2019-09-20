import moment                                        from 'moment'
import React                                         from 'react'
import { DatePickerAndroid, TouchableOpacity, View } from 'react-native'
import * as Styles                                   from '../styles'
import { DatePickerProps }                           from './DatePicker'
import { Message }                                   from './Message'
import Text                                          from './Text'

export class DatePicker extends React.Component<DatePickerProps> {
    public render() {
        if (typeof this.props.error === 'object') {
            return (
                <View style={this.props.style}>
                    <TouchableOpacity
                        onPress={this.onFocus}
                        style={{
                            borderColor : '#041f43',
                            borderWidth : 1,
                            borderRadius: 5,
                            alignSelf   : 'stretch',
                        }}
                    >
                        {this.renderValue()}
                    </TouchableOpacity>

                    <Message
                        id={`errors.${this.props.error.code}`}
                        defaultMessage={this.props.error.code}
                        values={this.props.error.params}
                        style={[Styles.common.errorMessage, this.props.errorMessageStyle]}
                    />
                </View>
            )
        }

        return (
            <TouchableOpacity
                onPress={this.onFocus}
                style={[{
                    borderColor : '#041f43',
                    borderWidth : 1,
                    borderRadius: 5,
                    alignSelf   : 'stretch',
                }, this.props.style]}
            >
                {this.renderValue()}
            </TouchableOpacity>
        )
    }

    private renderValue() {
        if (this.props.date) {
            return (
                <Text

                allowFontScaling={false}
                    style={{
                        fontSize: 15,
                        padding : 10,
                        color   : '#041f43',
                    }}
                >
                    {moment(this.props.date).format('L')}
                </Text>
            )
        }

        return (
            <Message
                id={this.props.placeholderId}
                defaultMessage={this.props.placeholderDefault}
                style={{
                    fontSize: 15,
                    padding : 10,
                    color   : '#041f4399',
                }}
            />
        )
    }

    private onFocus = async () => {
        const result = await DatePickerAndroid.open({mode: 'spinner'})
        const date   = new Date(0)
        date.setUTCFullYear(result.year, result.month, result.day)
        this.props.onChange(date)
    }
}
