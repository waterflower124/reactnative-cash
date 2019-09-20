import { State }                                                  from '.'
import AppConfig                                                  from '../config'
import { IRequestBuilder, RequestBuilder, SignedRequestBuilder }  from '../httpapi/http'

/**
 * @description Returns token.
 * @param token
 */
export function createHttpForTokenApi(token: string): IRequestBuilder {
  return new SignedRequestBuilder(AppConfig.apiUrl, token)
}

/**
 * @description HTTP Factory.
 * @param state
 */
export function createHttpApi(state: State): IRequestBuilder {
  return state.session.token ? createHttpForTokenApi(state.session.token) : new RequestBuilder(AppConfig.apiUrl)
}

/**
 * @description Returns token.
 * @param token
 */
export function createHttpForTokenApiBackOffice(token: string): IRequestBuilder {
  return new SignedRequestBuilder(AppConfig.apiBackOfficeUrl, token)
}

/**
 * @description HTTP Factory.
 * @param state
 */
export function createHttpApiBackOffice(state: State): IRequestBuilder {
  return state.session.token ? createHttpForTokenApiBackOffice(state.session.token) : new RequestBuilder(AppConfig.apiBackOfficeUrl)
}
