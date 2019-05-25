export const SET_BINANCE_API = 'SET_BINANCE_API'
export const SET_BINANCE_API_FULFILLED = 'SET_BINANCE_API_FULFILLED'
export const LOAD_SETTINGS = 'LOAD_SETTINGS'
export const LOAD_SETTINGS_FULFILLED = 'LOAD_SETTINGS_FULFILLED'
const settings = window.require('electron-settings');

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


export const loadSettings = () => {
  return{
    type: LOAD_SETTINGS,
    payload: new Promise((resolve, regect) => {
      const binance = {
        'APIKEY': settings.get('binance.APIKEY'),
        'APISECRET': settings.get('binance.APISECRET'),
      }
      const fullState = {
        'binance': binance
      }
      resolve(fullState)
    })
  }
}


export const settingsGitBinanceApiAction = () => {
  console.log(settings.get('Binance.APIKEY'));
  console.log(settings.has('Binance.middle'));
}
