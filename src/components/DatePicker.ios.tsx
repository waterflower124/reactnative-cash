import moment                                            from 'moment'
import React                                             from 'react'
import { Button, DatePickerIOS, TouchableOpacity, View } from 'react-native'
import Modal                                             from 'react-native-modal'
import * as Styles                                       from '../styles'
import { DatePickerProps }                               from './DatePicker'
import { Message }                                       from './Message'
import Text                                              from './Text'

interface DatePickerState {
    modalVisible: boolean
    current: Date
}

export class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    public readonly state: DatePickerState = {
        modalVisible: false,
        current     : this.props.date || new Date(),
    }

    public componentWillReceiveProps(nextProps: DatePickerProps) {
        this.setState({
            ...this.state,
            current: nextProps.date || new Date(),
        })
    }

    public render() {
        return (
            <React.Fragment>
                <Modal isVisible={this.state.modalVisible} onBackdropPress={this.onBlur}>
                    <View style={{
                        backgroundColor : '#FFF',
                        borderRadius    : 5,
                        alignSelf       : 'stretch',
                        marginHorizontal: 10,
                        padding         : 10,
                    }}>
                        <DatePickerIOS
                            date={this.state.current}
                            onDateChange={this.onDateChange}
                            mode="date"
                        />
                    </View>

                    <View style={{
                        backgroundColor : '#FFF',
                        borderRadius    : 5,
                        alignSelf       : 'stretch',
                        marginHorizontal: 10,
                        padding         : 10,
                        marginTop       : 20,
                    }}>
                        <Button title="Confirm" onPress={this.onConfirm}/>
                    </View>
                </Modal>

                {this.renderValue()}
            </React.Fragment>
        )
    }

    private renderValue() {
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
                        {this.renderInnerValue()}
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
                {this.renderInnerValue()}
            </TouchableOpacity>
        )
    }

    private renderInnerValue() {
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

    private onFocus = () => {
        this.setState({
            ...this.state,
            modalVisible: true,
        })
    }

    private onBlur = () => new Promise(resolve => {
        this.setState({
            ...this.state,
            modalVisible: false,
        }, resolve)
    })

    private onDateChange = (current: Date) => {
        this.setState({
            ...this.state,
            current,
        })
    }

    private onConfirm = async () => {
        await this.onBlur()
        this.props.onChange(this.state.current)
    }
}
