
function ipcSwitch(msg) {
  return new Promise((resolve, reject) => {
    console.log(msg)
      switch (msg[0]) {
        case 'TESTFUNK':
          testfunk(resolve, ...msg)
          break;
        case 'test2':
          console.log(...msg)
          break;
        default:
          console.log('No functioin to call')
          break;
      }
    })
}

function testfunk(resolve, funk, name, age) {
  resolve(arguments)
}


module.exports = ipcSwitch
