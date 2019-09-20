import { User }            from '..'
import { IRequestBuilder } from '../http'

export interface CreateNormalResult {
  success: true
  token: string
  user: User
}

export interface CreateErrorResult {
  success: false
  message: string
  reason: ErrorReasons
}

type CreateResult = CreateNormalResult | CreateErrorResult

export async function create(http: IRequestBuilder, email: string, password: string, lang?: string): Promise<CreateResult> {
    const resp = await http.post('/sessions', {email, password, lang}, {customError: true})
    return resp.json()
}

export async function destroy(http: IRequestBuilder): Promise<boolean> {
  const resp = await http.delete('/sessions')
  const {success} = await resp.json()
  return success
}
