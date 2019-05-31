import { store } from '../index.js'
export const TOGGLE_ALERT_LISSNER = "TOGGLE_ALERT_LISSNER"
export const TOGGLE_ALERT_LISSNER_FULFILLED = 'TOGGLE_ALERT_LISSNER_FULFILLED'
export const UPDATE_TICKER = "UPDATE_TICKER"
export const UPDATE_TICKER_FULFILLED = 'UPDATE_TICKER_FULFILLED'

export const WEBVIEW_SWITCH = "WEBVIEW_SWITCH"
export const CREATE_ALERT_POPUP = "CREATE_ALERT_POPUP"


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
    webview.send('Start')
    // @DEV start a function in inject.js to make sure the page has loaded,
    // @DEV send over initial data and start the main functions that
    // @DEV reiligh on the page being loaded.
  }
  catch(err) {
    recursive()
    return
  }
  webview.addEventListener('ipc-message', (event) => {
    // wait for event from webview and the send to the appropreat function
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
      case "CREATE_ALERT_POPUP":
        store.dispatch(event.channel)
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
