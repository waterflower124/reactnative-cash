import { IRequestBuilder } from '../http'

interface CheckVersionResponse {
  valid: boolean
}

export async function checkVersion(
  http: IRequestBuilder,
  version: string,
): Promise<CheckVersionResponse> {
  const response = await http.get('/devices/check', {
    appId: 'fr.skeep',
    version,
  })

  return response.json()
}
