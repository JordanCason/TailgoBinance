import { NODE_EXICUTION_FULFILLED } from '../actions/testIpcSwitchAction'

const initialState = {
    items: [],
    item: {}
}

export function rpcSwitchReducer(state = initialState, action) {
  const { type, payload } = action
  if (type == NODE_EXICUTION_FULFILLED) {
    switch (payload[0]) {
      case 'TESTFUNK':
        console.log(payload)
      default:
      return state
    }
  } else {
    return state
  }
}
