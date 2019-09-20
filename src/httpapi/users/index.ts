import { IRequestBuilder }    from '../http'
import { User, UserSettings } from '../index'

type CreateResult = { success: true, token: string, user: User }
                  | { success: false, message: string, reason: { [reasonCode: string]: {} } }

export async function create(http: IRequestBuilder, email: string, password: string): Promise<CreateResult> {
    const resp = await http.post('/users', { email, password }, { customError: true })
    return await resp.json()
}

export async function getMyProfile(http: IRequestBuilder): Promise<User> {
    const resp     = await http.get('/users/me')
    const {result} = await resp.json()
    return result
}

interface PatchUser {
    first_name?: string
    last_name?: string
    lang?: string
}

export async function patchMyProfile(http: IRequestBuilder, patch: PatchUser): Promise<User> {
    const resp            = await http.patch('/users/me', patch as any)
    const {user: newUser} = await resp.json()
    return newUser
}

export async function destroyUser(http: IRequestBuilder): Promise<boolean> {
    const resp     = await http.delete('/users/me')
    const {result} = await resp.json()
    return result
}

export async function getSettings(http: IRequestBuilder): Promise<UserSettings> {
    const resp     = await http.get('/users/me/settings')
    const {result} = await resp.json()
    return result
}

export async function replaceSettings(http: IRequestBuilder, settings: UserSettings): Promise<UserSettings> {
    const resp     = await http.post('/users/me/settings', {
        settings: {...settings},
    })
    const {result} = await resp.json()
    return result
}

export async function destroy(http: IRequestBuilder): Promise<void> {
    await http.delete('/users/me')
}

export async function subscribeNotifications(http: IRequestBuilder, token: string, os: string): Promise<boolean> {
    const resp      = await http.post('/users/me/notifications', {
        token,
        os,
    })
    const {success} = await resp.json()
    return success
}

export async function lostPassword(http: IRequestBuilder, email: string): Promise<void> {
    await http.post('/user/security/lostPassword', {email})
}

export async function recoverPassword(http: IRequestBuilder, password: string): Promise<void> {
    await http.post('/user/security/password', {password})
}
