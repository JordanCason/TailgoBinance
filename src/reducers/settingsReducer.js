import { SET_BINANCE_API_FULFILLED } from '../actions/settingsAction'
import { LOAD_SETTINGS_FULFILLED } from '../actions/settingsAction'
const initialState = {
    binance: {
      'APIKEY': '',
      'APISECRET': ''
    }
}

export function settingsReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
      case SET_BINANCE_API_FULFILLED:
      return {
          ...state,
          binance: payload
      }
      case LOAD_SETTINGS_FULFILLED:
      return {
          ...payload
      }
      default:
      return state
  }
}



// export function loadSettings(state = initialState, action) {
//   const { type, payload } = action
//   switch (type) {
//       case LOAD_SETTINGS_FULFILLED:
//       console.log(type)
//       console.log(payload)
//       return {
//           ...payload
//       }
//       default:
//       return state
//   }
// }
