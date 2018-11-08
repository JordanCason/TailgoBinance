import React, { Component } from 'react';
import {connect} from 'react-redux';
import { webview } from 'react-electron-web-view'
import styled from 'styled-components'

import {settingsSetBinanceApiAction, settingsGitBinanceApiAction} from '../actions/binanceApiActions.js'

class Home extends Component {

  render() {
    return (
      <HomeStyle>
          <div id='sideNav'>
              Home Page
              <button type="button" onClick={() => {document.getElementsByTagName("webview")[0].openDevTools();}}>test router</button>
              <button type='button' onClick={() => {this.props.settingsAction()}}>settings action</button>
              <button type='button' onClick={() => {this.props.settingsActiongit()}}>settings git</button>
          </div>
          <webview id="foo" src="https://www.tradingview.com/chart/xZlrCJ3o/" />
      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({
    //test: testReducer,
})

const mapActionsToProps = {
    settingsSetBinanceApiAction,
    settingsGitBinanceApiAction
    //testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(Home)

const HomeStyle = styled.div`
    display: inline-flex;
    height: 100%;
    width: 100%;
    background-color: #2f3241;

    color: white;
    #sideNav{
        width: 300px;

    }


    webview {
        height: 100%;
        width: 100%;
    }
`
