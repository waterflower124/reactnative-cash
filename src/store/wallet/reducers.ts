import { Action, State } from './index'

const initialState: State = {
    balance: { _: 'loading' },
    transactions: { _: 'loading' },
    bankAccounts: { _: 'loading' },
    selectedBankAccount: null,
}

export function reducers(state: State = initialState, action: Action): State {
    switch (action.type) {
        case '@Skeep/wallet--LOAD_BALANCE_REQUEST':
            return {
                ...state,
                balance: { _: 'loading' },
            }

        case '@Skeep/wallet--LOAD_BALANCE_FAILURE':
            return {
                ...state,
                balance: { _: 'failure', error: action.error },
            }

        case '@Skeep/wallet--LOAD_BALANCE_SUCCESS':
            return {
                ...state,
                balance: { _: 'success', item: action.balance },
                transactions: { _: 'success', item: action.transactions },
            }

        case '@Skeep/wallet--LOAD_BANK_ACCOUNTS_REQUEST':
            return {
                ...state,
                bankAccounts: { _: 'loading' },
            }

        case '@Skeep/wallet--LOAD_BANK_ACCOUNTS_FAILURE':
            return {
                ...state,
                bankAccounts: { _: 'failure', error: action.error },
            }

        case '@Skeep/wallet--LOAD_BANK_ACCOUNTS_SUCCESS':
            return {
                ...state,
                bankAccounts: { _: 'success', item: action.bankAccounts },
            }

        case '@Skeep/wallet--SELECT_BANK_ACCOUNT':
            return {
                ...state,
                selectedBankAccount: action.bankAccount,
            }

        case '@Skeep/wallet--UNSELECT_BANK_ACCOUNT':
            return {
                ...state,
                selectedBankAccount: null,
            }

        case '@Skeep/wallet--CREATE_BANK_ACCOUNT_REQUEST':
            return {
                ...state,
                creatingBankAccount: { _: 'loading' },
            }

        case '@Skeep/wallet--CREATE_BANK_ACCOUNT_FAILURE':
            return {
                ...state,
                creatingBankAccount: { _: 'failure', error: action.error },
            }

        case '@Skeep/wallet--CREATE_BANK_ACCOUNT_SUCCESS':
            return {
                ...state,
                creatingBankAccount: { _: 'success', item: void(0) },
            }

        case '@Skeep/wallet--WITHDRAW_REQUEST':
            return {
                ...state,
                withdrawing: { _: 'loading' },
            }

        case '@Skeep/wallet--WITHDRAW_FAILURE':
            return {
                ...state,
                withdrawing: { _: 'failure', error: action.error },
            }

        case '@Skeep/wallet--WITHDRAW_SUCCESS':
            return {
                ...state,
                withdrawing: { _: 'success', item: void(0) },
            }

        default:
            return state
    }
}
