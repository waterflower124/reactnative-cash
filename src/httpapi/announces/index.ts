import { Language } from '../../translate'
import { IRequestBuilder } from '../http'
import { Announce } from '../index'

export async function fetchLast(
  http: IRequestBuilder,
  since: number,
  lang: Language,
): Promise<Announce> {
  const response = await http.get('/announces', {
    since,
    lang,
  })

  const json = await response.json() as { results: Announce[] }

  return json.results.slice().pop()
}
