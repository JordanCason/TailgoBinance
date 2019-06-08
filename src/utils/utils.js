export function convertPayload(orderPayload) {

  /********************************
  @DEV Convert and validate order. This payload is placed and scraped
  as a string so that its easer to manualy set a payload outside of this client.
  Say maybe form the tradingview android application, or just another webbrowser
  *********************************/
  return new Promise((resolve, reject) => {
    if (typeof(orderPayload) === 'object') {
      orderPayload = JSON.stringify(orderPayload)
    }
    console.log(orderPayload)
    orderPayload = orderPayload.replace(/(\'|\"|{|})/g, '').replace(/:\s*/g, ':')
    .replace(/(,\s*)|(\s+)/g,'|').split('|')
    console.log(orderPayload)
    let payload = {}
      for (let i=0; i < orderPayload.length; i++) {
        let match = orderPayload[i].replace(/(\s)/g,'').match(/(^.+?):(.+?)(,|$)/)
        if (match) {
          if (match[1].toLowerCase() === 'update' || match[1].toLowerCase()
          === 'interval') {
            //@DEV Check to make sure there is a time unit i.e. M or S
            try {
              let timeMatch = match[2].toUpperCase().match(/(\d+?)(M|S)/)
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


export function validateOrder(payload) {
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
          if (payload.hasOwnProperty('price') &&
          (!(payload.price.length <= 10 && /^\d*\.?\d*$/
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
            return reject(new Error(
              'Invalid Market order missing or incorrect field'))
          }
        }
      })
    }
