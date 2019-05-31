import React, { Component } from 'react';
import {connect} from 'react-redux';
import { webview } from 'react-electron-web-view'
import styled from 'styled-components'
// import { toggleAlertLissnerAction } from '../actions/weabviewSwitchActions'
import {settingsSetBinanceApiAction, settingsGitBinanceApiAction, loadSettings} from '../actions/settingsAction.js'
import { exicuteNode } from '../actions/testIpcSwitchAction'
import { getTickerPrice, TestOrder1, TestOrder2, checkOrders, testTime, initBinanceApi, getBallance } from '../actions/binanceApiActions.js'

class Home extends Component {

  render() {
    return (
      <HomeStyle>
      <div id='sideNav'>
      <p>Auto Trading</p><br/>
      <button name="lissining" type='button' onClick={() => {console.log(this.props)}}>props</button><br/>
      <button name="lissining" type='button' onClick={() => {getTickerPrice()}}>ticker Price</button><br/>
      <button name="lissining" type='button' onClick={() => {TestOrder1()}}>TestOrder1</button><br/>
      <button name="lissining" type='button' onClick={() => {TestOrder2()}}>TestOrder2</button><br/>
      <button name="lissining" type='button' onClick={() => {checkOrders()}}>checkOrders</button><br/>
      <button name="lissining" type='button' onClick={() => {testTime('OPS')}}>testeTime</button><br/>
      <button name="lissining" type='button' onClick={() => {this.props.initBinanceApi()}}>initBinanceApi</button><br/>
      <button name="lissining" type='button' onClick={() => {getBallance()}}>getBallance</button><br/>




          <a>Test Functions</a><br/>
          <button type='button' onClick={() => {console.log(this.props)}}>this.props</button><br/>

          <button type='button' onClick={() => {this.props.exicuteNode('TESTFUNK', 'jordan', 29)}}>test send</button><br/>
          <br/>
          <br/>
          <a>Auto Trading</a><br/>
          // <a>Status: Lissining</a><br/>
          // <button name="lissining" type='button' onClick={() => {this.props.toggleAlertLissnerAction(!this.props.toggleAlertLissner.lissining)}}>{this.props.toggleAlertLissner.lissining ? 'True' : 'False'}</button>

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

      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({
    test: state.rpcSwitchReducer,
    toggleAlertLissner: state.toggleAlertLissnerReducer

})

const mapActionsToProps = {
    settingsSetBinanceApiAction,
    settingsGitBinanceApiAction,
    // toggleAlertLissnerAction,
    exicuteNode,
    loadSettings,
    initBinanceApi
    //testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(Home)

const HomeStyle = styled.div`
`

 //https://www.tradingview.com/chart/KyFTcT28/
