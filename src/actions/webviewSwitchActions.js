import { store } from '../index.js'
export const TOGGLE_ALERT_LISSNER = "TOGGLE_ALERT_LISSNER"
export const TOGGLE_ALERT_LISSNER_FULFILLED = 'TOGGLE_ALERT_LISSNER_FULFILLED'
export const UPDATE_TICKER = "UPDATE_TICKER"
export const UPDATE_TICKER_FULFILLED = 'UPDATE_TICKER_FULFILLED'

export const WEBVIEW_SWITCH = "WEBVIEW_SWITCH"


let webview
let binance
var alertLissner = false

// export const loadBinanceSettins = () => {
//     binanceAPI = store.getState().SettingsReducer.BinanceAPI
// }

const recursive = () => {
  setTimeout(() => {
    webviewSwitch()
  },  100)
}
export const webviewSwitch = () => {
  // @DEV if webview is not loaded catch err and try again, if webview does loaded
  // @DEV but is still busy loading try again.
  try {
    webview = document.querySelector('webview')
    if (webview.isLoading()) {
      recursive()
      return
    }
  }
  catch(err) {
    recursive()
    return
  }
  webview.addEventListener('ipc-message', (event) => {
    // wait for event from webview and the send to the appropreat function
    console.log('new event')
    const {type, payload} = event.channel
    switch (type) {
      case "SINGLEALERT" && alertLissner:
        singlealert(payload)
        break;
      case "MULTIALERT" && alertLissner:
        multialert(payload)
        break;
      case "CURRENT_TICKER":
        updateTicker(payload)
        break;
      default:
    }
  })
  return {
    type: WEBVIEW_SWITCH,
    payload: true,
  }
}

export const toggleAlertLissnerAction = (e) => {
  if (e) {
    alertLissner = e
    webview.send('StartAlertLissner')
  }
  else {
    webview.send('StopAlertLissner')
    alertLissner = e
  }
  return {
    type: TOGGLE_ALERT_LISSNER,
    payload: e
  }
}

const updateTicker = (payload) => {
  console.log(payload)
  store.dispatch({
    type: UPDATE_TICKER,
    payload: payload
  })
}




const singlealert = (payload) => {
  try {
    payload = {
        ...payload,
        Description: JSON.parse(payload.Description)
        }
    console.log(payload)
  }
  catch (err) {// SyntaxError
    console.log('error')
    console.log(err)
    console.log(payload)
  }
}



const multialert = (payload) => {
  try {
    Object.values(payload).forEach((obj) => {
    obj = {
        ...obj,
        Description: JSON.parse(obj.Description)
        }
    delete obj[Object.keys(obj)[0]]
    // store.dispatch({
    //         type: TEST,
    //         payload: "this is a test of dispatch"
    //     })
    })
  }
  catch (err) {// SyntaxError
    console.log('error')
    console.log(err)
    console.log(payload)
  }
}
