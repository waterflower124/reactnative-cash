export type AuthToken = string
export type Status = 'keep' | 'skip'
export type NewsletterFrequency = 'asap' | 'daily' | 'weekly' | 'monthly' | 'never'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  lang: string
  created_at: string
}

export interface Provider {
  id: number
  name: string
}

export interface UserAccount {
  _id: number,
  id: string
  email: string
  provider: Provider
  keep_count: number
  skip_count: number
  created_at: string
}

export interface UserAccountStats {
  detected_items: number
  detected_items_details: {
    subscriptions: number,
    apps: number,
    interests: number,
    advertisers: number,
    pictures: number,
  }
  working_items: number
  working_items_details: {
    subscriptions: number,
    apps: number,
    interests: number,
    advertisers: number,
    pictures: number,
  }
}

export interface Subscription {
  id: number
  appeared_at: string
  newsletter: Newsletter
  seen_at: string
  state: SubscriptionState
  status: Status
  last_message: Message
  unwanted_emails: number
  total_emails: number
  opening_rate: number
  unsubscribe_message: Message
  complaint_action: SubscriptionAction
}

export type SubscriptionState = 'pending' | 'processing' | 'complaint'

export type SubscriptionAction = 'connect' | 'complaint_mail'

export interface Newsletter {
  id: number
  name: string
  email: string
  logo_url: string|null
  account_url: string|null
  description: string|null
  type: string
  user_infos: Array<NewsletterUserInfo>
  confidence_percentage: number
}

export enum NewsletterUserInfo {
  Name          = <any> 'name',
  PostalAddress = <any> 'postal_address',
  BirthDate     = <any> 'birth_date',
  Location      = <any> 'location',
}

export interface Message {
  id: number
  content_types: Array<string>
  sender: string
  sent_at: string
}

export interface SocialApp {
  id: number
  vendor_uid: string
  name: string
  logo_url: string
  status: Status
  permissions: Array<SocialAppPermission>
}

export interface SocialAppPermission {
  name: string
  required: boolean
  disabled: boolean
  description: string
}

export interface UserSettings {
  newsletter_freq: NewsletterFrequency
  notify_newsletters: boolean
  notify_processing_newsletters: boolean
}

export interface SocialInterest {
  id: number
  name: string
  image_url: string
  description: string
  topic: string
  disambiguation_category: string
}

export interface SocialAdvertiser {
  id: number
  name: string
  ca_type: 'CLICKED' | 'REGULAR' | 'REMARKETING'
  source_url: string
  image_url: string
}

export interface SocialPicture {
  id: number
  date: string
  creator: string
  creator_avatar_url: string
  tagged: Array<string>
  visibility: string
  amount_comments: string
  amount_reactions: string
  url: string
  owning: boolean
}

export interface Announce {
  id: number
  title: string
  content: string
  logo_url: string
}

export interface SponsorAdvertiser {
  id: number
  name: string
  logo_url: string
}

export enum SponsoredDealPlatform {
  Instagram = 'instagram',
  Facebook = 'facebook',
}

export type SponsoredDealRule
  = { type: 'rule', description: string }
  | { type: 'tag', name: string }
  | { type: 'platform', platform: SponsoredDealPlatform }

export interface Money {
  amount: number // expressed as cents (eg. when amount=100,currency=EUR then it means 1€)
  currency: string
}

export interface SponsoredDeal {
  deal_rules: {
    fr: string,
    en: string,
  },
  deal_background_url: string,
  fees: number,
  advertiser_logo_url: string,
  advertiser_name: string,
  id: number
  advertiser: SponsorAdvertiser
  rules: Array<SponsoredDealRule>
  profit: Money
  photo: string
}

export interface BankAccount {
  id: string
  alias: string
  valid: boolean
}
