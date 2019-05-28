import React, { Component } from 'react';
import styled from 'styled-components'
import logo from './logo.svg';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { testReducer } from './reducers/test.js';
import Home from "./components/Home.js";
import Test from "./components/test.js";
import Settings from "./components/settings.js";
import { loadSettings } from './actions/settingsAction.js'
import { webviewSwitch } from './actions/webviewSwitchActions'
const electron = window.require("electron")
//cons t { default: installExtension, REDUX_DEVTOOLS } = window.require('electron-devtools-installer');

class App extends Component {
  constructor (props) {
    super(props);
    this.handleRenderer = this.handleRenderer.bind(this);
    this.openWebviewDevtools = this.openWebviewDevtools.bind(this);
}

componentDidMount() {
  //installExtension(REDUX_DEVTOOLS)
      //.then((name) => console.log(`Added Extension:  ${name}`))
      //.catch((err) => console.log('An error occurred: ', err));
    this.props.loadSettings()
    webviewSwitch()
    electron.ipcRenderer.on("menuClick", this.handleRenderer)
    electron.ipcRenderer.on("Webview_Devtools", this.openWebviewDevtools)

}

conponentWillUnmount() {
    electron.ipcRenderer.removeListener("menuClick", this.handleRenderer)
    electron.ipcRenderer.removeListener("Webview_Devtools", this.openWebviewDevtools)
}

handleRenderer(event, data) {
  if (this.props.history.location.pathname !== data){
    console.log(data)
    this.props.history.push(data)
  }
}

openWebviewDevtools(event, data) {
  document.getElementsByTagName("webview")[0].openDevTools();
}

    render() {
        return (
            <AppStyle id='here'>
              <div>
                <Route exact path="/" component={ Home }/>
                <Route exact path="/Test" component={ Test }/>
                <Route exact path="/Home" component={ Home }/>
                <Route exact path="/Settings" component={ Settings }/>
              </div>
              <webview id="foo" preload={`file:///home/jordan/git/TailgoBinance/src/inject.js`} src="https://www.tradingview.com/chart/KyFTcT28/" />
          </AppStyle>
        );
    }
}
//https://www.tradingview.com/chart/KyFTcT28/ disablewebsecurity='true'
const mapStateToProps = state => ({
    test: testReducer,
    settings: state.settingsReducer
})

const mapActionsToProps = {
  loadSettings,
  webviewSwitch
}

export default connect(mapStateToProps, mapActionsToProps)(App)

const AppStyle = styled.div`
display: flex;


div {
  flex-basis: 30%
  background-color: #131722;

}

webview {
  flex: 1
  background-color: #131722;

}
`
