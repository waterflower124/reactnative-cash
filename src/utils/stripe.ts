import { NativeModules } from 'react-native'
import AppConfig from '../config'

interface Address {
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country?: string
}

interface Birthday {
    day: number
    month: number
    year: number
}

interface LegalEntity {
    business_name?: string
    business_tax_id?: string
    first_name: string
    last_name: string
    address: Address
    personal_address?: Address
    dob?: Birthday
    type?: 'individual' | 'company'
    verification?: {
        document: string;
    }
}

interface AccountTokenOptions {
    business_name?: string
    legal_entity: LegalEntity
    tos_shown_and_accepted: boolean
}

export function createTokenWithConnectAccount(options: AccountTokenOptions): Promise<string> {
    return NativeModules.Skeep.createStripeTokenForAccount(AppConfig.stripeKey, options)
}