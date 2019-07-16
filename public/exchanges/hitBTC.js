let APIKey ='pOu/nF/Kvv5nmB9OXvEmhAHM62ksl1Dj';
let SecretKey ='OGuH6lYSEjDtDDt9NdsS6Tm7uTPSUvjS';
const HitBTCClient = require('./hitBTC-api-wrapper')
let activeOrders = {}

const client = new HitBTCClient({key: APIKey, secret:SecretKey})
client.socketLissner((data) => {
  data = JSON.parse(data)
  orderParser(data)
  //console.dir(JSON.parse(data), {depth: null, colors: true})
}).then(() => {
  client.subscribeReports()
})

const orderParser = (msg) => {
  if (msg.method === 'activeOrders') {
    for (order in msg.params) {
      console.log(msg.params[order])
      activeOrders = {
        ...activeOrders,
        [msg.params[order].id]: msg.params[order]
      }
    }
  }
  if (msg.event === "ORDER") {
    exchangeFormater(exchange, msg)
    if ((msg.side === 'BUY' || msg.side === 'SELL') && msg.type !== 'TRACKER') {
      client.placeOrder(
        symbol=msg.symbol,
        side=msg.side,
        type=msg.type,
        price=msg.price,
        quantity=msg.quantity,
        postOnly=true
      )
      return
    }
    // {"amount":"1","event":"ORDER","price":"1","side":"BUY","symbol":"ETHUSD","type":"LIMIT"}
    // {"amount":"1","event":"ORDER","price":"1","side":"BUY","symbol":"ETHUSD","type":"MARKET"}
    // {"amount":"1","event":"ORDER","high":"25","interval":15000,"low":"5","side":"BUY","symbol":"ETHUSD","type":"TRACKER","update":60000}
  }
  if ((msg.side === 'BUY' || msg.side === 'SELL') && msg.type === 'TRACKER') {
    placeTrackingOrder(msg)
    return
  }
}


const exchangeFormater = (exchange, msg, for) => {
  if (exchange === 'hitBTC' && for === 'submition') {
    const newmsg = {
      ...msg,
      'quantity': msg.amount,
      'event': msg.event.toLowerCase(),
      'symbol': msg.symbol,
      'side': msg.side.toLowerCase(),
      'type': msg.type.toLowerCase()
    }
  }
}


const placeTrackingOrder = (msg) => {
  console.log(msg)
}



  //client.subscribeTicker('ENJETH')
// setTimeout(() => {
//
//
//
//
//   //client.placeOrder(symbol='ENJETH', side='buy', type='limit', price='0.000001000', quantity='50', postOnly=true)
// }, 4000);

//setTimeout(() => {client.test3()}, 10000, 'That was really slow!');

// client.addTradingMessageListener(msg => {
//   if (msg.MarketDataSnapshotFullRefresh) console.log(msg);
// });
//
// client.addMarketListener(msg => {
//   console.log(msg);
// });
