const tabletojson = require('tabletojson');
const {ipcRenderer} = require('electron')
var searchingForSignal = false;

ipcRenderer.on('StopAlertLissner', () => {
  searchingForSignal = false;
})

ipcRenderer.on('StartAlertLissner', () => {
   searchingForSignal = true;
   console.log('getting signal')
   signalCatch()
})

function signalCatch() {
  let createAlertVisible = false
  let alertPopupTarget = document.querySelector("#overlap-manager-root");
  let alertPopupconfig = {
    characterData: true,
    attributes: false,
    childList: true,
    subtree: false
  };

  const alertPopupcallback = function(mutation, observer) {
    /* This observer is the function watching over the overlap-manager-root
    node. This is where all popups above the trading chart are dynamicly
    inserted. From here we distribute to the corisponding function handlers */
    if (!searchingForSignal) {
      observer.disconnect()
    }
    let noderemoved = mutation["0"].removedNodes.length === 0 ? true : false
    let target = mutation["0"].target
    // @ DEV handel single alerts in a popup
    let title = target.querySelector('.tv-alert-notification-dialog__title')
    if (title && /^Alert on /.test(title.innerText)) {
      targetSingleAlertPanel(target)
    }
    // @DEV Handel multiple allerts in the same popup
    let multiAlertTitle = target.querySelector('.js-title-text.tv-dialog__title')
    if (multiAlertTitle && multiAlertTitle.innerText === 'Alert Notifications') {
      targetMultiAlertPanel(target)
    }
    // @DEV handle all posible create alert popups
    let createAlertTitle = target.querySelector('.tv-dialog__title > div')
    if (createAlertTitle && /^Create Alert on /
    .test(createAlertTitle.innerText)) {
      ipcRenderer.removeAllListeners('incertAlertStringInTextbox');
      targetCreateAlertPanel(target, createAlertVisible)
      createAlertVisible = true
    } else if (createAlertVisible) {
      createAlertVisible = false
      ipcRenderer.removeAllListeners('incertAlertStringInTextbox');
      ipcRenderer.sendToHost({
        type: "CREATE_ALERT_POPUP",
        payload: {
          isOpen: false,
        }
      })
    }
  }
  let observer = new MutationObserver(alertPopupcallback);
  observer.observe(alertPopupTarget, alertPopupconfig);
}

function targetCreateAlertPanel(target, createAlertVisible) {
  /* This function will minipulate the alert popup and let
  the user konw how to submit the auto order  */
  console.log('in targetCreateAlertPanel')
  ipcRenderer.sendToHost({
    type: "CREATE_ALERT_POPUP",
    payload: {
      isOpen: true,
    }
  })

  // setting target variabls
  let submitbuttn = target
    .querySelector(".js-submit-button")
  let cancelbutten = target
    .querySelector(".js-cancel-button")
  let checkboxbody = target
    .querySelector('form > fieldset > span:nth-child(8) \
         > div:nth-child(2)')
  let exitbutton = target
    .querySelector(".js-dialog__close")
  let alertform = target
    .querySelector("form")
  let textarea = target
    .querySelector('.tv-control-textarea')

  // remove elements form the alert popup
  textarea.setAttribute("style", "display: none;");
  checkboxbody.setAttribute("style", "display: none;");
  submitbuttn.parentNode.setAttribute("style", "display: none;");
  target.querySelector('form > fieldset')
    .setAttribute("style", "margin: 0;");
  target.querySelector('form > fieldset > \
         label:nth-child(9)').setAttribute("style", "display: none;");

  // insert html element into the alert popup
  if (!target.querySelector(".FinishAuto")) {
    let newnode = document.createElement('div')
    newnode.innerHTML = `
         <style>
         .FinishAuto {
           padding: 30px 30px 30px 0px;
           font-size: 14px;
           font-weight: 700;
         }
         </style>
         <div class='FinishAuto'>
         Finish automated order in the panel to the left.
         </div>
         `
    alertform.appendChild(newnode)
  }

  ipcRenderer.once('incertAlertStringInTextbox', (event, alertString) => {
    // @ DEV handle the submit and cansel actions
    if (alertString == 'Cancel') {
      // @ DEV if the cansel button on the left panel is clicked.
      exitbutton.click()
    } else {
      // @DEV when user clicks to create the automated alert this will fill
      // @DEV the text box and submit the alertString for scraping later.
      textarea.value = alertString
      textarea.dispatchEvent(new Event('change', {
        bubbles: true
      }))
      submitbuttn.click()
    }
  })
}

function targetMultiAlertPanel(target) {
  /* @DEV This will probibly never fire but its here just incase.
  when to alerts fire off at the same time or near the same time befor the
  user where to click "ok" than a new popup is crated contaning
  the alerts in a table. */
  const tableListedAlerts = target.querySelectorAll('tbody > tr')
  const promis = new Promise((resolve, reject) => {
    try {
      console.log(tableListedAlerts.length)
      for (let i = 0; i < tableListedAlerts.length; i++) {
        let payload = {
          type: "SCRAPED_ALERT",
          payload: tableListedAlerts[i].children["1"].innerText
        }
        console.log(payload)
        //ipcRenderer.sendToHost(payload)
      }
      console.log('resolve')
      resolve()
    }
    catch(err) {
      console.log(err)
    }
  }).then(() => {
    target.querySelector('.js-dialog__close').click()
  })
}

function targetSingleAlertPanel(target) {
  /* @DEV handls the single alert pupup that contains the
  order for the exchange */
  let textbox = target.querySelector('.tv-alert-notification-dialog__subtitle')
  .innerText
  let payload = {
    type: "SCRAPED_ALERT",
    payload: textbox
  }
  console.log(payload)
  target.querySelector('[data-name=ok]').click()
}

ipcRenderer.on('Start', () => {
  // @DEV Start gets triggerd on program init
  (async function checkForObjets() {
    let ticker
    let _exchange
    let _tickerFull
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

  let targetNode = document.querySelector(".chart-loading-screen");
  let config = { characterData:true, attributes: true, childList: false, subtree: false };
  let mutationCount=0
  let ticker
  let exchange
  let tickerFull
  let _exchange
  let _tickerFull
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
        ticker = document.querySelector("#header-toolbar-symbol-search > div > input").value.split(':');
        ticker = ticker.length === 2 ? ticker[1] : ticker[0]
        _exchange = document.querySelector('.pane-legend-title__details > .pane-legend-title__wrap-text').innerHTML
        _tickerFull = document.querySelector('.pane-legend-title__description > .pane-legend-title__wrap-text').innerHTML

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
