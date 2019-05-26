import { BINANCE_CLIENTS_INITIALIZED_FULFILLED } from '../actions/binanceApiActions'

const initialState = {
    apiLoaded: false
}

export function binanceApiReducer(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case BINANCE_CLIENTS_INITIALIZED_FULFILLED:
        console.log(payload)
        return {
            ...state,
            apiLoaded: payload
        }
        default:
        return state
    }
}
