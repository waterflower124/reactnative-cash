import * as countries                                                       from 'i18n-iso-countries'
import React                                                                from 'react'
import { Dimensions, FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native'
import Modal                                                                from 'react-native-modal'
import * as Styles                                                          from '../styles'
import { Message }                                                          from './Message'
import Text                                                                 from './Text'
import { TextInput, TextInputProps }                                        from './TextInput'

interface CountryPickerProps extends TextInputProps {
    lang?: string
}

interface CountryPickerState {
    modalVisible: boolean
    filter: string
}

interface ListItem {
    alpha2code: string
    name: string
}

export class CountryPicker extends React.Component<CountryPickerProps, CountryPickerState> {
    public static readonly defaultProps: Partial<CountryPickerProps> = {
        lang: 'en',
    }

    public readonly state: CountryPickerState = {
        modalVisible: false,
        filter      : '',
    }

    private countries = Object.keys(countries.getAlpha2Codes()).map(alpha2code => ({
        alpha2code,
        name: countries.getName(alpha2code, this.props.lang),
    }) as ListItem)

    public render() {
        return (
            <React.Fragment>
                <Modal isVisible={this.state.modalVisible} onBackdropPress={this.onBlur} avoidKeyboard>
                    <View style={{
                        backgroundColor : '#FFF',
                        borderRadius    : 5,
                        alignSelf       : 'stretch',
                        marginHorizontal: 20,
                        padding         : 10,
                        height          : Dimensions.get('window').height * 0.5,
                    }}>
                        <TextInput
                            value={this.state.filter}
                            onChangeText={this.onChangeFilter}
                            type="default"
                            placeholderId="components.country_picker.filter_placeholder"
                            placeholderDefault="Enter your country"
                            style={{marginBottom: 10}}
                            isFinal onSubmit={this.onSelectFirst}
                            
                        />

                        <FlatList
                            data={this.listData}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderListItem}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </View>
                </Modal>

                {this.renderValue()}
            </React.Fragment>
        )
    }

    private get listData(): Array<ListItem> {
        const locale = 'en'
        const filter = this.state.filter.toLowerCase()
        return this.countries
            .filter(x => x.name.toLowerCase().includes(filter))
            .sort((a, b) => a.name.localeCompare(b.name, locale))
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
        const value = countries.getName(this.props.value, 'en')

        if (value) {
            return (
                <Text
                allowFontScaling={false}
                    style={{
                        fontSize: 15,
                        padding : 10,
                        color   : '#041f43',
                    }}
                >
                    {value}
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

    private keyExtractor = ({alpha2code}: ListItem) => alpha2code

    private renderListItem = ({item}: ListRenderItemInfo<ListItem>) => {
        return (
            <TouchableOpacity
                onPress={this.onSelect(item)}
                style={{
                    alignSelf      : 'stretch',
                    paddingVertical: 10,
                }}
            >
                <Text
                
                allowFontScaling={false}
                style={{
                    color: '#000',
                }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    private renderSeparator = () => {
        return (
            <View
                style={{
                    alignSelf      : 'stretch',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    height         : 1,
                }}
            />
        )
    }

    private onFocus = () => {
        this.setState({
            ...this.state,
            modalVisible: true,
        })

        if (this.props.onFocus) {
            this.props.onFocus()
        }
    }

    private onBlur = (cb?: () => void) => {
        this.setState({
            ...this.state,
            modalVisible: false,
        }, () => {
            if (typeof cb === 'function') {
                cb()
            }
            if (this.props.onBlur) {
                this.props.onBlur()
            }
        })
    }

    private onSelect = (item: ListItem) => () => {
        this.onBlur(() => {
            this.props.onChangeText(item.alpha2code)
        })
    }

    private onSelectFirst = () => {
        const data = this.listData
        if (data.length > 0) {
            this.onSelect(data[0])()
        }
    }

    private onChangeFilter = (filter: string) => {
        this.setState({
            ...this.state,
            filter,
        })
    }
}