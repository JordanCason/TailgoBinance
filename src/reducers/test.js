const TEST = "TEST"

const initialState = {
    items: [],
    item: {}
}

export function testReducer(state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case TEST:
        return {
            ...state,
            test: payload
        }
        default:
        return state
    }
}
