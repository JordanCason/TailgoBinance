//     APIKEY: 'G4IKe2l4KaXEFeIIeIijS7ZoQ7JFxKQXji1ZC9gDb4PaFjQGhm2Mm8qn7EO6w2kC',
//     APISECRET: 'm7D7IVD343D2tSi175TTKWvQxEnekXcaKlQJlq082ReV7W8UtvptgHyyw1Kewhwk',


import {store} from '../index.js'
import {BigNumber} from 'bignumber.js';

export const BINANCE_CLIENTS_INITIALIZED = 'BINANCE_CLIENTS_INITIALIZED'
export const BINANCE_CLIENTS_INITIALIZED_FULFILLED = 'BINANCE_CLIENTS_INITIALIZED_FULFILLED'

// @DEV No single Binance API had everything we needed so loding two here.
const Binance = window.require('binance-api-node').default;
const binance2 = window.require('node-binance-api')
const settings = window.require('electron-settings');
const SimpleNodeLogger = window.require('simple-node-logger'),
    opts = {
        logFilePath:`${settings.get('userData')}/my-app/development.log`,
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    }
const logger = SimpleNodeLogger.createSimpleFileLogger( opts );
let client, client2, orderTracker = {}

export const initBinanceApi = () => {
  return {
    type: BINANCE_CLIENTS_INITIALIZED,
    payload: new Promise((resolve, reject) => {
      client = Binance({
        apiKey: settings.get('binance.APIKEY'),
        apiSecret: settings.get('binance.APISECRET'),
        useServerTime: true,//JSON.parse(settings.get('BinanceAPI.useServerTime')),
        test: true //JSON.parse(settings.get('BinanceAPI.test'))
      })
      client2 = new binance2().options({
        APIKEY: settings.get('binance.APIKEY'),
        APISECRET: settings.get('binance.APISECRET'),
        useServerTime: true
      })
      // @DEV lissen for orders to stream in over the users acount and past them\
      // to the signalHandler
      client.ws.user(msg => {
          signalHandler(msg)
      })
      resolve(true)
    })
  }
}


// only really need ot use OPS "Orders Per Second"
let rateLimits = {
    RPM: {
        rateLimitType:"REQUEST_WEIGHT",
        interval:"MINUTE",
        timelimit: 60000,
        limit:1200,
        count: 0,
        resetTime: Date.now() + 60000
    },
    OPS: {
        rateLimitType:"ORDERS",
        interval:"SECOND",
        timelimit: 10000,
        limit:10,
        count: 0,
        resetTime: Date.now() + 10000
    },
    OPD: {
        rateLimitType:"ORDERS",
        interval:"DAY",
        timelimit: 86400000,
        limit:100000,
        count: 0,
        resetTime: Date.now() + 86400000
    }
}

export const count = (countType) => {
  return new Promise((resolve, reject) => {
    try {
      let current = + new Date()
      console.log(rateLimits[countType].count)
      console.log(rateLimits[countType].resetTime)
      rateLimits[countType].count ++
      if (current >= rateLimits[countType].resetTime) {
        // @DEV if the current time is grater than the resetTime then
        // reset the limits
        rateLimits = {
          ...rateLimits,
          [countType]: {
              ...rateLimits[countType],
              count: 0,
              resetTime: current + rateLimits[countType].timelimit
          }
        }
      }
      if (countType === 'OPS') {
        //console.log(rateLimits[countType].count)
        resolve( {
            rateLimitReached: rateLimits[countType].count >= rateLimits[countType].limit,
            count: rateLimits[countType].count
        } )
      }
    } catch(err) {
        console.log('Error has occured:' + err)
        logger.error('Error has occured:' + err);
    }
  })
}

export const testTime = (countType) => {
    count(countType).then((result) => {
        console.log(result)
    })
}


export const checkOrders = async(ticker) => {
    let msg = {
        commission: "0.04300000",
        commissionAsset: "ENJ",
        creationTime: 1543634966872,
        eventTime: 1543635053271,
        eventType: "executionReport",
        executionType: "TRADE",
        icebergQuantity: "0.00000000",
        isBuyerMaker: true,
        isOrderWorking: false,
        lastTradeQuantity: "43.00000000",
        newClientOrderId: "1qqPAILOPeenUw4w7ElN6R",
        orderId: 20302799,
        orderRejectReason: "NONE",
        orderStatus: "PARTIALLY_FILLED",
        orderTime: 1543635053271,
        orderType: "LIMIT",
        originalClientOrderId: "null",
        price: "0.00023868",
        priceLastTrade: "0.00023868",
        quantity: "55.00000000",
        side: "BUY",
        stopPrice: "0.00000000",
        symbol: "ENJETH",
        timeInForce: "GTC",
        totalQuoteTradeQuantity: "0.01026324",
        totalTradeQuantity: "43.00000000",
        tradeId: 1785619,
    };


}


export const TestOrder1 = async(ticker) => {
  const order = {
    eventType: 'ORDER',
    symbol: 'ENJETH',
    side: 'BUY',
    type: 'TRACKER',
    interval: 10,
    quantity: '1000'
  }
  signalHandler(order)
}

export const TestOrder2 = async(ticker) => {
  const order = {
    eventType: 'ORDER',
    symbol: 'ENJETH',
    side: 'SELL',
    type: 'TRACKER',
    interval: 20,
    quantity: '300'
  }
  signalHandler(order)
}


export const signalHandler = async(msg) => {
  if (msg.executionType === 'NEW') {
    //@DEV new exacution order came in for the excange
    console.log(msg)
    orderTracker = {
        ...orderTracker,
        [msg.orderId]: msg
    }
  }
  if (msg.executionType === 'CANCELED') {
    delete orderTracker[msg.orderId]
  }
  if (msg.orderStatus === "PARTIALLY_FILLED") {
    return
  } else if (msg.eventType === "ORDER" ) {
    // @DEV are custom event type for placing orders
    sortOrder(msg)
  }
}

export const sortOrder = (msg) => {
  if ((msg.side === 'BUY' || msg.side === 'SELL') && msg.type === 'TRACKER') {
    placeTrackingOrder(msg)
  }
}
let customId = 0

export const placeTrackingOrder = async(msg) => {
  let book = await client.book({ symbol: msg.symbol })
  // bid and ask add random dust to the price to try to throw off frontrunning detection
  let bid = BigNumber(book.bids[0].price).minus((Math.random() *
  (0.00000012 - 0.00000001) + 0.00001001).toFixed(8)).toFixed(8)
  let ask = BigNumber(book.asks[0].price).plus((Math.random() *
  (0.00000012 - 0.00000001) + 0.00001001).toFixed(8)).toFixed(8)
  let newOrderPrice = msg.side === 'BUY' ? bid : ask
  let _newOrderPrice = newOrderPrice
  let limit = await count('OPS')
  let attempt = 0
  if ( limit.rateLimitReached ) { return }
  // @DEV place buy or sll
  let response = await client.order({
    symbol: msg.symbol,
    side: msg.side,
    quantity: msg.quantity,
    price: newOrderPrice,
  }).catch((err) => {
    // console.log(err.message)
    // console.log(err.name)
    if (err.message === 'Account has insufficient balance for requested action.') {
      console.log('Not enough funds in acccout to place that order')
    }
  })
  if (!response) {
    // @DEV if the order had an error or is response obect is empty for any
    // @DEV reason than just return the placeTrackingOrder function
    // @DEV all errors should be handled in the .catch()
    console.log('in undefined')
    return
  }
  // @DEV every new order will add 1 for it custom id for tracking orders
  response.customId = customId++
  msg = {
    ...msg,
    response: response,
  }
  // @DEV bid and ask exist in the scope of the who placeTrackingOrder
  // @DEV This web socket sets bid and ask everytime the values change
  const clean = client.ws.partialDepth({ symbol: msg.symbol, level: 5 }, async(depth) => {
    bid = depth.bids[0].price
    ask = depth.asks[0].price
  })
  const updateMsg = () => {
  }
  const recursive = () => {
    // @DEV setup for recursive function calls and sleep for x seconds
    setTimeout(() => {
      checkposition()
    }, msg.interval * 1000)
  }
  const checkposition = async() => {
    // @DEV check the position of the order to see if its still current
    // @DEV if it is current call the recursive function again
    // @DEV if its not then continue to the canselOrder function
    attempt = 0
    try {
      _newOrderPrice = msg.side === 'BUY' ? bid : ask
      if ( _newOrderPrice !== newOrderPrice ) {
        // @DEV Depending on the order side, if the bid or ask has changed
        // @DEV continue. If not than jump back to recursive.
        newOrderPrice = msg.side === 'BUY' ?
        BigNumber(bid).minus((Math.random() *
        (0.00000012 - 0.00000001) + 0.00001001).toFixed(8)).toFixed(8) :
        BigNumber(ask).plus((Math.random() *
        (0.00000012 - 0.00000001) + 0.00001001).toFixed(8)).toFixed(8)
        limit = await count('OPS').then((limit) => {
          if ( !limit.rateLimitReached ) {
            // @DEV if the rate limit has not bin hit than cancel the order
            // @DEV if not than jump back up to recursive
            cancelOrder()
          } else {
            recursive()
          }
        })
      } else {
        recursive()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const cancelOrder = async() => {
    await client.cancelOrder({
      symbol: msg.symbol,
      orderId: msg.response.orderId
    }).then((result) => {
      setNewOrder()
    }).catch(async(err) => {
      if (err.toString().includes('UNKNOWN_ORDER')) {
        if (attempt <= 5) {
          console.log('cancelOrder attempt = ' + attempt)
          setTimeout(() => {
            attempt++
            console.log(`orderId: ${msg.response.orderId} not found, retry: ${attempt}: orginal error: ` + err)
            logger.error(`orderId: ${msg.response.orderId} not found, retry: ${attempt}: orginal error: ` + err);
            cancelOrder()
          }, 2000)
        } else {
          console.log('shutting down Order')
          logger.warn('order was does not exist on exchange: shutting down Order');
          await clean()
        }
      }
    })
  }
  const setNewOrder = () => {
    count('OPS').then(async(limit) => {
      if ( !limit.rateLimitReached ) {
        msg = {
          ...msg,
          response: await client.order({
            symbol: msg.symbol,
            side: msg.side,
            quantity: msg.quantity,
            price: newOrderPrice,
          })
        }
        recursive()
      } else {
        recursive()
      }
    })
  }
  checkposition()
}













//     let attempt = 0
//     const recursive = () => {
//             setTimeout(async() => {
//                 await checkposition()
//             }, msg.interval * 1000)
//         }
//     let shouldreturn = false
//     const checkposition = (async() => {
//         try {
//         //console.log(`%c Bid = ${bid} Ask = ${ask}`, 'color:blue')
//             newOrderPrice = msg.side === 'BUY' ? bid : ask
//             if ( _newOrderPrice !== newOrderPrice ) {
//                 _newOrderPrice = newOrderPrice
//                 limit = await count('OPS')
//                 if ( limit.rateLimitReached ) {
//                     //console.log(`${msg.response.orderId}: RateLimit (1)`)
//                     recursive(); return }
//                 //console.log(`${msg.response.orderId}: After RateLimit (1)`)
//                 let order
//                 //console.log(`(1) orderId ${msg.response.orderId}: start sleep`)
//                 const cancelOrder = (() => {
//                     return new Promise(async(resolve, reject) => {
//                         //console.log(`(2) orderId ${msg.response.orderId}: start timout order`)
//                         order = await client.cancelOrder({
//                             symbol: msg.symbol,
//                             orderId: msg.response.orderId,
//                         }).then((result) => {
//                             console.log(`cancelOrder then`)
//                             resolve(result)
//                         }).catch(async(err) => {
//                             if (err.toString().includes('UNKNOWN_ORDER')) {
//                                 if (attempt <= 5) {
//                                     console.log('cancelOrder attempt = ' + attempt)
//                                     setTimeout(async() => {
//                                         attempt++
//                                         logger.error(`orderId: ${msg.response.orderId} not found, retry: ${attempt}: orginal error: ` + err);
//                                         await cancelOrder()
//                                     }, 2000)
//                                     resolve('error')
//                                     //return
//                                 } else {
//                                     logger.warn('order was does not exist on exchange: shutting down Order');
//                                     await clean()
//                                     resolve('error')
//                                     //return
//                                 }
//                             }
//                         })
//                         //console.log(`(2) orderId ${msg.response.orderId}: end timout order`)
//
//                     })
//                 })
//                 await cancelOrder().then(async(orderResult) => {
//                     if (orderResult === 'error') {
//                         shouldreturn = true
//                     }
//                 })
//                 if (shouldreturn) {
//                     console.log('error')
//                     recursive()
//                     return
//                 }
//
//                 //console.log(`(1) orderId ${msg.response.orderId}: stop sleep`)
//
//
//                 attempt = 0
//                 limit = await count('OPS')
//                 //console.log(`(3) orderId ${msg.response.orderId}: final order`)
//                 order = await client.order({
//                     symbol: msg.symbol,
//                     side: msg.side,
//                     quantity: msg.quantity,
//                     price: newOrderPrice,
//                 })
//                 order.customId = customId++
//                 //console.log(`(3) orderId ${msg.response.orderId}: end final order`)
//                 //console.log(`%c 3rd ${order.orderId}`, 'color:blue')
//                 msg = {
//                     ...msg,
//                     response: order
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//         }
//         recursive()
//     })
//     checkposition()
// }


//
//
// export const placeTrackingOrder = async(msg) => {
//     console.log('Start Order Tracking')
//     let book = await client.book({ symbol: msg.symbol })
//     let _newOrderPrice, newOrderPrice
//
//     if (msg.side === 'BUY') {
//         newOrderPrice = BigNumber(book.bids[0].price).minus(0.00000350).toFixed(8)
//     } else {
//         newOrderPrice = BigNumber(book.bids[0].price).plus(0.00000350).toFixed(8)
//     }
//     _newOrderPrice = newOrderPrice
//     await count('OPS').then((result) => {
//         console.log(result.rateLimitReached)
//         if (result.rateLimitReached) { return }})
//     let response = await client.order({
//         symbol: msg.symbol,
//         side: msg.side,
//         quantity: msg.quantity,
//         price: newOrderPrice,
//     })
//     msg = {
//         ...msg,
//         response: response
//     }
//     let bid, ask
//     const clean = client.ws.partialDepth({ symbol: msg.symbol, level: 5 }, async(depth) => {
//         bid = BigNumber(depth.bids[0].price).minus(0.00000350).toFixed(8)
//         ask = BigNumber(depth.asks[0].price).plus(0.00000350).toFixed(8)
//     })
//     const checkposition = setInterval(async() => {
//         try {
//         //console.log(`%c Bid = ${bid} Ask = ${ask}`, 'color:blue')
//             if (msg.side === 'BUY') {
//                 newOrderPrice = bid
//             } else {
//                 newOrderPrice = ask
//             }
//             if ( _newOrderPrice !== newOrderPrice ) {
//                 console.log('Placing New Order at ' + newOrderPrice)
//                 _newOrderPrice = newOrderPrice
//                 let test = await count('OPS')
//                 if ( test.rateLimitReached ) {
//                     return
//                 }
//                 console.log('here!!!!!!!!!!!')
//                 await client.cancelOrder({
//                     symbol: msg.symbol,
//                     orderId: msg.response.orderId,
//                 }).then(async() => {
//
//                 await delete orderTracker[msg.response.orderId]
//                     let test = await count('OPS')
//                     response = await client.order({
//                         symbol: msg.symbol,
//                         side: msg.side,
//                         quantity: msg.quantity,
//                         price: newOrderPrice,
//                     }).catch((err) => {
//                         console.log(newOrderPrice)
//                         console.log(msg)
//                         console.log(response)
//                         console.log('error in Order 2' + err)
//                     })
//                     msg = {
//                         ...msg,
//                         response: response
//                     }}).catch(async(err) => {
//                         if (err.toString().includes('UNKNOWN_ORDER')) {
//                             console.log('order was does not exist on exchange: shutting down Order')
//                             await clearInterval(checkposition)
//                             clean()
//                             return
//                         } else {
//                             throw err
//                         }
//                     })
//
//             } else if ('executionType' in orderTracker[msg.response.orderId]) {
//                 let executionType = orderTracker[msg.response.orderId].executionType
//                 if (executionType === 'FILLED' || executionType === 'EXPIRED' ) {
//                     console.log('Order Compleated with code: ' + executionType)
//                     clearInterval(checkposition)
//                     clean()
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }, msg.interval * 1000)
// }
//



//     binance.websockets.trades(['ENJETH', 'ETHBTC'], (trades) => {
//   let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
//   console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
// });
//     //binance = store.getState().SettingsReducer.binanceObj
//     var quantity = '50';
//     binance.bookTickers(ticker, (error, spread) => {
//         let bidPrice = spread.bidPrice
//         if (_bidPrice !== bidPrice) {
//             _bidPrice = bidPrice
//             const setOrderPrice = BigNumber(spread.bidPrice).minus(0.00000150).toFixed(8)
//             console.log(`%c ${(spread.bidPrice)} = ${setOrderPrice}`, 'color:blue')
//             binance.buy(ticker, quantity, setOrderPrice, {type:'LIMIT'}, (error, response) => {
//                 console.log("Limit Buy response", response);
//                 orderID = response.orderId
//             });
//         }
//         if (orderID) {
//             binance.orderStatus(ticker, orderID, (error, orderStatus, symbol) => {
//                 console.log(symbol+" order status:", orderStatus);
//             });
//         }
//     });
//     await setTimeout(() => {placeTrackingOrder(ticker)}, 3000)



// const app = window.require("electron")
// const settings = window.require('electron-settings');


// export const GET_BINANCE_API_SETTINGS = "GET_BINANCE_API_SETTINGS"
// export const settingsGitBinanceApiAction = () => {
//     const payload = {
//         APIKEY: settings.get('BinanceAPI.APIKEY'),
//         APISECRET: settings.get('BinanceAPI.APISECRET'),
//         useServerTime: settings.get('BinanceAPI.useServerTime'),
//         test: settings.get('BinanceAPI.test')
//     }
//     return {
//         type: GET_BINANCE_API_SETTINGS,
//         payload: payload
//     }
// }


// const binaceinit = () => ({
//   // type: BINANCE,
//   // payload: new Promise(() => {
//   //
//   // }),
// })

//const testwright = () => ({
//  ipcRenderer.sendToHost('SETTINGS', "save Settings")
//})





// const TEST = "TEST"
//
// export const settingsSetBinanceApiAction = () => {
//     settings.set('name', {
//     first: 'Cosmo',
//     last: 'Kramer'
//     });
// }
export const getTickerPrice = () => {
    // get current price of a ticker
    client2.prices('ENJETH', (error, ticker) => {
      console.log(error)
      console.log(ticker)
        console.log("ENJ/ETH: ", ticker.ENJETH);
    });
}

export const getBidAsk = (ticker) => {
    client2.bookTickers(ticker, (error, ticker) => {
        console.log("bookTickers", ticker);
    });
}

export const getBallance = () => {
    client2.balance((error, balances) => {
        if ( error ) return console.error(error);
        console.log("balances()", balances);
    });

}
