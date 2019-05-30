


const settings = window.require('electron-settings');
const Binance = window.require( 'node-binance-api' );


export const SET_BINANCE_API = 'SET_BINANCE_API'
export const SET_BINANCE_API_FULFILLED = 'SET_BINANCE_API_FULFILLED'
export const settingsSetBinanceApiAction = (APIKEY, APISECRET) => {
  return {
    type: SET_BINANCE_API,
    payload: new Promise((resolve, reject) => {
      settings.set('binance', {
      'APIKEY': APIKEY,
      'APISECRET': APISECRET
      });
      resolve({
      'APIKEY': APIKEY,
      'APISECRET': APISECRET
      })
    })
  }
}

export const SET_WEBVIEW_URL = 'SET_WEBVIEW_URL'
export const SET_WEBVIEW_URL_FULFILLED = 'SET_WEBVIEW_URL_FULFILLED'
export const settingsSetWebviewURLAction = (webviewURL) => {
  return {
    type: SET_WEBVIEW_URL,
    payload: new Promise((resolve, reject) => {
      settings.set('webviewURL', webviewURL);
      resolve(webviewURL)
    })
  }
}

export const LOAD_SETTINGS = 'LOAD_SETTINGS'
export const LOAD_SETTINGS_FULFILLED = 'LOAD_SETTINGS_FULFILLED'
export const loadSettings = () => {
  return{
    type: LOAD_SETTINGS,
    payload: new Promise((resolve, regect) => {
      const binance = {
        'APIKEY': settings.get('binance.APIKEY'),
        'APISECRET': settings.get('binance.APISECRET'),
      }
      const webviewURL = settings.get('webviewURL')
      const fullState = {
        'binance': binance,
        'webviewURL': webviewURL
      }
      resolve(fullState)
    })
  }
}


export const GET_BINANCE_API_SETTINGS = "GET_BINANCE_API_SETTINGS"
export const settingsGitBinanceApiAction = () => {
    const payload = new Binance().options({
        APIKEY: settings.get('BinanceAPI.APIKEY'),
        APISECRET: settings.get('BinanceAPI.APISECRET'),
        useServerTime: JSON.parse(settings.get('BinanceAPI.useServerTime')),
        test: JSON.parse(settings.get('BinanceAPI.test'))
    })
    console.log(payload)
    return {
        type: GET_BINANCE_API_SETTINGS,
        payload: payload
    }
}
