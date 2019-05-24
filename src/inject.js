


const {ipcRenderer} = require('electron')
    ipcRenderer.on('ping', () => {
        console.log('testing ipcRenderer')
        thething = document.getElementsByTagName("title")[0].innerHTML
        ipcRenderer.sendToHost(thething)
    })
