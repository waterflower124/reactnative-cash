import { IRequestBuilder }                    from '../http'
import { SocialPicture, Status, UserAccount } from '../index'

export interface FetchFilters {
    status?: Status
    account?: UserAccount['id']
    page?: number
}

export interface FetchResponse {
    success: true
    results: Array<SocialPicture>
    loading: boolean
    current_page: number
    page_size: number
    total_size: number
}

export interface UpdateStatusResponse {
    success: boolean
}

export async function fetch(
    http: IRequestBuilder,
    filters: FetchFilters,
): Promise<FetchResponse> {
    const resp = await http.get('/social/profile/pictures', filters)
    return resp.json()
}

export async function updateStatus(http: IRequestBuilder, picture: SocialPicture, skip: boolean): Promise<UpdateStatusResponse> {
    const resp = await http.post(`/social/profile/pictures/status`, {
        [skip ? 'skip' : 'keep']: [picture.id],
    })
    return resp.json()
}
