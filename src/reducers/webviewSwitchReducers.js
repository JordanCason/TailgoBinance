import {TOGGLE_ALERT_LISSNER} from "../actions/webviewSwitchActions"
import {TOGGLE_ALERT_LISSNER_FULFILLED} from "../actions/webviewSwitchActions"

import {UPDATE_TICKER} from "../actions/webviewSwitchActions"
import {UPDATE_TICKER_FULFILLED} from "../actions/webviewSwitchActions"

const initialState = {
    lissining: false,
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
        default:
        return state
    }
}
