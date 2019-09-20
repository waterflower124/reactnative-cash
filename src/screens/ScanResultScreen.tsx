import React                              from 'react'
import { ActivityIndicator, Image, View } from 'react-native'
import LinearGradient                     from 'react-native-linear-gradient'
import { NavigationScreenProps }          from 'react-navigation'
import { connect }                        from 'react-redux'
import { Message }                        from '../components/Message'
import { RadialPandaButton }              from '../components/RadialPanda'
import { SafeAreaView }                   from '../components/SafeAreaView'
import Text                               from '../components/Text'
import { Dispatch, State }                from '../store'
import * as navigationActions             from '../store/navigation/actions'
import * as sessionActions                from '../store/session/actions'
import * as promises                      from '../utils/promises'

const Clap = require('../../assets/icons/clap.png')

interface NavigationScreenParams {
}

interface ScanResultScreenProps extends NavigationScreenProps<NavigationScreenParams> {
  numberOfItems: PromiseState<number>
  onReady(): void
  onPress(): void
}

const mapStateToProps = (state: State): Partial<ScanResultScreenProps> => {
  return {
    numberOfItems: promises.map(state.navigation.menuStats, m => m.detected_items),
  }
}

const mapDispatchToProps = (dispatch: Dispatch): Partial<ScanResultScreenProps> => {
  return {
    async onReady() {
      await dispatch(navigationActions.refreshCurrentAccount())
      await dispatch(navigationActions.loadMenuStats())
    },
    async onPress() {
      await dispatch(sessionActions.shareScanResult())
      dispatch(sessionActions.afterScanResult())
    },
  }
}

class ScanResultScreen extends React.Component<ScanResultScreenProps> {
  public componentDidMount() {
    this.props.onReady()
  }

  public render() {
    return (
      <LinearGradient colors={['#041f43', '#c43652']} start={{x: 0, y: 0}} end={{x: 0, y: 1}} style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <Text allowFontScaling={false} style={{
            alignSelf         : 'stretch',
            fontSize          : 22,
            fontWeight        : 'bold',
            marginLeft        : 20,
            marginTop         : 10,
            textDecorationLine: 'underline',
          }}>
            SKEEP
          </Text>

          <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', marginTop: 60}}>
            {this.renderContent()}
          </View>

          {
            this.props.numberOfItems._ === 'success' &&
            <RadialPandaButton onPress={this.props.onPress}/>
          }
        </SafeAreaView>
      </LinearGradient>
    )
  }

  private renderContent() {
    const numberOfItems = this.props.numberOfItems
    if (numberOfItems._ !== 'success') {
      return (
        <React.Fragment>
          <Message
            id="screens.scan_result.pending"
            defaultMessage="Votre compte est en train d'être scanné"
            style={{
              fontSize         : 18,
              fontWeight       : '300',
              paddingHorizontal: 40,
              textAlign        : 'center',
            }}
          />

          <ActivityIndicator
            color="#FFF"
            size="large"
          />
        </React.Fragment>
      )
    }

    const items = numberOfItems.item

    return (
      <React.Fragment>
        <Image
          source={Clap}
          style={{}}
        />

        <Message
          id="screens.scan_result.impressing"
          defaultMessage="IMPRESSIONNANT"
          style={{
            fontSize  : 20,
            fontWeight: '400',
          }}
        />

        <Message
          id="screens.scan_result.detected"
          defaultMessage="Nous avons détecté"
          style={{
            fontSize  : 18,
            fontWeight: '300',
          }}
        />

        <View style={{alignItems: 'center'}}>
          <Message
            id="screens.scan_result.detected_items"
            defaultMessage="{count} données"
            values={{count: items.toString()}}
            style={{
              fontSize  : 25,
              fontWeight: 'bold',
            }}
          />
          <Message
            id="screens.scan_result.detected_items_label"
            defaultMessage="à contrôler"
            style={{
              fontSize  : 18,
              fontWeight: '300',
            }}
          />
        </View>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanResultScreen)
