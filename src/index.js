import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import promise from 'redux-promise-middleware'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers  } from 'redux'
import thunk from 'redux-thunk'
import { testReducer } from './reducers/test.js'
import { rpcSwitchReducer } from './reducers/rpcSwitchReducer'
import { settingsReducer } from './reducers/settingsReducer'
import { toggleAlertLissnerReducer } from './reducers/webviewSwitchReducers'
const rootReducer = combineReducers({
    testReducer,
    rpcSwitchReducer,
    settingsReducer,
    toggleAlertLissnerReducer
})

const initialState = {};

const middleware = [
  thunk,
  promise()
  ];

export const store = createStore(rootReducer, initialState, applyMiddleware(...middleware))


ReactDOM.render((
    <Provider store={store}>
        <Router>
            <Route path="/" component={ App }/>
        </Router>
  </Provider>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
