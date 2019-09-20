import { createNavigationReducer, createReactNavigationReduxMiddleware }  from 'react-navigation-redux-helpers'
import { applyMiddleware, combineReducers, createStore }                  from 'redux'
import thunkMiddleware                                                    from 'redux-thunk'
import Routes                                                             from '../Routes'
import * as announces                                                     from './announces'
import * as deals                                                         from './deals'
import * as device                                                        from './device'
import httpErrorMiddleware                                                from './httpErrorMiddleware'
import * as items                                                         from './items'
import * as listitems                                                     from './listitems'
import * as navigation                                                    from './navigation'
import persistenceMiddleware                                              from './persistenceMiddleware'
import ravenMiddleware                                                    from './ravenMiddleware'
import * as session                                                       from './session'
import * as wallet                                                        from './wallet'

export interface State {
  nav: {},
  navigation: navigation.State
  session: session.State
  items: items.State
  listitems: listitems.State
  device: device.State
  announces: announces.State
  deals: deals.State
  wallet: wallet.State
}

export interface Thunk<T> {
  (dispatch: Dispatch, getState: () => State): T
}

export type Action = { type?: string } | Thunk<any>

export interface Dispatch {
  <T>(thunk: Thunk<T>): T
  (action: { type?: string }): void
}

const navigationReducer = createNavigationReducer(Routes)

const reducers = combineReducers({
  nav       : navigationReducer,
  navigation: navigation.reducers,
  session   : session.reducers,
  items     : items.reducers,
  listitems : listitems.reducers,
  device    : device.reducers,
  announces : announces.reducers,
  deals     : deals.reducers,
  wallet    : wallet.reducers,
})

const reduxMiddleware = createReactNavigationReduxMiddleware('root', state => state.nav)

export const store = createStore(reducers, applyMiddleware(
  reduxMiddleware,
  persistenceMiddleware(['session', 'device']),
  ravenMiddleware,
  httpErrorMiddleware,
  thunkMiddleware,
))
