import { IRequestBuilder }                       from '../http'
import { SocialAdvertiser, Status, UserAccount } from '../index'

interface GetSocialAdvertisersParameters {
    account: UserAccount['id']
    status?: Status
    refresh?: boolean
    page?: number
}

interface GetSocialAdvertisersResponse {
    success: boolean
    results: SocialAdvertiser[]
    current_page: number
    results_per_page: number
    number_of_pages: number
    total_number_of_results: number
}

interface UpdateSocialAdvertiserStatusResponse {
    success: boolean
    results: SocialAdvertiser
}

export async function fetch(
    http: IRequestBuilder,
    parameters: GetSocialAdvertisersParameters,
): Promise<GetSocialAdvertisersResponse> {
    const response = await http.get('/social/ads/advertisers', parameters)
    return response.json()
}

export async function updateSocialAdvertiserStatus
    (http: IRequestBuilder, advertiser: SocialAdvertiser, skip: boolean)
    : Promise<UpdateSocialAdvertiserStatusResponse> {
    const response = await http.post(
        `/social/ads/advertisers/${advertiser.id}/status`,
        {status: skip ? 'skip' : 'keep'},
    )

    if (!response.ok) {
        throw new Error('httpapi.socialAdvertisers.updateStatusError')
    }

    return response.json()
}

export async function multiUpdateStatus(http: IRequestBuilder, socialAdvertisers: SocialAdvertiser[], status: Status): Promise<void> {
    await http.post('/social/ads/advertisers/status', {
        [status]: socialAdvertisers.map(ad => ad.id),
    })
}
