import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { testReducer } from './reducers/test.js';
import { testAction } from './actions/test.js';
import Home from "./components/Home.js";
import Test from "./components/test.js";
const electron = window.require("electron")

class App extends Component {
  constructor (props) {
    super(props);
    this.handleRenderer = this.handleRenderer.bind(this);
    console.log(props)
}

componentDidMount() {
    this.props.testAction()
    electron.ipcRenderer.on("menuClick", this.handleRenderer)

}

conponentWillUnmount() {
    electron.ipcRenderer.removeListener("menuClick", this.handleRenderer)
}

handleRenderer(event, data) {
    if (this.props.history.location.pathname !== data){
        this.props.history.push(data)
    }
    console.log(this.props.history.location.pathname)

}

    render() {
        return (
            <div id='here'>
                <Route exact path="/" component={ Home }/>
                <Route exact path="/Test" component={ Test }/>
                <Route exact path="/Home" component={ Home }/>
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
