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
const electron = window.require("electron")

class App extends Component {
  constructor (props) {
    super(props);
    this.handleRenderer = this.handleRenderer.bind(this);
    this.openWebviewDevtools = this.openWebviewDevtools.bind(this);
}

componentDidMount() {
    //this.props.testAction()
    this.props.loadSettings()
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
              <webview id="foo" src="https://www.tradingview.com/chart/KyFTcT28/" />
          </AppStyle>
        );
    }
}

const mapStateToProps = state => ({
    test: testReducer,
    settings: state.settingsReducer
})

const mapActionsToProps = {
  loadSettings
}

export default connect(mapStateToProps, mapActionsToProps)(App)

const AppStyle = styled.div`
display: inline-flex;
height: 100%;
width: 100%;

div {
  height: 100%;
  width: 30%;
  background-color: #2f3241;
}

webview {
  background-color: gray;
  height: 100%;
  width: 100%;
}
`
