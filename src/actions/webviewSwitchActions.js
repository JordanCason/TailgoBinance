import { store } from '../index.js'
import { signalHandler } from './binanceApiActions'
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
// } sssssssasssssssssssss

const recursive = () => {
  setTimeout(() => {
    webviewSwitch()
  },  100)
}
export const webviewSwitch = () => {
  /* @DEV if webview is not loaded catch err and try again, if webview does loaded
  but is still busy loading try again. */
  try {
    webview = document.querySelector('webview')
    if (webview.isLoading()) {
      recursive()
      return
    }
    webview.send('Start')
    webview.openDevTools()

    /* @DEV start a function in inject.js to make sure the page has loaded,
    send over initial data and start the main functions that
    reiligh on the page being loaded. */
  }
  catch(err) {
    recursive()
    return
  }
  webview.addEventListener('ipc-message', (event) => {
    // wait for event from webview and the send to the appropreat function
    const {type, payload} = event.channel
    console.log(type)
    console.log(alertLissner)
    switch (type) {

      case "SCRAPED_ALERT":
        processWebviewAlertOrder(payload)
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



function processWebviewAlertOrder(payload) {
  console.log(payload)
  signalHandler(payload)

}


export const sendAlertToWebviewAction = (alertString) => {
  // @dev this is the json object that gets placed in the comment textbox in
  // @dev the create alert panel on tradingview
  console.log('incertAlertStringInTextbox')
  webview.send('incertAlertStringInTextbox', alertString)

  return {
    type: TOGGLE_ALERT_LISSNER,
    payload: ''
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
