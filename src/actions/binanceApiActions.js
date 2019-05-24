export const BINANCE_FULFILLED = "BINANCE_FULFILLED"
export const BINANCE_PENDING = "BINANCE_PENDING"
export const BINANCE = "BINANCE"

// const Binance = require( 'node-binance-api' );
// const binance = new Binance().options({
//     APIKEY: 'Ba1PGEvHWlW6SGq1FsNG7FDLuLaF1KmJ16a5iSvMgwvnjq9iDTcS7IJ3Iq8BRSCr',
//     APISECRET: '7GoA9mVqMuzbwP51TaYjM4t8FBaEJOfjeLnSGTK3tcNJsTy8y0QWI1mXaaO7JaHW',
//     useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
//     test: false // If you want to use sandbox mode where orders are simulated
// });


const app = window.require("electron")
const settings = window.require('electron-settings');


const TEST = "TEST"

export const settingsSetBinanceApiAction = () => {
    settings.set('name', {
    first: 'Cosmo',
    last: 'Kramer'
    });
}


export const settingsGitBinanceApiAction = () => {
  console.log(settings.get('name.first'));
  console.log(settings.has('name.middle'));
}

// const binaceinit = () => ({
//   // type: BINANCE,
//   // payload: new Promise(() => {
//   //
//   // }),
// })




//const testwright = () => ({
//  ipcRenderer.sendToHost('SETTINGS', "save Settings")
//})
