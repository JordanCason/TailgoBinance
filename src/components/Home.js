import React, { Component } from 'react';
import {connect} from 'react-redux';
import { webview } from 'react-electron-web-view'
import styled from 'styled-components'

import {settingsSetBinanceApiAction, settingsGitBinanceApiAction} from '../actions/binanceApiActions.js'
import { exicuteNode } from '../actions/testIpcSwitchAction'
class Home extends Component {

  render() {
    return (
      <HomeStyle>
          <div id='sideNav'>
              <a>Test Functions</a><br/>
              <button type='button' onClick={() => {this.props.settingsSetBinanceApiAction()}}>set API</button><br/>
              <button type='button' onClick={() => {this.props.settingsGitBinanceApiAction()}}>get API</button><br/>
              <button type='button' onClick={() => {this.props.exicuteNode('TESTFUNK', 'jordan', 29)}}>test send</button><br/>
              <br/>
              <br/>
              <a>Auto Trading</a><br/>
              <a>Status: Lissining</a><br/>
              <button type='button' onClick={() => {null()}}>ON</button><button type='button' onClick={() => {null()}}>OFF</button><br/>

              <br/>
              <br/>
              <a>Buy</a><br/>
              <a>Quantity:</a><br/>
              <input type='text' defaultValue='100'/>
              <button type='button' onClick={() => {null()}}>Max</button><br/>
              Price:<br/>
              <input type='text' defaultValue='0.05489587'/>
              <button type='button' onClick={() => {null()}}>Auto</button><br/>
              <button type='button' onClick={() => {null()}}>Set Buy</button><br/>
              <br/>
              <br/>
              <a>Sell</a><br/>
              <a>Quantity:</a><br/>
              <input type='text' defaultValue='100'/>
              <button type='button' onClick={() => {null()}}>Max</button><br/>
              Price:<br/>
              <input type='text' defaultValue='0.05489587'/>
              <button type='button' onClick={() => {null()}}>Auto</button><br/>
              <button type='button' onClick={() => {null()}}>Set Buy</button><br/>
              <br/>
              <br/>
              <br/>
              <br/>
              Insert Alert Action:<br/>
              Order:<br/>
              <button type='button' onClick={() => {null()}}>BUY</button>
              <button type='button' onClick={() => {null()}}>SELL</button><br/>
              <br/>
              Type:<br/>
              <button type='button' onClick={() => {null()}}>MAKER</button>
              <button type='button' onClick={() => {null()}}>TAKER</button>
              <button type='button' onClick={() => {null()}}>TRACKER</button>
              <button type='button' onClick={() => {null()}}>STOP</button><br/>
              <br/>
              Quantity:<br/>
              <input type='text' defaultValue='0.05489587'/><br/>
              <br/>
              <button type='button' onClick={() => {null()}}>Insert Data</button>



              <br/>
              <br/>
              <br/>
              <a>
              Json fromat<br/>
              Order: BUY/SELL/STOP<br/>
              Type: MAKER/TAKER/TRACKER<br/>
              Quantity: 100<br/>

              </a>
          </div>
          <webview id="foo" src="https://www.tradingview.com/chart/KyFTcT28/" /> //https://www.tradingview.com/chart/KyFTcT28/
      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({
    test: state.rpcSwitchReducer,

})

const mapActionsToProps = {
    settingsSetBinanceApiAction,
    settingsGitBinanceApiAction,
    exicuteNode
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

        min-width: 20%;

    }


    webview {
      background-color: gray;
        height: 100%;
        width: 100%;
    }
`
