import moment from 'moment'

import React                     from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect }               from 'react-redux'
import { Subscription }          from '../httpapi'
import { Dispatch, State }       from '../store'

import * as itemsActions      from '../store/items/actions'
import * as listitemsActions  from '../store/listitems/actions'
import * as navigationActions from '../store/navigation/actions'

import {
    FlatList,
    ImageBackground,
    ListRenderItemInfo,
    TouchableOpacity,
    View,
}                              from 'react-native'
import Icon                    from 'react-native-vector-icons/Ionicons'
import { Background }          from '../components/Background'
import { Message }             from '../components/Message'
import * as PromiseStateRender from '../components/PromiseState'
import { SafeAreaView }        from '../components/SafeAreaView'
import Text                    from '../components/Text'
import { Header }              from '../containers/Header'
import { Wrapper }             from '../containers/Wrapper'

interface SubscriptionHistoryScreenProps extends NavigationScreenProps {
    result?: PromiseState<void>
    subscriptions: Array<Subscription>

    onLoadNextPage(): void

    onSelectItem(subscription: Subscription): void
}

class SubscriptionHistoryScreen extends React.Component<SubscriptionHistoryScreenProps> {
    public static mapStateToProps(state: State): Partial<SubscriptionHistoryScreenProps> {
        return {
            result       : state.listitems.subscriptions.result,
            subscriptions: state.listitems.subscriptions.items,
        }
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<SubscriptionHistoryScreenProps> {
        return {
            onLoadNextPage() {
                dispatch(listitemsActions.subscriptions.load('all'))
            },
            onSelectItem(item) {
                dispatch(itemsActions.loadSubscriptionContent(item))
                dispatch(navigationActions.navigateTo('Subscription', false, {
                    subscription: item,
                }))
            },
        }
    }

    public componentDidMount() {
        this.props.onLoadNextPage()
    }

    public render() {
        return (
            <Wrapper>
                <Background>
                    <SafeAreaView style={{flex: 1}}>
                        <Header style={{alignItems: 'center'}} containerStyle={{marginTop: 10}}>
                            <Message
                                id="screens.subscription_history.title"
                                defaultMessage="History"
                                style={{
                                    fontSize: 20,
                                }}
                            />
                        </Header>

                        <View style={{flex: 1, alignSelf: 'stretch'}}>
                            {this.renderContent()}
                        </View>
                    </SafeAreaView>
                </Background>
            </Wrapper>
        )
    }

    private renderContent() {
        const refreshing = this.props.result && this.props.result._ === 'loading'

        if (!refreshing && this.props.subscriptions.length <= 0) {
            return <PromiseStateRender.EndOfData/>
        }

        return (
            <FlatList
                refreshing={refreshing}
                onEndReached={this.props.onLoadNextPage}
                data={this.props.subscriptions}
                keyExtractor={item => item.id.toString()}
                renderItem={this.renderItem}
                ItemSeparatorComponent={ItemSeparator}
                style={{
                    flex        : 1,
                    alignSelf   : 'stretch',
                    marginBottom: 30,
                }}
            />
        )
    }

    private renderItem = ({item}: ListRenderItemInfo<Subscription>) => {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.onSelectItem(item)}
                style={{
                    alignSelf        : 'stretch',
                    height           : 100,
                    flexDirection    : 'row',
                    alignItems       : 'center',
                    paddingHorizontal: 20,
                }}>
                <ImageBackground
                    source={{uri: item.newsletter.logo_url}}
                    imageStyle={{
                        width       : 60,
                        height      : 60,
                        borderRadius: 30,
                        resizeMode  : 'contain',
                    }}
                    style={{
                        width         : 60,
                        height        : 60,
                        marginRight   : 20,
                        justifyContent: 'flex-end',
                        alignItems    : 'flex-start',
                    }}
                >
                    <View style={{
                        width          : 30,
                        height         : 30,
                        borderRadius   : 15,
                        backgroundColor: item.status === 'skip' ? '#c436527f' : '#19a6527f',
                        justifyContent : 'center',
                        alignItems     : 'center',
                    }}>
                        <Icon
                            name={item.status === 'skip' ? 'ios-close-outline' : 'ios-checkmark-outline'}
                            style={{
                                color   : '#FFF',
                                fontSize: 30,
                            }}
                        />
                    </View>
                </ImageBackground>

                <View style={{
                    flex: 1,
                }}>
                    <Text allowFontScaling={false} style={{}}>
                        {item.newsletter.name}
                    </Text>

                    <Message
                        id="screens.subscription_history.row_label"
                        defaultMessage="{status} at {seen_at}"
                        values={{
                            status: item.status || '',
                            seen_at: moment(item.seen_at).format('LL'),
                        }}
                        style={{
                            fontSize: 12,
                        }}
                    />
                </View>

                <View>
                </View>
            </TouchableOpacity>
        )
    }

    private onSelectItem = (item: Subscription) => () => {
        this.props.onSelectItem(item)
    }
}

function ItemSeparator() {
    return (
        <View
            style={{
                alignSelf     : 'stretch',
                borderTopWidth: 1,
                borderColor   : 'rgba(0,0,0,0.2)',
            }}
        />
    )
}

export default connect(SubscriptionHistoryScreen.mapStateToProps, SubscriptionHistoryScreen.mapDispatchToProps)(SubscriptionHistoryScreen)
