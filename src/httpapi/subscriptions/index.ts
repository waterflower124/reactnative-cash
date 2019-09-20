import { IRequestBuilder } from '../http'
import { Message, Status, Subscription, SubscriptionState, UserAccountStats } from '../index'

interface FetchResult {
  results: Subscription[]
  loading: boolean
  page_size: number
  total_size: number
}

interface FetchFilters {
  account?: string
  state?: SubscriptionState
  page?: number
  status?: Status
  refresh?: boolean
  ignoredSubscriptionIds?: number[]
}

interface UpdateStatusResult {
  success: boolean
  result: Subscription
}

interface SendComplaintResult {
  success: boolean
}

interface MultiUpdateStatusResult {
  success: boolean
  stats: {
    [accountId: string]: UserAccountStats,
  }
}

export async function fetch(http: IRequestBuilder, filters: FetchFilters): Promise<FetchResult> {
  const resp = await http.get('/subscriptions', filters)
  return resp.json()
}

export async function getMessageList(http: IRequestBuilder, subscriptionId: number): Promise<Array<Message>> {
  const resp = await http.get(`/subscriptions/${subscriptionId}/messages`)
  const data = await resp.json()
  return data.results
}

export async function getMessageContent(http: IRequestBuilder, subscriptionId: number, messageId: number, contentType: string): Promise<string> {
  const resp = await http.get(`/subscriptions/${subscriptionId}/messages/${messageId}/content`, {}, {
    headers: {
      'accept': contentType,
    },
  })
  return resp.text()
}

export async function updateStatus(http: IRequestBuilder, subscription: Subscription, unsubscribe: boolean): Promise<UpdateStatusResult> {
  const resp = await http.post(`/subscriptions/${subscription.id}/status`, { unsubscribe })
  return resp.json()
}

export async function multiUpdateStatus(
  http: IRequestBuilder,
  subscriptions: Subscription[],
  status: Status,
): Promise<MultiUpdateStatusResult> {
  const ids = subscriptions.map((subscription: Subscription) => subscription.id)
  const resp = await http.post('/subscriptions/status', { [status]: ids })
  return resp.json()
}

// TODO: Internationalization
export async function sendComplaint(http: IRequestBuilder, subscription: Subscription): Promise<SendComplaintResult> {
  const resp = await http.post(`/subscriptions/${subscription.id}/complaints`, {
    subject: 'Opposition à recevoir des publicités par courrier électronique',
    body: 'Madame, Monsieur,\n\n'
      + 'Conformément aux dispositions de l’article 38 alinéa 2 de la loi du 6 janvier 1978 modifiée, '
      + ' je vous remercie de bien vouloir supprimer mes coordonnées de vos fichiers d’envoi de publicités.\n\n'
      + ' Je vous rappelle que vous disposez d’un délai maximal de deux mois suivant la réception de ce courrier pour répondre à ma demande, '
      + ' conformément à l’article 94 du décret du 20 octobre 2005 pris pour l’application de la loi "Informatique et Libertés".\n\n'
      + ' Je vous prie d’agréer, Madame, Monsieur, l’expression de mes salutations distinguées.\n\nP.J : Copie de la publicité reçue',
  })
  return resp.json()
}
