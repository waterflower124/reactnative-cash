import React               from 'react'
import * as redux          from 'react-redux'
import { BankAccount }     from '../httpapi'
import { Dispatch, State } from '../store'
import * as promises       from '../utils/promises'

import {
    Alert,
    FlatList, Keyboard,
    ListRenderItemInfo,
    StatusBar,
    TouchableOpacity,
    View,
}                         from 'react-native'
import Icon               from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button }         from '../components/Button'
import { GradientButton } from '../components/GradientButton'
import { Message }        from '../components/Message'
import { SafeAreaView }   from '../components/SafeAreaView'
import Text               from '../components/Text'
import { TextInput }      from '../components/TextInput'
import { Header }         from '../containers/Header'
import { Wrapper }        from '../containers/Wrapper'

import * as navigationActions from '../store/navigation/actions'
import * as walletActions     from '../store/wallet/actions'

interface WalletWithdrawScreenProps {
    userNames: string | null
    bankAccounts: PromiseState<Array<BankAccount>>
    withdrawing?: PromiseState<void>

    onReady(): void

    onAddBankAccount(): void

    onWithdraw(bankAccount: BankAccount, amount: number): void
}

interface ScreenState {
    selectedBankAccount: BankAccount | null
    amount: string
}

class WalletWithdrawScreen extends React.Component<WalletWithdrawScreenProps, ScreenState> {
    public readonly state: ScreenState = {
        selectedBankAccount: null,
        amount             : '',
    }

    public static mapStateToProps(state: State): Partial<WalletWithdrawScreenProps> {
        return {
            bankAccounts: state.wallet.bankAccounts,
            withdrawing : state.wallet.withdrawing,
            userNames   : state.session.user.first_name &&
                          state.session.user.last_name &&
                          `${state.session.user.first_name} ${state.session.user.last_name}`,
        }
    }

    public static mapDispatchToProps(dispatch: Dispatch): Partial<WalletWithdrawScreenProps> {
        return {
            onReady() {
                dispatch(walletActions.loadBankAccounts())
            },
            onAddBankAccount() {
                dispatch(navigationActions.navigateTo('WalletAddBankAccount'))
            },
            async onWithdraw(bankAccount, amount) {
                await dispatch(walletActions.withdraw(bankAccount, amount))
                Alert.alert('Funds have successfully been withdrawn from your Skeep account. ' +
                                 'The transfer might take up to 5 business days before showing up on your bank account.')
                dispatch(navigationActions.navigateTo('Wallet', true))
            },
        }
    }

    public componentDidMount() {
        this.props.onReady()
    }

    public render() {
        return (
            <Wrapper dark>
                <StatusBar barStyle="dark-content"/>

                <SafeAreaView style={{backgroundColor: '#FFF', flex: 1, alignSelf: 'stretch'}}>
                    <Header color="dark" containerStyle={{marginTop: 30}}
                            startStyle={{justifyContent: 'center'}}>
                        {
                            this.props.userNames &&
                            <Text allowFontScaling={false} style={{
                                fontSize: 14,
                                color   : '#041f43',
                            }}>{this.props.userNames}</Text>
                        }

                        <Text allowFontScaling={false} style={{
                            fontSize  : 18,
                            fontWeight: '500',
                            color     : '#041f43',
                        }}>Wallet: Withdraw</Text>
                    </Header>

                    {this.renderContent()}
                </SafeAreaView>
            </Wrapper>
        )
    }

    private renderContent() {
        const {selectedBankAccount} = this.state

        if (!selectedBankAccount) {
            return (
                <React.Fragment>
                    <GradientButton
                        textId="screens.wallet_withdraw.add_bank_account"
                        textDefault="Add Bank Account"
                        onPress={this.props.onAddBankAccount}
                        style={{marginHorizontal: 20, marginTop: 10}}
                    />

                    <FlatList
                        keyExtractor={item => item.id}
                        data={promises.unwrap(this.props.bankAccounts, [])}
                        refreshing={this.props.bankAccounts._ === 'loading'}
                        onRefresh={this.props.onReady}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListEmptyComponent={
                            <Message
                                id="screens.wallet_withdraw.add_bank_account_message"
                                defaultMessage="You don't have any bank account yet."
                                style={{
                                    color: '#041f43',
                                }}
                            />
                        }
                        style={{
                            marginTop: 25,
                            flex     : 1,
                            alignSelf: 'stretch',
                        }}
                    />
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <TextInput
                    autoFocus
                    value={this.state.amount}
                    onChangeText={this.onChangeAmount}
                    type="numeric"
                    placeholderId="screens.wallet_withdraw.input_amount"
                    placeholderDefault="0.00"
                    style={{
                        borderWidth     : 0,
                        marginHorizontal: 40,
                        marginTop       : 50,
                    }}
                    inputStyle={{
                        fontSize: 24,
                    }}
                    leftAddon={
                        <Text allowFontScaling={false} style={{
                            fontSize: 24,
                            color   : '#041f43',
                        }}>
                            €{' '}
                        </Text>
                    }
                />

                <Button
                    loading={this.props.withdrawing && this.props.withdrawing._ === 'loading'}
                    textId="screens.wallet_withdraw.submit_button"
                    textDefault="Withdraw"
                    onPress={this.onSubmit}
                    style={{
                        marginHorizontal: 40,
                        marginTop       : 20,
                    }}
                />
            </React.Fragment>
        )
    }

    private onChangeAmount = (amount: string) => {
        this.setState({amount})
    }

    private onSubmit = () => {
        Keyboard.dismiss()

        this.props.onWithdraw(
            this.state.selectedBankAccount,
            parseFloat(this.state.amount) || 0,
        )
    }

    private onSelectItem = (selectedBankAccount: BankAccount) => () => {
        this.setState({selectedBankAccount})
    }

    private renderSeparator = () => (
        <View
            style={{
                alignSelf      : 'stretch',
                height         : 1,
                backgroundColor: 'rgba(0,0,0,0.1)',
            }}
        />
    )

    private renderItem = ({item}: ListRenderItemInfo<BankAccount>) => {
        return (
            <TouchableOpacity onPress={this.onSelectItem(item)}
                              style={{
                                  flexDirection    : 'row',
                                  paddingHorizontal: 20,
                                  paddingVertical  : 5,
                              }}>
                <Text allowFontScaling={false}
                    style={{
                        flex              : 1,
                        marginRight       : 25,
                        color             : '#041f43',
                        textDecorationLine: (
                            item.valid ? 'none' : 'line-through'
                        ),
                    }}>
                    {item.alias}
                </Text>
                <Icon name="chevron-right" color="#041f43" size={22}/>
            </TouchableOpacity>
        )
    }
}

export default redux.connect
(WalletWithdrawScreen.mapStateToProps, WalletWithdrawScreen.mapDispatchToProps)
(WalletWithdrawScreen)