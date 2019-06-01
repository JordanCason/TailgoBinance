import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
// import BigNumber from "./bignumber.js"
import { sendAlertToWebviewAction } from '../../actions/webviewSwitchActions.js'


class AutoOrder extends Component {

  constructor (props) {
    super(props);
    this.state = {
      'activeTab': 'Limit',
      'activeOrder': false,
      'update': {
        'frequancy': 1,
        'interval': 15,
        'frequancyUnit': 'M',
        'intervalUnit': 'S'
      },
      'price': {
        'low': 5,
        'high': 25,
        'randomlow': '0.00000005',
        'randomhigh': '0.00000025',
      }
    }
    this.handleInput = this.handleInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate = e => {
    console.log(e.target.name)

    if (e.target.name === 'Cancel') {
      sendAlertToWebviewAction('Cancel')
      return
    }
    console.log('past if')
    if (!this.state.activeOrder) {
      console.log('Must pick a side BUY / SELL')
    }
    console.log('past if 2')
    if (this.props.webviewSwitch.createAlertPopup.isOpen) {
      console.log('popup is alive')
      //@DEV build the string to place in trading view alert textbox
      if (e.target.name === 'Create') {
        let setOrder =
`event: ORDER,
symbol: ${this.props.webviewSwitch.currentTicker.ticker},
type: ${this.state.activeTab.toUpperCase()},
side: ${this.state.activeOrder},
update: ${this.state.update.frequancy.toString()}${this.state.update.frequancyUnit},
interval: ${this.state.update.interval.toString()}${this.state.update.intervalUnit},
low: ${this.state.price.randomlow},
high: ${this.state.price.randomhigh},`
        sendAlertToWebviewAction(setOrder)
      }
    }
  }

  handleActive = e => {
    console.log(this.state)
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  handleInput = e => {
    console.log(this.state)
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  handleUpdateInput = e => {
    console.log(this.state)
    this.setState({
      ...this.state,
      'update': {
        ...this.state.update,
        [e.target.name]: e.target.value
      }
    })
  }

  handlePriceInput = e => {
    if (e.target.value.length > 8 || !/^\d*$/.test(e.target.value)) {
      return
    }
    var number = '0.'
    for (var i=0; i < 8 - e.target.value.length; i++) {
      number += '0'
    }

    console.log(this.state)
    this.setState({
      ...this.state,
      'price': {
        ...this.state.price,
        [e.target.name]: e.target.value,
        ['crypto' + e.target.name]: number + e.target.value.toString()
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    // this.props.settingsSetBinanceApiAction(this.state.APIKEY, this.state.APISECRET)
  }



  render() {
    return (
      <AutoStyle>
      <div>
        <div className='orderTypeButtons'>
        <input onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Limit' ? 'button activeTab' : 'button'} type='button' value='Limit'/>
        <input onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Market' ? 'button activeTab' : 'button'} type='button' value='Market'/>
        <input onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Follow' ? 'button activeTab' : 'button'} type='button' value='Follow'/>
        </div>
      </div>
      <form>
        <div className='sideContainer'>
          {this.state.activeTab === 'Follow' ?
          <div className='inputcontainer'>
          <label>Update Interval:</label><br/>
          <label>Freqancy: every {this.state.update.frequancy} {this.state.update.frequancyUnit === 'M' ? 'Minutes' : 'Seconds' }</label>
            <div className='inputrow'>
              <input onChange={this.handleUpdateInput} name='frequancy' value={this.state.update.frequancy}/>
              <button onClick={this.handleUpdateInput} name='frequancyUnit' className='button buttongray unit' value={this.state.update.frequancyUnit === 'M' ? 'S' : 'M' } type='button'>{this.state.update.frequancyUnit}</button>
            </div>
          </div>
          : <div style={{display: 'none'}}></div>}
          {this.state.activeTab === 'Follow' ?
          <div className='inputcontainer'>
          <label>Price Interval: </label><br/>
          <label>Low: {this.state.price.randomlow}</label>
            <div className='inputrow'>
              <input onChange={this.handlePriceInput} name='low' className='' value={this.state.price.low}/>
              <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
            </div>
          </div>
          : <div style={{display: 'none'}}></div>}
          <div className='inputcontainer'>
            <label>Amount:</label>
            <div className='inputrow'>
              <input onChange={this.handleInput} value='0.00000' name='amount'/>
              <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
            </div>
          </div>
          <div className='percencontainer'>
            <label className=''></label>
            <div className='percentagebuttons'>
              <input className='button buttongray' type='button' value='25%'/>
              <input className='button buttongray' type='button' value='50%'/>
              <input className='button buttongray' type='button' value='75%'/>
              <input className='button buttongray' type='button' value='100%'/>
            </div>
          </div>
          <div className='submitcontainer' >
            <div className='submitbutton'>
              <button onClick={this.handleActive} name='activeOrder' value='BUY' className={this.state.activeOrder === 'BUY' ? 'button buttongray activeOrder' : 'button buttongray'} type='button'>BUY</button>
              <button onClick={this.handleActive} name='activeOrder' value='SELL' className={this.state.activeOrder === 'SELL' ? 'button buttongray activeOrder' : 'button buttongray'} type='button'>SELL</button>
            </div>
          </div>

          <div className='submitcontainer' >
            <div className='submitbutton'>
              <button name='Create' onClick={this.handleCreate} className='button buttongray'  type='button'>Create</button>
              <button name='Cancel' onClick={this.handleCreate} className='button buttongray btnredhover' type='button'>Cancel</button>
            </div>
          </div>
        </div>
        <div className='sideContainer'>
          {this.state.activeTab === 'Follow' ?
          <div className='inputcontainer'>
          <label>Update Interval:</label><br/>
          <label>Interval: every {this.state.update.interval} {this.state.update.intervalUnit === 'M' ? 'Minutes' : 'Seconds' }</label>
            <div className='inputrow'>
            <input onChange={this.handleUpdateInput} name='interval' className='' value={this.state.update.interval}/>
            <button onClick={this.handleUpdateInput} name='intervalUnit' className='button buttongray unit' value={this.state.update.intervalUnit === 'M' ? 'S' : 'M' } type='button'>{this.state.update.intervalUnit}</button>
            </div>
          </div>
          : <div style={{display: 'none'}}></div>}
            {this.state.activeTab === 'Follow' ?
          <div className='inputcontainer'>
          <label>Price Interval: </label><br/>
          <label>High: {this.state.price.randomhigh}</label>
            <div className='inputrow'>
              <input onChange={this.handlePriceInput} name='high' className='' value={this.state.price.high}/>
              <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
            </div>
          </div>
          : <div style={{display: 'none'}}></div>}
          <div className='inputcontainer'>
            <label></label>
            <div className='inputrow'>
            </div>
          </div>
          <div className='percencontainer'>
            <label className=''></label>
            <div className='percentagebuttons'>
            </div>
          </div>
          <div className='submitcontainer' >
            <div className='submitbutton'>
            </div>
          </div>

          <div className='submitcontainer' >
            <div className='submitbutton'>
            </div>
          </div>
        </div>
      </form>


      </AutoStyle>
    );
  }
}

const mapStateToProps = state => ({
  webviewSwitch: state.toggleAlertLissnerReducer,
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(AutoOrder)

const AutoStyle = styled.div`

form {
  display: flex;
  flex-direction: row;
}

.sideContainer {
  display: flex;
  flex-direction: column;
}

.sideContainer > div {

}

.sideContainer > div > div {
  display: flex;
  background: green;
}

.sideContainer > div > div > p {
  color: gray;
  width: 32px;
  background-color: white;
  border: 0px solid white;

}

.inputcontainer {
  padding: 5px 8px;
}

.inputcontainer label:first-child {
  font-weight: bold;
}

.percencontainer {
  padding: 0px 8px 20px 8px;
}

.submitcontainer{
  padding: 0px 8px;
  padding-bottom: 20px;
}
.submitcontainer > div {
  display: flex;
}
.submitcontainer > div > button {
  flex: 1;
}

input {
  flex: 1;
  background-color: white;
  border: 0px solid white;
}

input:focus {
  outline: none;
}

.button {
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  transition-duration: 0.4s;
  cursor: pointer;
}

.button {
  outline: none;
}

.buttongray {
  background-color: #757882;
  color: black;
  border: none;
}

.buttongray:hover {
  background-color: #17629e;
  color: white;
}

.activeOrder {
  background-color: #17629e;
  outline: none;
  color: white;
}

.buttongreen {
  background-color: #4CAF50;
  color: black;
  border: none;
}

.buttongreen:hover {
  background-color: #4CAF50;
  color: white;
}

.buttonred {
  background-color: #f44336;
  color: black;
  border: none;
}

.btnredhover:hover {
  background-color: #f44336;
  color: white;
}


.button4:hover {background-color: #17629e;}

`
