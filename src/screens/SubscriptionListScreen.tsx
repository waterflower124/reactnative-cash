import moment from 'moment'

import React                     from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect }               from 'react-redux'
import { Subscription }          from '../httpapi'
import { Dispatch, State }       from '../store'

import * as listitemsActions  from '../store/listitems/actions'

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

interface SubscriptionListScreenProps extends NavigationScreenProps {
    result?: PromiseState<void>
    subscriptions: Array<Subscription>

    onLoadNextPage(): void

    onKeep(ids: number[]): void

    onSkip(ids: number[]): void
}

interface ScreenState {
    selected: { [key: number]: boolean }
}

class SubscriptionListScreen extends React.Component<SubscriptionListScreenProps, ScreenState> {
    public readonly state: ScreenState = {
        selected: {},
    }

    public static mapStateToProps(state: State): Partial<SubscriptionListScreenProps> {
        return {
            result       : state.listitems.subscriptions.result,
            subscriptions: state.listitems.subscriptions.items,
        }
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<SubscriptionListScreenProps> {
        return {
            onLoadNextPage() {
                dispatch(listitemsActions.subscriptions.load())
            },

            onSkip(ids) {
                dispatch(listitemsActions.subscriptions.skip(ids))
            },

            onKeep(ids) {
                dispatch(listitemsActions.subscriptions.keep(ids))
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
                        <View style={{
                            alignSelf   : 'stretch',
                            alignItems  : 'center',
                        }}>
                            <Header containerStyle={{marginTop: 10}} style={{alignItems: 'center'}} canToggleMulti>
                                <Message
                                    id="screens.subscription_list.title"
                                    defaultMessage="Multi-liste"
                                    style={{
                                        fontSize: 20,
                                    }}
                                />
                            </Header>

                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <TouchableOpacity onPress={this.onKeep} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                }}>
                                    <Icon name="ios-checkmark-outline" style={{
                                        color: '#fff',
                                        fontSize: 28,
                                        marginRight: 5,
                                    }}/>
                                    <Message
                                        id="screens.subscription_list.keep_btn"
                                        defaultMessage="Keep"
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onSkip} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    paddingVertical: 10,
                                }}>
                                    <Icon name="ios-close-outline" style={{
                                        color: '#fff',
                                        fontSize: 28,
                                        marginRight: 5,
                                    }}/>
                                    <Message
                                        id="screens.subscription_list.skip_btn"
                                        defaultMessage="Skip"
                                        style={{
                                            fontSize: 16,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {this.renderContent()}
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
                    {
                        this.state.selected[item.id] &&
                        <View style={{
                            width          : 30,
                            height         : 30,
                            borderRadius   : 15,
                            backgroundColor: '#19a6527f',
                            justifyContent : 'center',
                            alignItems     : 'center',
                        }}>
                            <Icon
                                name="ios-checkmark-outline"
                                style={{
                                    color   : '#FFF',
                                    fontSize: 30,
                                }}
                            />
                        </View>
                    }
                </ImageBackground>

                <View style={{
                    flex: 1,
                }}>
                    <Text allowFontScaling={false} style={{}}>
                        {item.newsletter.name}
                    </Text>

                    <Message
                        id="screens.subscription_list.row_label"
                        defaultMessage="apparu le {appeared_at}"
                        values={{
                            appeared_at: moment(item.appeared_at).format('LL'),
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
        this.setState({
            selected: {
                ...this.state.selected,
                [item.id]: !this.state.selected[item.id],
            },
        })
    }

    private onSkip = () => {
        const ids = Object.keys(this.state.selected).map(parseInt)
        this.setState({selected: {}}, () => {
            this.props.onSkip(ids)
        })
    }

    private onKeep = () => {
        const ids = Object.keys(this.state.selected).map(parseInt)
        this.setState({selected: {}}, () => {
            this.props.onKeep(ids)
        })
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

export default connect(SubscriptionListScreen.mapStateToProps, SubscriptionListScreen.mapDispatchToProps)(SubscriptionListScreen)
