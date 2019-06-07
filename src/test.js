// Saveing this for now as i will be implimenting a testing framework later

tests = [
  {
    // 0
    payload: `    event: ORDER,    symbol: ETHUSD,    type: TRACKER,    side: BUY,    update: 1S,    interval: 15M,    low: 0.00000005,    high: 0.00000025,    amount: 1.4554`,
    expected: 'Pass',
    reason: 'All Keys Are present for TRACKER order'
  },
  {
    // 1
    payload: `    event: ORDER,    symbol: ETHUSD,    type: MARKET,    side: BUY,    amount: 1.4554,    price: 44.00t0`,
    expected: 'Pass',
    reason: 'invalid price string 44.00T0'
  },
  {
    // 2
    payload: `
    event: ORDER,    symbol: ETHUSD,    type: MARKET,    side: BUY,    amount: 1.4554,    price: 44.000`,
    expected: 'Pass',
    reason: 'All Keys Are present for MARKET order'
  },
  {
    // 3
    payload: `
    event: ORDER,    symbol: ETHUSD,    type: LIMIT,    side: BUY,    amount: 1.4554,    price: 44.000`,
    expected: 'Pass',
    reason: 'All Keys Are present for Limit order'
  },
  {
    // 4
    payload: `    event: ORDER,    symbol: ETHUSD,    type: TRACKER,    side: BUUY,    update: 1M,    interval: 15S,    low: 0.00000005,    high: 0.00000025,    amount: 1.4554    price: 45`,
    expected: 'Fail',
    reason: 'Tracking order never needs a price key'
  },
  {
    // 5
    payload: `    event: ORDER,    symbol: ETHUSD,    type: TRACKER,    side: BUY,    update: 1,    interval: 15S,    low: 0.00000005,    high: 0.00000025,    amount: 1.4554`,
    expected: 'Fail',
    reason: 'The update key does not contain a time unit'
  },
  {
    // 6
    payload: `
    event: ORDER,    symbol: ETHUSD,    type: TRACKER,    side: BUY,    update: 1m,    interval: 15s,    low: 0.00000005,    high: 0.00000025,    amount: 1.4554`,
    expected: 'Pass',
    reason: 'Check time unit case'
  },
  {
      // 7 'Invalid Market order missing or incorrect field'
    payload: `
    event: ORDER,    symbol: ETHUSD,    type: LIMIT,    side: BUY,    amount: 1.4554,    price: 44.000    low: 0.00000005`,
    expected: 'Pass',
    reason: "Order contains invalid keys of 'low'"
  },
  {
      // 8 'Invalid Market order missing or incorrect field'
    payload: `    random string in the order    event: ORDER,    symbol: ETHUSD,    type: LIMIT,    side: BUY,    amount: 1.4554,    price: 44.000`,
    expected: 'Pass',
    reason: 'Invalid Market order missing or incorrect field'
  },
  {
    payload: `event: ORDER, symbol: ETHUSD, type: LIMIT, side: BUY, update: 1M, interval: 15S, low: 0.00000005, high: 0.00000025, amount: 0.00000000`,
    expected: 'Pass',
    reason: 'Invalid Market order missing or incorrect field'
  }

]

let run = 0
const runtest = () => {
    if (run <= tests.length -1 ) {
      convertPayload(tests[run].payload).then((payload) => {
        validateOrder(payload).then(() => {
          if (tests[run].expected === 'Pass') {
            console.log(`Test #${run}: PASS`)
            } else {
              console.log(`Test #${run}: FAIL with ${tests[run].reason}`)
            }
          }).catch((err) => {
            throw (err)
            if (err.message === 'Tracking order never needs a price key') {
              if (payload.type === 'TRACKER' ) {
                console.log(`Test #${run}: PASS with ${err.message}`)
                return
              }
            }
            if (err.message === 'The update key does not contain a time unit') {
              if (/(M|m|S|s)$/.test(payload.update)) {
                console.log(`Test #${run}: PASS with ${err.message}`)
                return
              }
            }
            if (err.message === 'invalid price string 44.00T0') {
              console.log(`Test #${run}: PASS with ${err.message}`)
              return
            }
            if (/Order contains invalid keys of \'(high|low|update|interval)\'/
            .test(err.message)) {
              console.log(`Test #${run}: PASS with ${err.message}`)
              return
            }
            if (err.message === 'The update key does not contain a time unit') {
              console.log(`Test #${run}: PASS with ${err.message}`)
              return
            }
            if (tests[run].expected === 'Fail') {
              console.log(`Test #${run}: PASS`)
            } else {
              console.log(`Test #${run}: FAIL with ${err.message}`)
            }
          })
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
        run++
        runtest()
      })
    }
  }
runtest()






function convertPayload(orderPayload) {
  /********************************
  @DEV Convert and validate order. This payload is placed and scraped
  as a string so that its easer to manualy set a payload outside of this client.
  Say maybe form the tradingview android application, or just another webbrowser
  *********************************/
  return new Promise((resolve, reject) => {
    orderPayload = orderPayload.replace(/:\s*/g, ':').replace(/(,\s*)|(\s+)/g,'|').split('|')
    payload = {}
      for (let i=0; i < orderPayload.length; i++) {
        match = orderPayload[i].replace(/(\s)/g,'').match(/(^.+?):(.+?)(,|$)/)
        if (match) {
          if (match[1].toLowerCase() === 'update' || match[1].toLowerCase()
          === 'interval') {
            //@DEV Check to make sure there is a time unit i.e. M or S
            try {
              timeMatch = match[2].toUpperCase().match(/(\d+?)(M|S)/)
              if (timeMatch[2] === 'M') {
                //@DEV change the minutes spesified in the alert to milliseconds
                payload = {
                  ...payload,
                  [match[1].toLowerCase()]: timeMatch[1] * 60000
                }
              } else if (timeMatch[2] === 'S') {
                //@DEV change the seconds spesified in the alert to milliseconds
                payload = {
                  ...payload,
                  [match[1].toLowerCase()]: timeMatch[1] * 1000
                }
              }
            } catch(err) {
              //@DEV if there was no time unit provided throw an error
              reject(new Error(`The ${match[1]
                .toLowerCase()} key does not contain a time unit`))
            }
          } else {
            payload = {
              ...payload,
              [match[1].toLowerCase()]: match[2].toUpperCase()
            }
          }
        }
        if (i === orderPayload.length -1) {
          resolve(payload)
        }
      }
    })
  }


    function validateOrder(payload) {
      return new Promise((resolve, reject) => {
        if (payload.type === 'TRACKER') {
          if (payload.hasOwnProperty('price')) {
            //@DEV tracking orders should never have a price
            return reject(new Error('Tracking order never needs a price key'))
          }
          else if ((payload.hasOwnProperty('event') &&
          payload.hasOwnProperty('symbol') &&
          payload.hasOwnProperty('side') &&
          payload.hasOwnProperty('update') &&
          payload.hasOwnProperty('interval') &&
          payload.hasOwnProperty('high') &&
          payload.hasOwnProperty('low') &&
          payload.hasOwnProperty('amount'))) {
            //@DEV tracking orders should contain all of the tested keys

            return resolve(payload)
          }
          else {
            return reject(new Error('invalid Tracker order'))
          }
          return
        }
        else if (payload.type !== 'TRACKER') {
          //@DEV price key may or maynot be included in a market payload
          if (payload.hasOwnProperty('price') && (!(payload.price.length <= 10 && /^\d*\.?\d*$/
            .test(payload.price)))) {
            return reject(new Error(`invalid price string ${payload.price}`))
          }
          else if (payload.hasOwnProperty('update') ||
          payload.hasOwnProperty('interval') ||
          payload.hasOwnProperty('high') ||
          payload.hasOwnProperty('low')) {
            return reject(new Error(`Order contains invalid keys of '${
              payload.hasOwnProperty('update') ? 'update'
              : payload.hasOwnProperty('interval') ? 'interval'
              : payload.hasOwnProperty('high') ? 'high'
              : payload.hasOwnProperty('low') ? 'low' : ''
            }'`))
          }
          else if (payload.hasOwnProperty('event') &&
          payload.hasOwnProperty('symbol') &&
          payload.hasOwnProperty('side') &&
          payload.hasOwnProperty('amount')) {
            return resolve(payload)
          }
          else {
            return reject(new Error('Invalid Market order missing or incorrect field'))
          }
        }
        return
      })
    }


























// function convertAndValidateOrder(orderPayload) {
//   /********************************
//   @DEV Convert and validate order. This payload is placed and scraped
//   as a string so that its easer to manualy set a payload outside of this client.
//   Say maybe form the tradingview android application, or just another webbrowser
//   *********************************/
//   return new Promise((resolve2, reject2) => {
//     orderPayload = orderPayload.replace(/:\s*/g, ':').replace(/(,\s*)|(\s+)/g,'|').split('|')
//     payload = {}
//     return new Promise((resolve, reject) => {
//       for (let i=0; i < orderPayload.length; i++) {
//         match = orderPayload[i].replace(/(\s)/g,'').match(/(^.+?):(.+?)(,|$)/)
//         if (match) {
//           if (match[1].toLowerCase() === 'update' || match[1].toLowerCase()
//           === 'interval') {
//             //@DEV Check to make sure there is a time unit i.e. M or S
//             try {
//               timeMatch = match[2].toUpperCase().match(/(\d+?)(M|S)/)
//               if (timeMatch[2] === 'M') {
//                 //@DEV change the minutes spesified in the alert to milliseconds
//                 payload = {
//                   ...payload,
//                   [match[1].toLowerCase()]: timeMatch[1] * 60000
//                 }
//               } else if (timeMatch[2] === 'S') {
//                 //@DEV change the seconds spesified in the alert to milliseconds
//                 payload = {
//                   ...payload,
//                   [match[1].toLowerCase()]: timeMatch[1] * 1000
//                 }
//               }
//             } catch(err) {
//               //@DEV if there was no time unit provided throw an error
//               reject(new Error(`The ${match[1]
//                 .toLowerCase()} key does not contain a time unit`))
//             }
//           } else {
//             payload = {
//               ...payload,
//               [match[1].toLowerCase()]: match[2].toUpperCase()
//             }
//           }
//         }
//         if (i === orderPayload.length -1) {
//           resolve(payload)
//         }
//       }
//     }).then((payload) => {
//       return new Promise((resolve, reject) => {
//         if (payload.type === 'TRACKER') {
//           if (payload.hasOwnProperty('price')) {
//             //@DEV tracking orders should never have a price
//             reject(new Error('Tracking order never needs a price key'))
//           }
//           else if ((payload.hasOwnProperty('event') &&
//           payload.hasOwnProperty('symbol') &&
//           payload.hasOwnProperty('side') &&
//           payload.hasOwnProperty('update') &&
//           payload.hasOwnProperty('interval') &&
//           payload.hasOwnProperty('high') &&
//           payload.hasOwnProperty('low') &&
//           payload.hasOwnProperty('amount'))) {
//             //@DEV tracking orders should contain all of the tested keys
//             resolve(payload)
//           }
//           else {
//             reject(new Error('invalid Tracker order'))
//           }
//         }
//         else if (payload.type !== 'TRACKER') {
//           //@DEV price key may or maynot be included in a market payload
//           if (payload.hasOwnProperty('price') && (!(payload.price.length <= 10 && /^\d*\.?\d*$/
//             .test(payload.price)))) {
//             reject(new Error(`invalid price string ${payload.price}`))
//           }
//           else if (payload.hasOwnProperty('update') ||
//           payload.hasOwnProperty('interval') ||
//           payload.hasOwnProperty('high') ||
//           payload.hasOwnProperty('low')) {
//             reject(new Error(`Order contains invalid keys of '${
//               payload.hasOwnProperty('update') ? 'update'
//               : payload.hasOwnProperty('interval') ? 'interval'
//               : payload.hasOwnProperty('high') ? 'high'
//               : payload.hasOwnProperty('low') ? 'low' : ''
//             }'`))
//           }
//           else if (payload.hasOwnProperty('event') &&
//           payload.hasOwnProperty('symbol') &&
//           payload.hasOwnProperty('side') &&
//           payload.hasOwnProperty('amount')) {
//             resolve(payload)
//           } else {
//             reject(new Error('Invalid Market order missing or incorrect field'))
//           }
//         }
//       }).then((payload) => {
//         resolve2(payload)
//       }).catch((err) => {
//         reject2(err)
//       })
//     }).catch((err) => {
//       reject2(err)
//     })
//   })
// }
















//
// function convertAndValidateOrder(orderPayload) {
//   /********************************
//   @DEV Convert and validate order. This payload is placed and scraped
//   as a string so that its easer to manualy set a payload outside of this client.
//   Say maybe form the tradingview android application, or just another webbrowser
//   *********************************/
//   return new Promise((resolve2, reject2) => {
//     orderPayload = orderPayload.replace(/:\s*/g, ':').replace(/(,\s*)|(\s+)/g,'|').split('|')
//     payload = {}
//     return new Promise((resolve, reject) => {
//
//     }).then((payload) => {
//       return new Promise((resolve, reject) => {
//
//       }).then((payload) => {
//         resolve2(payload)
//       }).catch((err) => {
//         console.log(err)
//         reject2(err)
//       })
//     }).then((payload) => {
//       resolve2(payload)
//     }).catch((err) => {
//       console.log(err)
//       reject2(err)
//     })
//   })
// }






//console.log(JSON.parse(orderPayload.Description))
