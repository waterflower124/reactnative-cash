import DeviceInfo from 'react-native-device-info'

import { Action, State } from './index'

const initialState: State = {
  version: DeviceInfo.getVersion(),
  checkingVersion: false,
  versionValid: false,
  previousGenerationDate: null,
  currentGenerationDate: new Date(),
  generation: 0,
  rated: false,
  lastRateRequest: null,
}

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case '@Skeep/device--CHECK_VERSION':
      return {
        ...state,
        checkingVersion: false,
        versionValid: action.valid,
      }

    case '@Skeep/device--CHECKING_VERSION': {
      return {
        ...state,
        checkingVersion: true,
      }
    }

    case '@Skeep/device--APP_LAUNCHED': {
      return {
        ...state,
        currentGenerationDate: new Date(),
        previousGenerationDate: state.generation > 0 ? state.currentGenerationDate : null,
        generation: state.generation + 1,
      }
    }

    case '@Skeep/device--APP_RATED':
      return {
        ...state,
        rated: action.success,
        lastRateRequest: new Date(),
      }

    default:
      return state
  }
}
