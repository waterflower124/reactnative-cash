import { IRequestBuilder }                     from '../http'
import { SocialInterest, Status, UserAccount } from '../index'

export interface FetchFilters {
  status?: Status
  account?: UserAccount['id']
  page?: number
}

export interface FetchResponse {
  success: true
  results: SocialInterest[]
  current_page: number
  results_per_page: number
  number_of_pages: number
  total_number_of_results: number
}

export interface UpdateStatusResponse {
  success: boolean
  result?: SocialInterest
}

export async function fetch(
  http: IRequestBuilder,
  filters: FetchFilters,
): Promise<FetchResponse> {
  const resp = await http.get('/social/ads/interests', filters)
  return resp.json()
}

export async function updateStatus(http: IRequestBuilder, interest: SocialInterest, skip: boolean): Promise<UpdateStatusResponse> {
  const resp = await http.post(`/social/ads/interests/${interest.id}/status`, { status: skip ? 'skip' : 'keep' })
  return resp.json()
}

export async function multiUpdateStatus(
  http: IRequestBuilder,
  socialInterests: SocialInterest[],
  status: Status,
): Promise<void> {
  const ids = socialInterests.map((socialInterest: SocialInterest) => socialInterest.id)
  const body = status === 'keep'
    ? { 'keep': ids }
    : { 'skip': ids }

  await http.post('/social/ads/interests/status', body)
}

export async function fetchAds(
  http: IRequestBuilder,
  interestId: number,
): Promise<Array<string>> {
  const resp = await http.get(`/social/ads/interests/${interestId}/ads`)
  if (resp.status >= 400) {
    throw new Error('cannot fetch ads')
  }
  const data = await resp.json()
  return data.results
}
