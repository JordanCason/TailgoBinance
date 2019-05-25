import {TOGGLE_ALERT_LISSNER} from "../actions/webviewSwitchActions"
import {TOGGLE_ALERT_LISSNER_FULFILLED} from "../actions/webviewSwitchActions"

const initialState = {
    lissining: false,
}

export function toggleAlertLissnerReducer(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case TOGGLE_ALERT_LISSNER_FULFILLED:
        console.log(type)
        return {
            ...state,
            lissining: payload,
        }
        default:
        return state
    }
}
