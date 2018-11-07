


const {ipcRenderer} = require('electron')
    ipcRenderer.on('ping', () => {
        thething = document.getElementsByTagName("title")[0].innerHTML
        ipcRenderer.sendToHost(thething)
    })
