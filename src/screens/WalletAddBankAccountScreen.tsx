import React               from 'react'
import * as redux          from 'react-redux'
import { Dispatch, State } from '../store'

import { StatusBar, View }         from 'react-native'
import { Button }                  from '../components/Button'
import { CountryPicker }           from '../components/CountryPicker'
import { SafeAreaView }            from '../components/SafeAreaView'
import { ScrollViewAvoidKeyboard } from '../components/ScrollViewAvoidKeyboard'
import Text                        from '../components/Text'
import { TextInput }               from '../components/TextInput'
import { Header }                  from '../containers/Header'
import { Wrapper }                 from '../containers/Wrapper'

import * as navigationActions from '../store/navigation/actions'
import * as walletActions     from '../store/wallet/actions'

interface WalletAddBankAccountScreenProps {
  userNames: string
  creatingBankAccount?: PromiseState<void>

  onSubmit(
    iban: string,
    bic: string,
    ownerName: string,
    ownerAddress: string,
    ownerAddress2: string,
    ownerCity: string,
    ownerPostalCode: string,
    ownerRegion: string,
    ownerCountry: string,
  ): void
}

interface ScreenState {
  iban: string
  bic: string
  owner_name: string
  owner_address: string
  owner_address2: string
  owner_city: string
  owner_region: string
  owner_postal_code: string
  owner_country: string
}

class WalletAddBankAccountScreen extends React.Component<WalletAddBankAccountScreenProps, ScreenState> {
  public readonly state: ScreenState = {
    iban             : '',
    bic              : '',
    owner_name       : '',
    owner_address    : '',
    owner_address2   : '',
    owner_city       : '',
    owner_region     : '',
    owner_postal_code: '',
    owner_country    : '',
  }

  public static mapStateToProps(state: State): Partial<WalletAddBankAccountScreenProps> {
    return {
      creatingBankAccount: state.wallet.creatingBankAccount,
      userNames          : state.session.user.first_name &&
        state.session.user.last_name &&
        `${state.session.user.first_name} ${state.session.user.last_name}`,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<WalletAddBankAccountScreenProps> {
    return {
      onSubmit(
        iban: string,
        bic: string,
        ownerName: string,
        ownerAddress: string,
        ownerAddress2: string,
        ownerCity: string,
        ownerPostalCode: string,
        ownerRegion: string,
        ownerCountry: string,
      ) {
        dispatch(walletActions.createBankAccount(
          iban,
          bic,
          ownerName,
          ownerAddress,
          ownerAddress2,
          ownerCity,
          ownerPostalCode,
          ownerRegion,
          ownerCountry,
        ))
        dispatch(navigationActions.openMenu())
      },
    }
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
            }}>Wallet: Add Bank Account</Text>
          </Header>

          <ScrollViewAvoidKeyboard
            alwaysBounceVertical={false}
            style={{marginTop: 20, marginHorizontal: 20}}>
            <TextInput
              value={this.state.iban}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_iban"
              placeholderDefault="IBAN"
              onChangeText={this.onChangeState('iban')}
            />
            <TextInput
              value={this.state.bic}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_bic"
              placeholderDefault="BIC"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('bic')}
            />
            <TextInput
              value={this.state.owner_name}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_owner_name"
              placeholderDefault="Owner Name"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('owner_name')}
            />
            <TextInput
              value={this.state.owner_address}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_owner_address"
              placeholderDefault="Owner Address"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('owner_address')}
            />
            <TextInput
              value={this.state.owner_address2}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_owner_address2"
              placeholderDefault="Owner Address (complement)"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('owner_address2')}
            />
            <View style={{
              marginTop    : 10,
              flexDirection: 'row',
            }}>
              <TextInput
                value={this.state.owner_city}
                type="default"
                placeholderId="screens.wallet_add_bank_account.input_owner_city"
                placeholderDefault="Owner City"
                style={{flex: 3}}
                onChangeText={this.onChangeState('owner_city')}
              />
              <TextInput
                value={this.state.owner_postal_code}
                type="default"
                placeholderId="screens.wallet_add_bank_account.input_owner_postal_code"
                placeholderDefault="Postal Code"
                style={{flex: 2, marginLeft: 10}}
                onChangeText={this.onChangeState('owner_postal_code')}
              />
            </View>
            <TextInput
              value={this.state.owner_region}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_owner_region"
              placeholderDefault="Owner Region"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('owner_region')}
            />
            <CountryPicker
              value={this.state.owner_country}
              type="default"
              placeholderId="screens.wallet_add_bank_account.input_owner_country"
              placeholderDefault="Owner Country"
              style={{marginTop: 10}}
              onChangeText={this.onChangeState('owner_country')}
            />

            <Button
              textId="screens.wallet_add_bank_account.submit_button"
              textDefault="Add"
              onPress={this.onSubmit}
              style={{marginTop: 10}}
              loading={this.props.creatingBankAccount && this.props.creatingBankAccount._ === 'loading'}
            />
          </ScrollViewAvoidKeyboard>
        </SafeAreaView>
      </Wrapper>
    )
  }

  private onChangeState = <K extends keyof ScreenState>(field: K) => (value: ScreenState[K]) => {
    this.setState({[field]: value} as any)
  }

  private onSubmit = () => {
    this.props.onSubmit(
      this.state.iban,
      this.state.bic,
      this.state.owner_name,
      this.state.owner_address,
      this.state.owner_address2,
      this.state.owner_city,
      this.state.owner_region,
      this.state.owner_postal_code,
      this.state.owner_country,
    )
  }
}

export default redux.connect
(WalletAddBankAccountScreen.mapStateToProps, WalletAddBankAccountScreen.mapDispatchToProps)
(WalletAddBankAccountScreen)
