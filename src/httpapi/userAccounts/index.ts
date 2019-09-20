import { IRequestBuilder } from '../http'

import {
  UserAccount,
  UserAccountStats,
} from '../index'

export interface CreateNormalResult {
  success: true
  result: UserAccount
}

export interface CreateErrorResult {
  success: false
  provider: undefined
  message: string
  reason: { [reasonCode: string]: Object }
}

type CreateResult = CreateNormalResult | CreateErrorResult

export async function getMyAccounts(http: IRequestBuilder): Promise<Array<UserAccount>> {
  const resp      = await http.get('/accounts')
  const {results} = await resp.json()
  return results
}

export async function createEmail(http: IRequestBuilder, email: string, password: string): Promise<CreateResult> {
  const resp = await http.post('/accounts', {email, password, options: {email: true}}, {customError: true})
  return resp.json()
}

export async function createFacebook(http: IRequestBuilder, email: string, password: string, cookies: {}): Promise<CreateResult> {
  const resp = await http.post('/accounts', {email, password, cookies, options: {facebook: true}}, {customError: true})
  return resp.json()
}

export async function createInstagram(http: IRequestBuilder, email: string, password: string): Promise<CreateResult> {
  const resp = await http.post('/accounts', {email, password, options: {instagram: true}}, {customError: true})
  return resp.json()
}

export async function destroy(http: IRequestBuilder, accountId: string): Promise<boolean> {
  const resp      = await http.delete(`/accounts/${accountId}`)
  const {success} = await resp.json()
  return success
}

export async function getStats(http: IRequestBuilder, accountId: string): Promise<UserAccountStats> {
  const resp = await http.get(`/accounts/${accountId}/stats`)
  return resp.json()
}

export async function refresh(http: IRequestBuilder, accountId: string): Promise<UserAccountStats> {
  const response = await http.post(`/accounts/${accountId}/refresh`)
  return response.json()
}
