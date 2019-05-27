import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import { toggleAlertLissnerAction } from '../../actions/webviewSwitchActions.js'
import { getTickerPrice, TestOrder1, TestOrder2, checkOrders, testTime, initBinanceApi, getBallance } from '../../actions/binanceApiActions.js'

class Status extends Component {
  render() {
    return (
      <StatusStyle>
        <table>
          <tbody>
            <tr>
              <td>
              <button
              className={this.props.toggleAlertLissner.lissining ? 'button btntrue' : 'button btnfalse'}
              name="lissining"
              type='button'
              onClick={() => {this.props.toggleAlertLissnerAction(!this.props.toggleAlertLissner.lissining)}}>
                {this.props.toggleAlertLissner.lissining ? 'True' : 'False'}
              </button>
              Start watching for alerts
              </td>
            </tr>
            <tr>
              <td>
              <button
                className={this.props.binanceApi.apiLoaded ? 'button btntrue' : 'button btnfalse'}
                type='button'
                onClick={() => {this.props.initBinanceApi(this.props.binanceApi.apiLoaded)}}>
                {this.props.binanceApi.apiLoaded ? 'True' : 'False'}
              </button>
              Connect to Exchange
              </td>
            </tr>
          </tbody>
        </table>
      </StatusStyle>
    );
  }
}
//       <button name="lissining" type='button' onClick={() => {this.props.toggleAlertLissnerAction(!this.props.toggleAlertLissner.lissining)}}>{this.props.toggleAlertLissner.lissining ? 'True' : 'False'}</button>

const mapStateToProps = state => ({
  toggleAlertLissner: state.toggleAlertLissnerReducer,
  binanceApi: state.binanceApiReducer
})

const mapActionsToProps = {
  toggleAlertLissnerAction,
  initBinanceApi
}

export default connect(mapStateToProps, mapActionsToProps)(Status)

const StatusStyle = styled.div`
.button {
  /* background-color: #4CAF50; */
  width: 70px;
  border: none;
  padding: 8px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
  outline: none;
}

.btntrue {
  background-color: #4CAF50;
  color: black;
}

.btntrue:hover {
  background-color: #f44336;
  color: white;
}

.btnfalse {
  background-color: #f44336;
  color: black;
}

.btnfalse:hover {
  background-color: #4CAF50;
  color: white;
}


`
