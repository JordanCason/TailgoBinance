const WebSocket = require('ws')
const crypto = require('crypto')

module.exports = class HitBTCWebsocketClient {
  constructor({ key, secret, isDemo = false }) {
    try {
      this.key = key;
      this.secret = secret;
      this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
      this.hasCredentials = key && secret;

      if (this.hasCredentials) {
        this.Socket = new WebSocket('wss://api.hitbtc.com/api/2/ws')
        this.Socket.on(`open`, () => {
          this.login().then((data) => {
            this.Socket.send(data)
          })
        });
      }
    } catch {(err) => {console.log(err)}}
  }

  login(payload) {
    return new Promise((resolve, reject) => {
      const nonce = JSON.stringify(Date.now())
      const signature = crypto
        .createHmac(`sha256`, this.secret)
        .update(nonce)
        .digest(`hex`);
      const msg = {
        method: 'login',
        params: {
          "algo": "HS256",
          "pKey": this.key,
          'nonce': nonce,
          "signature": signature,
        }
      }
      resolve(JSON.stringify(msg))
    })
  }


  socketLissner(callback) {
    return new Promise((resolve, reject) => {
      this.Socket.onmessage = (msg) => {
        callback(msg.data)
        resolve()
      }
    })
  }

  subscribeTicker(ticker) {
    this.Socket.send(JSON.stringify({
      "method": "subscribeTicker",
      "params": {
        "symbol": ticker
      },
      "id": crypto.randomBytes(11).toString('hex')
    }))
  }


  unsubscribeTicker(ticker) {
    this.Socket.send(JSON.stringify({
      "method": "unsubscribeTicker",
      "params": {
        "symbol": ticker
      },
      "id": crypto.randomBytes(11).toString('hex')
    }))
  }


  subscribeReports() {
    this.Socket.send(JSON.stringify({
      "method": "subscribeReports",
      "params": {}
    }))
  }

  placeOrder(symbol, side, type, price, quantity, postOnly=false) {
    /* @pram {type} limit, market, stopLimit, stopMarket
     * @pram {side} sell, buy */
    this.Socket.send(JSON.stringify({
      "method": "newOrder",
      "params": {
        "clientOrderId": crypto.randomBytes(11).toString('hex'),
        "symbol": symbol,
        "side": side,
        "price": price,
        "quantity": quantity,
        'type': type,
        'postOnly': postOnly
      },
      "id": crypto.randomBytes(11).toString('hex')
    }))
  }

  cancelOrder(clientOrderId, id) {
    this.Socket.send(JSON.stringify({
      "method": "cancelOrder",
      "params": {
        "clientOrderId": clientOrderId
      },
      "id": id }))
  }

  getOrders() {
    this.Socket.send(JSON.stringify({
      "method": "getOrders",
      "params": {},
      "id": crypto.randomBytes(11).toString('hex')
    }))
  }

  getTradingBalance() {
    this.Socket.send(JSON.stringify({
      "method": "getTradingBalance",
      "params": {},
      "id": crypto.randomBytes(11).toString('hex')
    }))
  }

  subscribeTicker(ticker, id) {
    this.Socket.send(JSON.stringify({
      "method": "subscribeTicker",
      "params": {
        "symbol": ticker
      },
      "id": id
    }))
  }

  unsubscribeTicker(ticker, id) {
    this.Socket.send(JSON.stringify({
      "method": "subscribeTicker",
      "params": {
        "symbol": ticker
      },
      "id": id
    }))
  }

  cancelReplaceOrder(clientOrderId, requestClientId, id, quantity, price) {
    this.Socket.send(JSON.stringify({
      "method": "cancelReplaceOrder",
      "params": {
        "clientOrderId": clientOrderId,
        "requestClientId": requestClientId,
        "quantity": "0.002",
        "price": price
      },
      "id": id
    }))
  }

}
