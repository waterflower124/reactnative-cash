import React from 'react'

import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Header } from './Header'
import { Message } from './Message'

interface TitleBarProps {
    titleId?: string
    titleDefault?: string
    children?: JSX.Element
    enableBack?: boolean

    onBack(): void
}

export class TitleBar extends React.PureComponent<TitleBarProps> {
    public render() {
        return (
            <View
                style={{
                    backgroundColor: '#5a6d86CC',
                    alignSelf: 'stretch',
                }}
            >
                <LinearGradient colors={['#0000007F', '#00000000']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{
                        alignSelf: 'stretch',
                    }}>
                    <Header
                        canReturnBack={this.props.enableBack}
                        onReturnBack={this.props.onBack}
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'stretch',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        startStyle={{
                            marginTop: 0,
                            paddingTop: 10,
                            paddingBottom: 10,
                        }}
                        containerStyle={{
                            marginTop: 20,
                        }}
                    >
                        {
                            this.props.titleId &&
                            <Message
                                id={this.props.titleId}
                                defaultMessage={this.props.titleDefault}
                                style={{ fontSize: 18, fontWeight: '300', color: '#FFF' }}
                            />
                        }

                        {this.props.children}
                    </Header>
                </LinearGradient>
            </View>
        )
    }
}