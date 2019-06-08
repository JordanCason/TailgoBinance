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

export const initBinanceApi = (e) => {
    console.log(e)

  return {
    type: BINANCE_CLIENTS_INITIALIZED,
    payload: new Promise((resolve, reject) => {
      if (!e) {
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
      } else {
       client = null
       client2 = null
      }
      resolve(!e)
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

export const signalHandler = async(msg) => {
  if (msg.executionType === 'NEW') {
    //@DEV new exacution order came in for the excange
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
  } else if (msg.event === "ORDER" ) {
    // @DEV our custom event type for placing orders
    sortOrder(msg)
  }
}

export const sortOrder = (msg) => {
  if ((msg.side === 'BUY' || msg.side === 'SELL') && msg.type === 'TRACKER') {
    placeTrackingOrder(msg)
    return
  }
  if ((msg.side === 'BUY' || msg.side === 'SELL') && msg.type !== 'TRACKER') {
    placeOrder(msg)
    return
  }
}
let customId = 0

export const placeTrackingOrder = async(msg) => {
  let book = await client.book({ symbol: msg.symbol })
  // bid and ask add random dust to the price to try to throw off frontrunning detection
  let bid = BigNumber(book.bids[0].price).plus('0.' + Math.floor(Math.random()
  * (msg.high - msg.low) + msg.low).toString().padStart(8, '0')).toFixed(8)
  let ask = BigNumber(book.asks[0].price).minus('0.' + Math.floor(Math.random()
  * (msg.high - msg.low) + msg.low).toString().padStart(8, '0')).toFixed(8)
  let newOrderPrice = msg.side === 'BUY' ? bid : ask
  let _newOrderPrice = newOrderPrice
  let limit = await count('OPS')
  let attempt = 0
  if ( limit.rateLimitReached ) { return }
  // @DEV place buy or sll
  let response = await client.order({
    symbol: msg.symbol,
    side: msg.side,
    quantity: msg.amount,
    price: newOrderPrice,
  }).catch((err) => {
    if (err.message === 'Account has insufficient balance for requested action.') {
      console.error('Not enough funds in acccout to place that order')
    }
  })
  if (!response) {
    /*********************
    @DEV if the order had an error or is response obect is empty for any
    reason than just return the placeTrackingOrder function
    all errors should be handled in the .catch()
    *********************/
    console.log('in undefined')
    return
  }
  // @DEV every new order will add 1 for it custom id for tracking orders
  response.customId = customId++
  msg = {
    ...msg,
    response: response,
  }
  /*********************
  @DEV bid and ask exist in the scope of the who placeTrackingOrder
  This web socket sets bid and ask everytime the values change
  *********************/
  const clean = client.ws.partialDepth({ symbol: msg.symbol, level: 5 },
  async(depth) => {
    bid = depth.bids[0].price
    ask = depth.asks[0].price
  })
  const updateMsg = () => {
  }
  const recursive = () => {
    // @DEV setup for recursive function calls and sleep for x seconds
    setTimeout(() => {
      console.log()
      checkposition()
    }, Math.floor(Math.random() * (0 - msg.interval) + msg.update))
  }
  const checkposition = async() => {
    /*********************
    @DEV check the position of the order to see if its still current
    if it is current call the recursive function again
    if its not then continue to the canselOrder function
    *********************/
    attempt = 0
    try {
      _newOrderPrice = msg.side === 'BUY' ? bid : ask
      if ( _newOrderPrice !== newOrderPrice ) {
        /*********************
        @DEV Depending on the order side, if the bid or ask has changed
        continue. If not than jump back to recursive.
        *********************/
        newOrderPrice = msg.side === 'BUY' ?
        BigNumber(bid).plus('0.' + Math.floor(Math.random() *
        (msg.high - msg.low) + msg.low).toString().padStart(8, '0')).toFixed(8) :
        BigNumber(ask).minus('0.' + Math.floor(Math.random() *
        (msg.high - msg.low) + msg.low).toString().padStart(8, '0')).toFixed(8)
        console.log(`TRACKER: bid: ${bid} new: ${newOrderPrice}`)
        limit = await count('OPS').then((limit) => {
          if ( !limit.rateLimitReached ) {
            /*********************
            @DEV if the rate limit has not bin hit than cancel the order
            if not than jump back up to recursive
            *********************/
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
            quantity: msg.amount,
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


export const placeOrder = async(msg) => {
  let response = await client.order({
    type: msg.type,
    symbol: msg.symbol,
    side: msg.side,
    quantity: msg.amount,
    price: msg.price,
  }).catch((err) => {
    if (err.message === 'Account has insufficient balance for requested action.') {
      console.error('Not enough funds in acccout to place that order')
    }
  })
}


export const getTickerPrice = () => {
    // get current price of a ticker
    client2.prices('ENJETH', (error, ticker) => {
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
