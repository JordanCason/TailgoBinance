import {
  SET_BINANCE_API_FULFILLED,
  LOAD_SETTINGS_FULFILLED,
  SET_WEBVIEW_URL_FULFILLED
} from '../actions/settingsAction'

const initialState = {
    binance: {
      'APIKEY': '',
      'APISECRET': ''
    },
    webviewURL: ''
}

export function settingsReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
      case SET_BINANCE_API_FULFILLED:
      return {
          ...state,
          binance: payload
      }
      case SET_WEBVIEW_URL_FULFILLED:
      return {
          ...state,
          webviewURL: payload
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
