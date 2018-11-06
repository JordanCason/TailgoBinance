import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter, Router, Route, Redirect } from 'react-router-dom';

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
    console.log('renderer lissining')
    electron.ipcRenderer.on("test", this.handleRenderer)
  }

  conponentWillUnmount() {
    console.log('render down')
    electron.ipcRenderer.removeListener("test", this.handleRenderer)
  }

  handleRenderer(event, data) {
    console.log(this)
    console.log(event)
    console.log(data)
  }

  render() {
    return (

        <div>
          <Route exact path="/" component={ Home }/>
          <Route exact path="/test" component={ Test }/>
          </div>
    );
  }
}

export default App;
