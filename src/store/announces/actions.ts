import { getCurrentLanguage } from '../../translate'
import { createHttpApi } from '../http'
import { Dispatch, State, Thunk } from '../index'
import { Action } from './index'

import { Announce } from '../../httpapi'
import * as announces from '../../httpapi/announces'

function fetchingLast(): Action {
  return {
    type: '@Skeep/announces--FETCHING_LAST',
  }
}

function fetchedLast(announce: Announce): Action {
  return {
    type: '@Skeep/announces--FETCHED_LAST',
    announce,
  }
}

export function read(): Action {
  return {
    type: '@Skeep/announces--READ',
  }
}

export function requestFetchLast(): Thunk<Promise<void>> {
  return async (
    dispatch: Dispatch,
    getState: () => State,
  ): Promise<void> => {
    const state = getState()
    const http = createHttpApi(state)

    if (!state.session.token) {
      return
    }

    const {
      announces: {
        lastAnnounce,
      },
    } = state

    dispatch(fetchingLast())

    const announce = await announces.fetchLast(
      http,
      lastAnnounce ? lastAnnounce.id : null,
      getCurrentLanguage(),
    )

    dispatch(fetchedLast(announce))
  }
}
