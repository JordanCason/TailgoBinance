const NODE_EXICUTION = "NODE_EXICUTION"
export const NODE_EXICUTION_FULFILLED = "NODE_EXICUTION_FULFILLED"

const { ipcRenderer } = window.require('electron')

// example function for sending a message to electron to exicute a function
export function exicuteNode() {
  return {
  type: 'NODE_EXICUTION',
  payload: new Promise((resolve, reject) => {
      ipcRenderer.send('FUNCTION_CALL', Object.values(arguments))
      // one time lissiner for the result
      ipcRenderer.once(arguments[0], (event, arg,) => {
        resolve(Object.values(arg))
      })
    })
  }
}
