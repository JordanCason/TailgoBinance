const TEST = "TEST"

export const testAction = () => dispatch => {
    dispatch({
        type: TEST,
        payload: "this is a test"
    })
}
