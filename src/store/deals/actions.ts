import { Alert } from 'react-native'
import { Action } from '.'
import { Thunk } from '..'
import { SponsoredDeal } from '../../httpapi'
import translate from '../../translate'
import * as stripe from '../../utils/stripe'
import { createHttpApi, createHttpApiBackOffice } from '../http'
import * as navigationActions from '../navigation/actions'

export function loadCurrentRequest(): Action {
  return {type: '@Skeep/deals--LOAD_CURRENT_REQUEST'}
}

export function loadCurrentSuccess(deal: SponsoredDeal | null): Action {
  return {type: '@Skeep/deals--LOAD_CURRENT_SUCCESS', deal}
}

export function loadCurrentFailure(error: Error): Action {
  return {type: '@Skeep/deals--LOAD_CURRENT_FAILURE', error}
}

export function setupRequest(): Action {
  return {type: '@Skeep/deals--SETUP_REQUEST'}
}

export function setupSuccess(): Action {
  return {type: '@Skeep/deals--SETUP_SUCCESS'}
}

export function setupFailure(error: Error): Action {
  return {type: '@Skeep/deals--SETUP_FAILURE', error}
}

export function acceptDealRequest(): Action {
  return {type: '@Skeep/deals--ACCEPT_DEAL_REQUEST'}
}

export function acceptDealSuccess(): Action {
  return {type: '@Skeep/deals--ACCEPT_DEAL_SUCCESS'}
}

export function acceptDealFailure(error: Error): Action {
  return {type: '@Skeep/deals--ACCEPT_DEAL_FAILURE', error}
}

export function loadCurrent(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)

    dispatch(loadCurrentRequest())
    try {
      const resp = await http.get(`/accounts/${state.navigation.currentAccount._id}/deals`)
      const {deals} = await resp.json()

      if (deals.length === 0) {
        dispatch(loadCurrentSuccess(null))
      } else {
        dispatch(loadCurrentSuccess(deals[0]))
      }
    } catch (err) {
      dispatch(loadCurrentFailure(err))
    }
  }
}

export function acceptDeal(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    dispatch(acceptDealRequest())

    const state = getState()
    const http  = createHttpApi(state)

    const deal = state.deals.current._ === 'success' && state.deals.current.item
    if (!deal) {
      return
    }

    try {
      await http.patch(`/accounts/${state.navigation.currentAccount._id}/deals/${deal.id}`, {status: 'accepted'}, {customError: true})
      Alert.alert(
        translate('screens.monetizationdealsummaryscreen.success.alert.title'),
        translate('screens.monetizationdealsummaryscreen.success.alert.content'),
      )
      await dispatch(loadCurrent())
      dispatch(acceptDealSuccess())
    } catch (e) {
      dispatch(acceptDealFailure(e))
    }
    dispatch(navigationActions.navigateTo('MonetizationDeal', true))
  }
}

export function declineDeal(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http  = createHttpApi(state)

    const deal = state.deals.current._ === 'success' && state.deals.current.item
    if (!deal) {
      return
    }

    await http.patch(`/accounts/${state.navigation.currentAccount._id}/deals/${deal.id}`, {status: 'declined'}, {customError: true})
    await dispatch(loadCurrent())
  }
}

interface SetupMonetization {
  first_name: string
  last_name: string
  mobile: string
  address1: string
  address2: string
  city: string
  region: string
  postal_code: string
  country: string
  birthday: string // Y-m-d
  nationality: string // ISO 3166-1 alpha-2
  country_of_residence: string // ISO 3166-1 alpha-2
}

export function setupMonetization(user: SetupMonetization): Thunk<Promise<EntityValidationError | void>> {
  return async (dispatch, getState) => {
    const http = createHttpApiBackOffice(getState())
    dispatch(setupRequest())
    try {
      const dob = new Date(user.birthday)
      const token = await stripe.createTokenWithConnectAccount({
        legal_entity: {
          type: 'individual',
          first_name: user.first_name,
          last_name: user.last_name,
          address: {
            line1: user.address1,
            line2: user.address2,
            city: user.city,
            state: user.region,
            postal_code: user.postal_code,
            country: user.country,
          },
          dob: user.birthday && ({
            day: dob.getDate(),
            month: dob.getMonth() + 1,
            year: dob.getFullYear(),
          }),
        },
        tos_shown_and_accepted: true,
      })

      const resp  = await http.post('/sponsored/users', {
        user,
        stripe_account_token: token,
      }, {customError: true})
      const data  = await resp.json()

      if (data.success) {
        await dispatch(acceptDeal())
        dispatch(setupSuccess())
      } else if (resp.status >= 400 && resp.status < 500) {
        dispatch(setupSuccess())
        return data.error
      }
    } catch (err) {
      console.warn(err)
      dispatch(setupFailure(err))
    }
  }
}
