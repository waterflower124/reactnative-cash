import { BankAccount, Money } from '../../httpapi'

export interface Transaction {
    advertiser_logo_url: string,
    advertiser_name: string,
    status: string
    fees: number,
    amount: Money
}

export interface State {
    balance: PromiseState<Money>
    transactions: PromiseState<Array<Transaction>>
    bankAccounts: PromiseState<Array<BankAccount>>
    creatingBankAccount?: PromiseState<void>
    selectedBankAccount: BankAccount | null
    withdrawing?: PromiseState<void>
}

export type Action
    = { type: '@Skeep/wallet--LOAD_BALANCE_REQUEST' }
    | { type: '@Skeep/wallet--LOAD_BALANCE_FAILURE', error: Error }
    | { type: '@Skeep/wallet--LOAD_BALANCE_SUCCESS', balance: Money, transactions: Array<Transaction> }
    | { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_REQUEST' }
    | { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_FAILURE', error: Error }
    | { type: '@Skeep/wallet--LOAD_BANK_ACCOUNTS_SUCCESS', bankAccounts: Array<BankAccount> }
    | { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_REQUEST' }
    | { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_FAILURE', error: Error }
    | { type: '@Skeep/wallet--CREATE_BANK_ACCOUNT_SUCCESS' }
    | { type: '@Skeep/wallet--SELECT_BANK_ACCOUNT', bankAccount: BankAccount }
    | { type: '@Skeep/wallet--UNSELECT_BANK_ACCOUNT' }
    | { type: '@Skeep/wallet--WITHDRAW_REQUEST' }
    | { type: '@Skeep/wallet--WITHDRAW_FAILURE', error: Error }
    | { type: '@Skeep/wallet--WITHDRAW_SUCCESS' }

export { reducers } from './reducers'
