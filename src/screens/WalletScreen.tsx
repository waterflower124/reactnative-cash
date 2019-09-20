import moment from 'moment'
import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  StatusBar,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import * as redux from 'react-redux'
import { Money } from '../components/Money'
import { SafeAreaView } from '../components/SafeAreaView'
import Text from '../components/Text'
import { Header } from '../containers/Header'
import { Wrapper } from '../containers/Wrapper'
import { Money as MoneyValue } from '../httpapi'
import { Dispatch, State } from '../store'
import { Transaction } from '../store/wallet'
import * as walletActions from '../store/wallet/actions'
import * as promises from '../utils/promises'
import { HeaderText } from '../components/HeaderText';
import Icon from 'react-native-vector-icons/FontAwesome';

interface WalletScreenProps {
  balance: PromiseState<MoneyValue>
  transactions: PromiseState<Array<Transaction>>
  userNames: string | null

  onReady(): void
}

class BaseWalletScreen extends React.Component<WalletScreenProps> {
  public static mapStateToProps(state: State): Partial<WalletScreenProps> {
    return {
      balance: state.wallet.balance,
      transactions: state.wallet.transactions,
      userNames: state.session.user.first_name &&
        state.session.user.last_name &&
        `${state.session.user.first_name} ${state.session.user.last_name}`,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<WalletScreenProps> {
    return {
      onReady() {
        dispatch(walletActions.loadBalance())
      },
    }
  }

  public componentDidMount() {
    this.props.onReady()
  }

  public render() {
    return (
      <Wrapper dark>
        <StatusBar barStyle="light-content" />

        <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1, alignSelf: 'stretch',  }}>
          <LinearGradient colors={['#364a6b', '#1e293b']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '40%', position: 'absolute', left: 0, top: 0 }} />
          <Header color="light" startStyle={{ justifyContent: 'center' }}>
            {
              this.props.userNames &&
              <Text style={{
                fontSize: 14,
                color: '#041f43',
              }}>{this.props.userNames}</Text>
            }

            {/* <Text style={{
              fontSize  : 18,
              fontWeight: '500',
              color     : '#041f43',
            }}>Wallet</Text> */}
          </Header>
          <HeaderText>
            Wallet
          </HeaderText>

          <View style={{ marginHorizontal: 20, justifyContent:'center' }}>
            <LinearGradient colors={['#041f43', '#c43652']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                alignSelf: 'stretch',
                height: (Dimensions.get('window').width - 40) * 0.6,
                justifyContent: 'space-between',
                marginTop: 40,
                paddingHorizontal: 30,
                paddingVertical: 20,
                shadowColor: '#00000040',
                shadowOffset: { width: 10, height: 35 },
                shadowRadius: 5,
                elevation:1
              }}>
              <View style={{
                flexDirection: 'row',
              }}>
                <Icon name='credit-card-alt' style={{ color: '#ffffff', fontSize: 22 }} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                  }}>Solde de votre compte</Text>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '300',
                  }}>
                    {moment().format('LL')}
                  </Text>
                </View>

              </View>

              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* <View style={{
                  backgroundColor: '#c43652',
                  borderRadius: 8,
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  marginRight: 15,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '700',
                  }}>EUR.</Text>
                </View> */}

                {promises.select(this.props.balance, {
                  loading: () => (
                    <ActivityIndicator size="large" />
                  ),

                  failure: () => (
                    <Text style={{
                      fontSize: 40,
                    }}>
                      ERR
                    </Text>
                  ),

                  success: balance => (
                    <Text
                      style={{
                        fontSize: 40,
                      }}
                    >
                      {(balance.amount / 100).toFixed(2)} €
                    </Text>
                  ),
                })}
                {/* <Text style={{
                  fontSize: 40,
                  fontWeight: '700',
                }}>€</Text> */}
              </View>
            </LinearGradient>
            <LinearGradient colors={['#041f43', '#c43652']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                alignSelf: 'stretch',
                height: (Dimensions.get('window').width - 60) * 0.6,
                justifyContent: 'space-between',
                marginTop: -(Dimensions.get('window').width - 60) * 0.6 + 10,
                width: Dimensions.get('window').width - 60,
                zIndex: -2,
                marginLeft:10,
                paddingHorizontal: 30,
                paddingVertical: 20,
                shadowColor: '#00000040',
                shadowOffset: { width: 10, height: 35 },
                shadowRadius: 2,
                elevation:1
              }}>
            </LinearGradient>
            <LinearGradient colors={['#041f43', '#c43652']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 20,
                alignSelf: 'stretch',
                height: (Dimensions.get('window').width - 80) * 0.6,
                justifyContent: 'space-between',
                marginTop: -(Dimensions.get('window').width - 80) * 0.6 + 10,
                width: Dimensions.get('window').width - 80,
                zIndex: -3,
                marginLeft:20,
                paddingHorizontal: 30,
                paddingVertical: 20,
                shadowColor: '#00000040',
                shadowOffset: { width: 10, height: 35 },
                shadowRadius: 2,
                elevation:1
              }}>
            </LinearGradient>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 20,
            }}>
              <Text style={{
                color: '#041f43',
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                All
              </Text>
              <Text style={{
                color: '#041f43',
                fontSize: 12,
              }}>
                Received
              </Text>
              <Text style={{
                color: '#041f43',
                fontSize: 12,
              }}>
                Sent
              </Text>
            </View>
          </View>

          <FlatList
            refreshing={false}
            data={promises.unwrap(this.props.transactions, [])}
            keyExtractor={(_item, idx) => idx.toString()}
            renderItem={this.renderItem}
            style={{ flex: 1 }}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderSeparator}
          />
        </SafeAreaView>
      </Wrapper>
    )
  }

  private renderItem = ({ item }: ListRenderItemInfo<Transaction>) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 20,
    }}>
      <Image
        source={{ uri: item.advertiser_logo_url }}
        style={{
          width: 25,
          height: 25,
          resizeMode: 'contain',
        }}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginLeft: 10,
      }}>
        <Text style={{
          color: '#041f43',
          fontSize: 10,
          flexWrap: 'wrap',
          width: '33%',
        }}>{item.advertiser_name}</Text>

        <Text style={{
          color: '#041f43',
          fontSize: 10,
          flexWrap: 'wrap',
          width: '53%',
        }}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 25,
      }}>
        <Money
          value={{ amount: item.fees, currency: 'eur' }}
          style={{
            color: '#041f43',
            fontSize: 10,
          }}
        />
      </View>
    </View>
  )

  private renderSeparator = () => (
    <View
      style={{
        alignSelf: 'stretch',
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}
    />
  )
}

export const WalletScreen = redux.connect
  (BaseWalletScreen.mapStateToProps, BaseWalletScreen.mapDispatchToProps)
  (BaseWalletScreen)
