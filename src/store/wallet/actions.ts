/* tslint:disable: variable-name */
import { BankAccount, Money } from '../../httpapi'
import { createHttpApi } from '../http'
import { Thunk } from '../index'
import { Action, Transaction } from './index'

export function loadBalanceRequest(): Action {
  return { type: '@Skeep/wallet--LOAD_BALANCE_REQUEST' }
}

export function loadBalanceFailure(error: Error): Action {
  return { type: '@Skeep/wallet--LOAD_BALANCE_FAILURE', error }
}

export function loadBalanceSuccess(balance: Money, transactions: Array<Transaction>): Action {
  return { type: '@Skeep/wallet--LOAD_BALANCE_SUCCESS', balance, transactions }
}

export function loadBankAccountsRequest(): Action {
  return { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_REQUEST' }
}

export function loadBankAccountsFailure(error: Error): Action {
  return { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_FAILURE', error }
}

export function loadBankAccountsSuccess(bankAccounts: Array<BankAccount>): Action {
  return { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_SUCCESS', bankAccounts }
}

export function createBankAccountRequest(): Action {
  return { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_REQUEST' }
}

export function createBankAccountFailure(error: Error): Action {
  return { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_FAILURE', error }
}

export function createBankAccountSuccess(): Action {
  return { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_SUCCESS' }
}

export function selectBankAccount(bankAccount: BankAccount): Action {
  return { type: '@Skeep/wallet--SELECT_BANK_ACCOUNT', bankAccount }
}

export function unselectBankAccount(): Action {
  return { type: '@Skeep/wallet--UNSELECT_BANK_ACCOUNT' }
}

export function withdrawRequest(): Action {
  return { type: '@Skeep/wallet--WITHDRAW_REQUEST' }
}

export function withdrawFailure(error: Error): Action {
  return { type: '@Skeep/wallet--WITHDRAW_FAILURE', error }
}

export function withdrawSuccess(): Action {
  return { type: '@Skeep/wallet--WITHDRAW_SUCCESS' }
}

export function loadBalance(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http = createHttpApi(state)

    dispatch(loadBalanceRequest())
    try {
      const resp = await http.get(`/accounts/${state.navigation.currentAccount._id}/summary`)
      const data = await resp.json()

      dispatch(loadBalanceSuccess(data.balance, data.transactions))
    } catch (err) {
      dispatch(loadBalanceFailure(err))
    }
  }
}

export function loadBankAccounts(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http = createHttpApi(state)

    dispatch(loadBankAccountsRequest())
    try {
      const resp = await http.get('/sponsored/users/me/bankAccounts')
      const data = await resp.json()

      if (data.results instanceof Array) {
        dispatch(loadBankAccountsSuccess(data.results))
      } else {
        dispatch(loadBankAccountsFailure(new Error('Cannot fetch bank accounts')))
      }
    } catch (err) {
      dispatch(loadBankAccountsFailure(err))
    }
  }
}

export function createBankAccount(
  iban: string,
  bic: string,
  owner_name: string,
  owner_address: string,
  owner_address2: string,
  owner_city: string,
  owner_postal_code: string,
  owner_region: string,
  owner_country: string,
): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http = createHttpApi(state)

    dispatch(createBankAccountRequest())
    try {
      const resp = await http.post('/sponsored/users/me/bankAccounts', {
        bank_account: {
          iban,
          bic,
          owner_name,
          owner_address,
          owner_address2,
          owner_city,
          owner_postal_code,
          owner_region,
          owner_country,
        },
      })
      const data = await resp.json()

      if (data.success) {
        dispatch(createBankAccountSuccess())
      } else {
        dispatch(createBankAccountFailure(new Error('Cannot create bank account')))
      }
    } catch (err) {
      dispatch(createBankAccountFailure(err))
    }
  }
}

export function withdraw(bankAccount: BankAccount, amount: number): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const http = createHttpApi(state)

    dispatch(withdrawRequest())
    try {
      const resp = await http.post(`/sponsored/users/me/bankAccounts/${bankAccount.id}/payout`, {
        payout: {
          amount: Math.trunc(amount * 100),
        },
      })
      const data = await resp.json()

      if (data.success) {
        dispatch(withdrawSuccess())
      } else {
        dispatch(withdrawFailure(new Error('Cannot create bank account')))
      }
    } catch (err) {
      dispatch(withdrawFailure(err))
    }
  }
}
