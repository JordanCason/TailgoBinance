
import {
  UPDATE_TICKER_FULFILLED,
  CREATE_ALERT_POPUP,
  UPDATE_TICKER,
  TOGGLE_ALERT_LISSNER_FULFILLED,
  TOGGLE_ALERT_LISSNER
} from "../actions/webviewSwitchActions"

const initialState = {
    lissining: false,
    createAlertPopup: false,
    currentTicker: {
      'exchange': '',
      'tickerFull': '',
      'ticker': ''
    }
}

export function toggleAlertLissnerReducer(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case TOGGLE_ALERT_LISSNER:
        console.log(type)
        return {
            ...state,
            lissining: payload,
        }
        case UPDATE_TICKER:
        console.log(type)
        return {
            ...state,
            currentTicker: payload,
        }
        case CREATE_ALERT_POPUP:
        console.log(type)
        return {
            ...state,
            createAlertPopup: payload,
        }
        default:
        return state
    }
}
