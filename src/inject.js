const tabletojson = require('tabletojson');
const {ipcRenderer} = require('electron')
var searchingForSignal = false;

console.log('injesct is here')
ipcRenderer.on('StopAlertLissner', () => {
    searchingForSignal = false;
})



ipcRenderer.on('StartAlertLissner', () => {
    searchingForSignal = true;
    signalCatch()
    })

const signalCatch = async() => {
    console.log('hello')

        if (document.getElementsByClassName("tv-alert-notification-dialog__subtitle")[0]) {
            const alertWindowText = document.getElementsByClassName("tv-alert-notification-dialog__subtitle")[0].innerHTML
            const alertTitle = document.getElementsByClassName("tv-alert-notification-dialog__title")[0].innerHTML.replace("Alert on ", "")
          const payload = {
              type: "SINGLEALERT",
              payload: {
                  Alert: alertTitle,
                  Description: alertWindowText
              }
          }
          document.getElementsByClassName("js-dialog__action-click js-dialog__no-drag tv-button tv-button--primary")[0].click()
          ipcRenderer.sendToHost(payload)
        }

        const multiAlert = document.getElementsByClassName("js-title-text tv-dialog__title")[0]
        if (multiAlert) {
            if (multiAlert.innerHTML === "Alert Notifications") {
                console.log("Found Multi Alert")
                const multiAlertTable = document.querySelector(".js-alerts-multiple-notifications-dialog__table-container table").outerHTML;
                const converted = tabletojson.convert(multiAlertTable, {ignoreColumns: [2]});
                document.querySelector(".tv-dialog__close.js-dialog__close").click()
                const payload = {
                    type: "MULTIALERT",
                    payload: converted[0]
                }
                ipcRenderer.sendToHost(payload)
            }
        }
    if (searchingForSignal) {
        await setTimeout(() => {signalCatch()}, 2000)
    }
}

ipcRenderer.on('Start', () => {
  (async function checkForObjets() {
    // @DEV check for objects we need before exacuting the main function
    try {
      console.log('try')
      document.querySelector(".chart-loading-screen");
      ticker = document.querySelector("#header-toolbar-symbol-search > div > input").value.split(':')
      ticker = ticker.length === 2 ? ticker[1] : ticker[0]
      _exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
      _tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML
      if (ticker === '' || _exchange === '' || _tickerFull === '') {
        throw "value still blank";
      }
    }
    catch(err) {
      console.log(err)
      await setTimeout(() => {checkForObjets()}, 2000)
      return
    }
    const payload = {
      type: "CURRENT_TICKER",
      payload: {
        'exchange': _exchange,
        'tickerFull': _tickerFull,
        'ticker': ticker
      }
    }
    ipcRenderer.sendToHost(payload)
    // Set the current ticker at initial startup
    console.log('Document ready')
    mainFunction()
  })();
})

const mainFunction = () => {
  // ******* Section for returning current ticker and exchange *********
  let targetNode = document.querySelector(".chart-loading-screen");
  let config = { characterData:true, attributes: true, childList: false, subtree: false };
  let mutationCount=0
  const callback = async (mutation, observer) => {
    // @DEV MutationObserver callback fires every time .chart-loading-screen node changes
    mutationCount++
    if (mutationCount == 2 ) {
      // @DEV MutationObserver always fires twice so ignore the first one
      mutationCount = 0
      await setTimeout(() => {
        // @DEV setting a timeout of 5 millseconds because in every inctance I have checked
        // @DEV the 3 elements checked have already changed.
        // @DEV leaving the checkIfPaneChange just incase or if a connection is slow.
        let ticker = document.querySelector("#header-toolbar-symbol-search > div > input").value.split(':');
        ticker = ticker.length === 2 ? ticker[1] : ticker[0]
        let _exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
        let _tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML

        let i=0
        async function checkIfPaneChange() {
          // @DEV The function is sufficient, though not efficient and needs replacing.
          // @DEV MutationObserver was not able to pick up text changes in
          // @DEV <div>sometext</div>, and I am unable to figure out why.
          if (i < 5) {
            // @DEV most of the time this will top exicuting on the second check
            // @DEV with i = 10 in the if statment
            console.log(i)
            exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
            tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML
            if (_exchange !== exchange || _tickerFull !== tickerFull) {
              i = 5
              _exchange = exchange
              _tickerFull = tickerFull
              sendPaneChangePayload(ticker, exchange, tickerFull)
            }
          }
          i++
          await setTimeout(() => {checkIfPaneChange()}, 100)
          return
        }
        sendPaneChangePayload(ticker, _exchange, _tickerFull)
        checkIfPaneChange()
      }, 1)
    }
  };
  let observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  const sendPaneChangePayload = (ticker, exchange, tickerFull) => {
    const payload = {
      type: "CURRENT_TICKER",
      payload: {
        'exchange': exchange,
        'tickerFull': tickerFull,
        'ticker': ticker
      }
    }
    ipcRenderer.sendToHost(payload)
  }
}


  // Later, you can stop observing
  //observer.disconnect();



  //
  // document.querySelector(".symbol-list").addEventListener("click", (obj) => {
  //   console.log('clicked')
  //   console.log(obj)
  //   console.log(obj.path[1].getAttribute("class"))
  //   for (let i=0; i < 10; i++) {
  //     if (obj.path[i].getAttribute("class") == 'symbol-list-item ui-sortable-handle success') {
  //       let exchange = obj.path[i].attributes[1].nodeValue.split(':')[0]
  //       let ticker = obj.path[i].attributes[1].nodeValue.split(':')[1]
  //       let tickerFull = obj.path[i].childNodes[1].title.split(',')[0]
  //       sendPaneChangePayload(ticker, exchange, tickerFull)
  //     }
  //   }
  // })

//   document.querySelector("#header-toolbar-symbol-search > div > input").addEventListener("focusout", (obj) => {
//     document.activeElement.blur();
  //   let ticker = obj.target.value.split(':');
  //   ticker = ticker.length === 2 ? ticker[1] : ticker[0]
  //   let _exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
  //   let _tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML
  //   let i=0
  //   async function checkIfPaneChange() {
  //     // @DEV The function is sufficient, though not efficient and needs replacing.
  //     // @DEV MutationObserver was not able to pick up text changes in
  //     // @DEV <div>sometext</div>, and I am unable to figure out why.
  //     if (i < 5) {
  //       // @DEV most of the time this will top exicuting on the second check
  //       // @DEV with i = 10 in the if statment
  //       console.log(i)
  //       exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
  //       tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML
  //       if (_exchange !== exchange || _tickerFull !== tickerFull) {
  //         i = 5
  //         _exchange = exchange
  //         _tickerFull = tickerFull
  //         sendPaneChangePayload(ticker, exchange, tickerFull)
  //       }
  //     }
  //     i++
  //     await setTimeout(() => {checkIfPaneChange()}, 100)
  //     return
  //   }
  //   sendPaneChangePayload(ticker, _exchange, _tickerFull)
  //   checkIfPaneChange()
  // });
  //





// window.addEventListener('DOMContentLoaded', (event) => {
//     console.log('DOM fully loaded and parsed');
//     console.log(document.querySelector("#header-toolbar-symbol-search"))
// });
//
// document.addEventListener("DOMContentLoaded", function(event) {
//   console.log('Started')
//   console.log(document.querySelector("#header-toolbar-symbol-search"))
// });
