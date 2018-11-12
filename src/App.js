import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { testReducer } from './reducers/test.js';
import { testAction } from './actions/test.js';
import Home from "./components/Home.js";
import Test from "./components/test.js";
import Settings from "./components/settings.js";
const electron = window.require("electron")

class App extends Component {
  constructor (props) {
    super(props);
    this.handleRenderer = this.handleRenderer.bind(this);
    this.openWebviewDevtools = this.openWebviewDevtools.bind(this);
    console.log(props)
}

componentDidMount() {
    this.props.testAction()
    electron.ipcRenderer.on("menuClick", this.handleRenderer)
    electron.ipcRenderer.on("Webview_Devtools", this.openWebviewDevtools)

}

conponentWillUnmount() {
    electron.ipcRenderer.removeListener("menuClick", this.handleRenderer)
    electron.ipcRenderer.removeListener("Webview_Devtools", this.openWebviewDevtools)
}

handleRenderer(event, data) {
    if (this.props.history.location.pathname !== data){
        this.props.history.push(data)
    }
}

openWebviewDevtools(event, data) {
  document.getElementsByTagName("webview")[0].openDevTools();
}

    render() {
        return (
            <div id='here'>
                <Route exact path="/" component={ Home }/>
                <Route exact path="/Test" component={ Test }/>
                <Route exact path="/Home" component={ Home }/>
                <Route exact path="/Settings" component={ Settings }/>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    test: testReducer,
})

const mapActionsToProps = {
    testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(App)
