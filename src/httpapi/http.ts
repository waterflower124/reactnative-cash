import querystring   from 'querystring'
import { AuthToken } from '.'

interface RequestBuilderInit extends RequestInit {
  customError?: boolean
}

export interface IRequestBuilder {
  get(uri: string, body?: Object, options?: RequestBuilderInit): Promise<Response>
  post(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response>
  patch(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response>
  put(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response>
  delete(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response>
}

export class HttpError extends Error {
  name = 'HttpError'

  public constructor(public readonly status: number, public readonly msg: string, public readonly payload: {}) {
    super(msg)
  }
}

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export class RequestBuilder implements IRequestBuilder {
  public constructor(private readonly baseUri: string) {
  }

  public async fetch(uri: string, options: RequestBuilderInit): Promise<Response> {
    const iterationDuration = 1000
    const maxIterations     = 60 * 5

    const respPromise = fetch(uri, options)

    for (let i = 0; i < maxIterations; i++) {
      const first = await Promise.race([respPromise, sleep(iterationDuration)])

      if (first instanceof Response) {
        console.log(`[${options.method}] (${first.status}) - ${uri}`)
        return this.transformResponse(first, options)
      } else if ((i % 10) === 0) {
        console.log(`Waiting for ["${options.method}] - ${uri}"...`)
      }
    }

    throw new Error('Request Timeout')
  }

  public computeRequest(_uri: string, options?: RequestBuilderInit): RequestBuilderInit {
    return options
  }

  public async transformResponse(resp: Response, options: RequestBuilderInit): Promise<Response> {
    if (resp.status >= 400 && !options.customError) {
      const data = await resp.text()

      let message: string = data
      let payload: {[key: string]: any} = {}
      try {
        payload = JSON.parse(data)
        if (typeof payload.message === 'string') {
          message = payload.message
        } else {
          message = ''
        }
      } catch {/* ignored */}

      throw new HttpError(resp.status, message, payload)
    }

    return resp
  }

  public get(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response> {
    return this.fetch(this.baseUri + uri + '?' + querystring.stringify(body), this.computeRequest(uri, {
      ...options,
      method: 'GET',
    }))
  }

  public post(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response> {
    return this.fetch(this.baseUri + uri, this.computeRequest(uri, {
      ...options,
      method : 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body   : JSON.stringify(body || {}),
    }))
  }

  public patch(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response> {
    return this.fetch(this.baseUri + uri, this.computeRequest(uri, {
      ...options,
      method : 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body   : JSON.stringify(body || {}),
    }))
  }

  public put(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response> {
    return this.fetch(this.baseUri + uri, this.computeRequest(uri, {
      ...options,
      method : 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body   : JSON.stringify(body || {}),
    }))
  }

  public delete(uri: string, body?: {}, options?: RequestBuilderInit): Promise<Response> {
    return this.fetch(this.baseUri + uri, this.computeRequest(uri, {
      ...options,
      method : 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body   : JSON.stringify(body || {}),
    }))
  }
}

export class SignedRequestBuilder extends RequestBuilder {
  public static signRequestHeaders(headers: {}, sessionToken: AuthToken): {} {
    return {
      ...headers,
      'authentication': `bearer ${sessionToken}`,
    }
  }

  public constructor(baseUri: string, private readonly token: AuthToken) {
    super(baseUri)
  }

  public computeRequest(_uri: string, options?: RequestBuilderInit): RequestBuilderInit {
    return {
      ...options,
      headers: SignedRequestBuilder.signRequestHeaders(options.headers, this.token),
    }
  }
}
