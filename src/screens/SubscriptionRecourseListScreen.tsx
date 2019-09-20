import React                         from 'react'
import { NavigationScreenProps }     from 'react-navigation'
import { connect }                   from 'react-redux'
import { Subscription, UserAccount } from '../httpapi'
import { Dispatch, State }           from '../store'

import * as itemsActions      from '../store/items/actions'
import * as listitemsActions  from '../store/listitems/actions'
import * as navigationActions from '../store/navigation/actions'

import {
    FlatList,
    Image,
    ListRenderItemInfo,
    TouchableOpacity,
    View,
}                              from 'react-native'
import { Background }          from '../components/Background'
import { Message }             from '../components/Message'
import * as PromiseStateRender from '../components/PromiseState'
import { SafeAreaView }        from '../components/SafeAreaView'
import Text                    from '../components/Text'
import { Header }              from '../containers/Header'
import { Wrapper }             from '../containers/Wrapper'

interface SubscriptionRecourseListScreenProps extends NavigationScreenProps {
    currentAccount: UserAccount
    result?: PromiseState<void>
    subscriptions: Array<Subscription>

    onLoadNextPage(): void

    onSelectItem(subscription: Subscription): void
}

class SubscriptionRecourseListScreen extends React.Component<SubscriptionRecourseListScreenProps> {
    public static mapStateToProps(state: State): Partial<SubscriptionRecourseListScreenProps> {
        return {
            currentAccount: state.navigation.currentAccount,
            result        : state.listitems.subscriptions.result,
            subscriptions : state.listitems.subscriptions.items,
        }
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<SubscriptionRecourseListScreenProps> {
        return {
            onLoadNextPage() {
                dispatch(listitemsActions.subscriptions.load('skip'))
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

    public componentWillReceiveProps(nextProps: SubscriptionRecourseListScreenProps) {
        if (nextProps.currentAccount.id !== this.props.currentAccount.id) {
            this.props.onLoadNextPage()
        }
    }

    public render() {
        return (
            <Wrapper>
                <Background>
                    <SafeAreaView style={{flex: 1}}>
                        <Header style={{alignItems: 'center'}} containerStyle={{marginTop: 10}}>
                            <Message
                                id="screens.subscription_recourse_list.title"
                                defaultMessage="Recourses"
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
                <Image
                    source={{uri: item.newsletter.logo_url}}
                    style={{
                        width       : 60,
                        height      : 60,
                        borderRadius: 30,
                        resizeMode  : 'contain',
                        marginRight : 20,
                    }}
                />

                <View style={{
                    flex: 1,
                }}>
                    <Text allowFontScaling={false} style={{fontSize: 14}}>
                        {item.newsletter.name}
                    </Text>

                    <Message
                        id="screens.subscription_recourse_list.unwanted_emails"
                        defaultMessage="{unwanted_emails} emails since 3 months"
                        values={{
                            unwanted_emails: (
                                <Text allowFontScaling={false} style={{fontSize: 12, fontStyle: 'italic'}}>
                                    {item.unwanted_emails.toString()}
                                </Text>
                            ),
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

export default connect
(SubscriptionRecourseListScreen.mapStateToProps, SubscriptionRecourseListScreen.mapDispatchToProps)
(SubscriptionRecourseListScreen)
