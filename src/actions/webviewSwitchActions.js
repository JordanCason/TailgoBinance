export const TOGGLE_ALERT_LISSNER = "TOGGLE_ALERT_LISSNER"
export const TOGGLE_ALERT_LISSNER_FULFILLED = 'TOGGLE_ALERT_LISSNER_FULFILLED'
let webview
let binance

// export const loadBinanceSettins = () => {
//     binanceAPI = store.getState().SettingsReducer.BinanceAPI
// }


export const toggleAlertLissnerAction = (e) => {
  return {
    type: TOGGLE_ALERT_LISSNER,
    payload: new Promise((resolve, regect) => {
      console.log("hello")
      if (e === true) {
        console.log('in test action')
        webview = document.querySelector('webview')
        webview.send('StartAlertLissner')
        webview.addEventListener('ipc-message', (event) => {
          const {type, payload} = event.channel
          switch (type) {
            case "SINGLEALERT":
              singlealert(payload)
              break;
            case "MULTIALERT":
              multialert(payload)
              break;
            default:
          }
        })
      console.log('resolve')
      resolve(e)
      } else {
        webview.send('StopAlertLissner')
        resolve(e)
      }
    })
  }
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
