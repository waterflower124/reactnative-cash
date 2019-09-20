import moment                    from 'moment'
import React                     from 'react'
import { NavigationScreenProps } from 'react-navigation'
import * as redux                from 'react-redux'
import { Dispatch, State }       from '../store'

import {
  ScrollView,
  StatusBar,
  StyleSheet,
}                                  from 'react-native'
import { CountryPicker }           from '../components/CountryPicker'
import { DatePicker }              from '../components/DatePicker'
import { GradientButton }          from '../components/GradientButton'
import { Message }                 from '../components/Message'
import { RegularHeader }           from '../components/RegularHeader'
import { SafeAreaView }            from '../components/SafeAreaView'
import { ScrollViewAvoidKeyboard } from '../components/ScrollViewAvoidKeyboard'
import { TextInput }               from '../components/TextInput'
import { Header }                  from '../containers/Header'

import * as dealsActions from '../store/deals/actions'

interface MonetizationConfigureScreenProps extends NavigationScreenProps {
  settingUp?: PromiseState<void>

  onSubmit(screenState: Readonly<ScreenState>): Promise<EntityValidationError | void>
}

interface ScreenState {
  form: {
    first_name: string
    last_name: string
    mobile: string
    address1: string
    address2: string
    city: string
    region: string
    postal_code: string
    country: string // ISO 3166-1 alpha-2
    birthday?: Date
    nationality: string, // ISO 3166-1 alpha-2
  }

  lastError?: EntityValidationError
}

class MonetizationConfigureScreen extends React.Component<MonetizationConfigureScreenProps, ScreenState> {
  public readonly state: ScreenState = {
    form: {
      first_name : '',
      last_name  : '',
      mobile     : '',
      address1   : '',
      address2   : '',
      city       : '',
      region     : '',
      postal_code: '',
      country    : '', // ISO 3166-1 alpha-2
      birthday   : undefined, // Y-M-D
      nationality: '', // ISO 3166-1 alpha-2
    },
  }

  private scrollView: ScrollView | null = null

  public static mapStateToProps(state: State): Partial<MonetizationConfigureScreenProps> {
    return {
      settingUp: state.deals.settingUp,
    }
  }

  public static mapDispatchToProps(dispatch: Dispatch): Partial<MonetizationConfigureScreenProps> {
    return {
      onSubmit(state) {
        return dispatch(dealsActions.setupMonetization({
          ...state.form,
          birthday            : moment(state.form.birthday).format('Y-M-D'),
          country_of_residence: state.form.country,
        }))
      },
    }
  }

  public render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content"/>

        <Header style={styles.headerContainer} color="dark">
          <RegularHeader/>
        </Header>

        <ScrollViewAvoidKeyboard
          theRef={x => x && (this.scrollView = x._component)}
          contentContainerStyle={styles.content}>
          <Message
            id="screens.monetization_configure.disclaimer"
            defaultMessage="Please enter following information in order for us to send you money."
            style={styles.disclaimer}
          />

          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.first_name_placeholder"
            placeholderDefault="First Name*"
            value={this.state.form.first_name}
            onChangeText={this.onUpdateState('first_name')}
            error={this.state.lastError && this.state.lastError.field === 'first_name' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.last_name_placeholder"
            placeholderDefault="Last Name*"
            value={this.state.form.last_name}
            onChangeText={this.onUpdateState('last_name')}
            error={this.state.lastError && this.state.lastError.field === 'last_name' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="phone-pad"
            placeholderId="screens.monetization_configure.mobile_placeholder"
            placeholderDefault="Mobile*"
            value={this.state.form.mobile}
            onChangeText={this.onUpdateState('mobile')}
            error={this.state.lastError && this.state.lastError.field === 'mobile' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.address1_placeholder"
            placeholderDefault="Address*"
            value={this.state.form.address1}
            onChangeText={this.onUpdateState('address1')}
            error={this.state.lastError && this.state.lastError.field === 'address1' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.address2_placeholder"
            placeholderDefault="Address 2 (optional)"
            value={this.state.form.address2}
            onChangeText={this.onUpdateState('address2')}
            error={this.state.lastError && this.state.lastError.field === 'address2' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.city_placeholder"
            placeholderDefault="City*"
            value={this.state.form.city}
            onChangeText={this.onUpdateState('city')}
            error={this.state.lastError && this.state.lastError.field === 'city' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.region_placeholder"
            placeholderDefault="Region*"
            value={this.state.form.region}
            onChangeText={this.onUpdateState('region')}
            error={this.state.lastError && this.state.lastError.field === 'region' && this.state.lastError}
            style={styles.input}
          />
          <TextInput
            type="default"
            placeholderId="screens.monetization_configure.postal_code_placeholder"
            placeholderDefault="Postal Code*"
            value={this.state.form.postal_code}
            onChangeText={this.onUpdateState('postal_code')}
            error={this.state.lastError && this.state.lastError.field === 'postal_code' && this.state.lastError}
            style={styles.input}
          />
          <CountryPicker
            type="default"
            placeholderId="screens.monetization_configure.country_placeholder"
            placeholderDefault="Country*"
            value={this.state.form.country}
            onChangeText={this.onUpdateState('country')}
            error={this.state.lastError && this.state.lastError.field === 'country' && this.state.lastError}
            style={styles.input}
          />
          <DatePicker
            placeholderId="screens.monetization_configure.birthday_placeholder"
            placeholderDefault="Birthday*"
            date={this.state.form.birthday}
            onChange={this.onUpdateState('birthday')}
            error={this.state.lastError && this.state.lastError.field === 'birthday' && this.state.lastError}
            style={styles.input}
          />
          <CountryPicker
            type="default"
            placeholderId="screens.monetization_configure.nationality_placeholder"
            placeholderDefault="Nationality*"
            value={this.state.form.nationality}
            onChangeText={this.onUpdateState('nationality')}
            error={this.state.lastError && this.state.lastError.field === 'nationality' && this.state.lastError}
            style={styles.input}
          />

          <GradientButton
            textId="screens.monetization_configure.submit"
            textDefault="LET'S GO"
            onPress={this.onSubmit}
            loading={this.props.settingUp && this.props.settingUp._ === 'loading'}
          />
        </ScrollViewAvoidKeyboard>
      </SafeAreaView>
    )
  }

  private onUpdateState = <K extends keyof ScreenState['form']>(fieldName: K) => (value: ScreenState['form'][K]) => {
    this.setState({
      form: { ...this.state.form, [fieldName]: value },
    })
  }

  private onSubmit = async () => {
    const error = await this.props.onSubmit(this.state)
    if (error) {
      this.setState({ lastError: error })
      if (this.scrollView) {
        this.scrollView.scrollTo({x: 0, y: 0, animated: true})
      }
    }
  }
}

export default redux.connect
(MonetizationConfigureScreen.mapStateToProps, MonetizationConfigureScreen.mapDispatchToProps)
(MonetizationConfigureScreen)

const styles = StyleSheet.create({
  container      : {
    flex           : 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    alignSelf : 'stretch',
    alignItems: 'center',
  },
  headerText     : {
    borderWidth    : 1,
    borderColor    : '#041f43',
    color          : '#041f43',
    borderRadius   : 5,
    fontSize       : 12,
    marginTop      : 10,
    paddingVertical: 5,
    width          : 120,
    textAlign      : 'center',
  },
  disclaimer     : {
    color       : '#041f43',
    textAlign   : 'center',
    marginBottom: 30,
  },
  content        : {
    paddingHorizontal: 20,
    marginTop        : 30,
    paddingBottom    : 60,
  },
  input          : {
    marginBottom: 30,
  },
})
