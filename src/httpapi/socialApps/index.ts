import { IRequestBuilder }                                     from '../http'
import { SocialApp, SocialAppPermission, Status, UserAccount } from '../index'

export interface GetSocialAppsRequestOptions {
    status?: Status,
    refresh?: boolean
    account?: UserAccount['id']
    page?: number
}

export interface GetSocialAppsSuccess {
    results: Array<SocialApp>
    current_page: number
    results_per_page: number
    number_of_pages: number
    total_number_of_results: number
}

export interface TogglePermissionSuccess {
    success: true,
    enable: boolean,
    socialApp: SocialApp
}

export interface UpdateStatusSuccess {
    success: boolean,
    socialApp: SocialApp,
}

export interface TogglePermissionRequest {
    socialApp: SocialApp
    permission: SocialAppPermission
}

export interface UpdateStatusRequest {
    socialApp: SocialApp
    status: Status
}

type GetSocialAppResult = GetSocialAppsSuccess
type TogglePermissionResult = TogglePermissionSuccess
type UpdateStatusResult = UpdateStatusSuccess

export async function fetch(http: IRequestBuilder, options?: GetSocialAppsRequestOptions): Promise<GetSocialAppResult> {
    const resp = await http.get('/social/apps', {...options})
    return resp.json()
}

export async function togglePermission(http: IRequestBuilder, request: TogglePermissionRequest): Promise<TogglePermissionResult> {
    const resp = await http.patch(`/social/apps/${request.socialApp.id}/permissions/${request.permission.name}`)
    return resp.json()
}

export async function multiTogglePermission(http: IRequestBuilder, app: SocialApp, permissions: {[permissionName: string]: boolean }): Promise<void> {
    const enabled = []
    const disabled = []
    for (const permissionName in permissions) {
        if (!permissions.hasOwnProperty(permissionName)) {
            continue
        }

        if (permissions[permissionName]) {
            enabled.push(permissionName)
        } else {
            disabled.push(permissionName)
        }
    }

    await http.patch(`/social/apps/${app.id}/permissions`, { enabled, disabled })
}

export async function updateStatus(http: IRequestBuilder, app: SocialApp, skip: boolean): Promise<UpdateStatusResult> {
    const resp = await http.post(`/social/apps/${app.id}/status`, {
        status: skip ? 'skip' : 'keep',
    })

    return resp.json()
}

export async function multiUpdateStatus(http: IRequestBuilder, socialApps: SocialApp[], status: Status): Promise<void> {
    await http.post('/social/apps/status', {
        [status]: socialApps.map(a => a.id),
    })
}
