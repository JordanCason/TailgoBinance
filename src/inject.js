const tabletojson = require('tabletojson');
const {ipcRenderer} = require('electron')
var searchingForSignal = false;

console.log('injesct is here')
ipcRenderer.on('StopAlertLissner', () => {
    searchingForSignal = false;
})



ipcRenderer.on('StartAlertLissner', () => {
    console.log("in StartAlertLissner")
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
          console.log(payload)
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
                console.log(payload)
                ipcRenderer.sendToHost(payload)
            }
        }
    if (searchingForSignal) {
        await setTimeout(() => {signalCatch()}, 2000)
    }
}
