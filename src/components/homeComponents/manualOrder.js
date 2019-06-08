import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import { sendAlertToWebviewAction } from '../../actions/webviewSwitchActions.js'
import { getTickerPrice, initBinanceApi, getBallance, placeOrder, signalHandler } from '../../actions/binanceApiActions.js'
import { convertPayload, validateOrder } from '../../utils/utils.js'

import {BigNumber} from 'bignumber.js';

class ManualOrder extends Component {


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
      'priceRange': {
        'low': 5,
        'high': 25,
        'randomlow': '0.00000005',
        'randomhigh': '0.00000025',
      },
      'buyAmount': '',
      'buyPrice': '',
      'buyTotal': '',
      'sellAmount': '',
      'sellPrice': '',
      'sellTotal': '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate = e => {
    console.log('here')
    if (e.target.name === 'Cancel') {
      sendAlertToWebviewAction('Cancel')
      return
    }
    if (!this.state.activeOrder) {
      console.error('Must pick a side BUY / SELL')
      return
    }
    let price = this.state.activeOrder === 'BUY' ? this.state.buyPrice : this.state.sellPrice
    let amount = this.state.activeOrder === 'BUY' ? this.state.buyAmount : this.state.sellAmount
    if (this.props.webviewSwitch.createAlertPopup.isOpen) {
      console.error('alert window must be open')
      //@DEV build the string to place in trading view alert textbox
      if (e.target.name === 'Create') {
        if (this.state.activeTab !== 'Tracker') {
          let setOrder =
`event: ORDER,
symbol: ${this.props.webviewSwitch.currentTicker.ticker},
type: ${this.state.activeTab.toUpperCase()},
side: ${this.state.activeOrder},
amount: ${amount}
price: ${price}`
          sendAlertToWebviewAction(setOrder)
        }
        if (this.state.activeTab === 'Tracker') {
          let setOrder =
`event: ORDER,
symbol: ${this.props.webviewSwitch.currentTicker.ticker},
type: ${this.state.activeTab.toUpperCase()},
side: ${this.state.activeOrder},
update: ${this.state.update.frequancy.toString()}${this.state.update.frequancyUnit},
interval: ${this.state.update.interval.toString()}${this.state.update.intervalUnit},
low: ${this.state.priceRange.low},
high: ${this.state.priceRange.high},
amount: ${amount}`
          sendAlertToWebviewAction(setOrder)
        }
        this.setState({
          ...this.state,
          'activeOrder': false
        })
      }
    }
  }


  handleActiveOrder = (e) => {
    if (this.props.config.autoOrder === false) {
      if (e.target.name === 'Cancel') {
        sendAlertToWebviewAction('Cancel')
        return
      }
      if (!this.props.binaceApi.apiLoaded) {
        console.error('Exchange not connected')
        return
      }
      // place an order
      console.log('Place Manual Order')
      let price = e.target.value === 'BUY' ? this.state.buyPrice : this.state.sellPrice
      let amount = e.target.value === 'BUY' ? this.state.buyAmount : this.state.sellAmount
      if (this.state.activeTab !== 'Tracker') {
        placeOrder({
          type: this.state.activeTab.toUpperCase(),
          symbol: this.props.webviewSwitch.currentTicker.ticker,
          side: e.target.value,
          amount: amount,
          price: price,
        })
      }
      if (this.state.activeTab === 'Tracker') {
        convertPayload({
          event: 'ORDER',
          type: this.state.activeTab.toUpperCase(),
          symbol: this.props.webviewSwitch.currentTicker.ticker,
          side: e.target.value,
          amount: amount,
          update: `${this.state.update.frequancy.toString()}${this.state.update.frequancyUnit}`,
          interval: `${this.state.update.interval.toString()}${this.state.update.intervalUnit}`,
          low: this.state.priceRange.low,
          high: this.state.priceRange.high
        }).then((payload) => {
          validateOrder(payload).then((result) => {
            signalHandler(result)
          }).catch((err) => {
            console.error(err)
          })
        }).catch((err) => {
          console.error(err)
        })
      }
    }
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  handleActive = e => {
    this.setState({
      ...this.state,
      'buyAmount': '',
      'buyPrice': '',
      'buyTotal': '',
      'sellAmount': '',
      'sellPrice': '',
      'sellTotal': '',
      [e.target.name]: e.target.value
    })
  }

  handleInput = e => {
    let buyTotal = ''
    let sellTotal = ''
    if (!/^(\d*\.?\d*)$/.test(e.target.value)) {
      // @DEV only allow digits and one period in the input box
      return
    }
    let value = e.target.value.split('.')
    // @DEV If a decimal value is longer than 8 digits, slice them off.
      if ( value.length > 1 && value[1].length > 8 ) {
        value = value[0] + '.' + value[1].slice(0,8)
      }

      if (/(buyPrice|buyAmount)/.test(e.target.name)) {
        // @DEV calculate the total buy side
        if (e.target.name === 'buyPrice') {
          buyTotal = BigNumber(e.target.value).multipliedBy(this.state.buyAmount).toFixed(8)
        }
        if (e.target.name === 'buyAmount') {
          buyTotal = BigNumber(this.state.buyPrice).multipliedBy(e.target.value).toFixed(8)
        }
          buyTotal = buyTotal.replace(/(NaN|\.?0*$)/, '')
        this.setState({
          ...this.state,
          [e.target.name]: typeof(value) === 'string' ? value : e.target.value,
          'buyTotal': buyTotal
        })
      }

      if (/(sellPrice|sellAmount)/.test(e.target.name)) {
        // @DEV calculate the total sell side
        if (e.target.name === 'sellPrice') {
          sellTotal = BigNumber(e.target.value).multipliedBy(this.state.sellAmount).toFixed(8)
        }
        if (e.target.name === 'sellAmount') {
          sellTotal = BigNumber(this.state.sellPrice).multipliedBy(e.target.value).toFixed(8)
        }
        sellTotal = sellTotal.replace(/(NaN|\.?0*$)/, '')
        this.setState({
          ...this.state,
          [e.target.name]: typeof(value) === 'string' ? value : e.target.value,
          'sellTotal': sellTotal
        })

      }
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
    this.setState({
      ...this.state,
      'priceRange': {
        ...this.state.priceRange,
        [e.target.name]: e.target.value,
        ['random' + e.target.name]: number + e.target.value.toString()
      }
    })
  }

  // handleAmountInput = e => {
  //   console.log(this.state)
  //   console.log(e.target.name)
  //   console.log(e.target.value)
  //   if (e.target.value.length > 10 || !/^(\d*\.?\d*)$/.test(e.target.value)) {
  //     return
  //   }
  //   this.setState({
  //     ...this.state,
  //       [e.target.name]: e.target.value
  //   })
  // }

  handleSubmit = (e) => {
    e.preventDefault()
  }

  render() {
    return (
      <ManualStyle>

          <div>
            <div className='orderTypeButtons'>
            <button onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Limit' ? 'activeTab' : ''} value='Limit'>Limit</button>
            <button onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Market' ? 'activeTab' : ''} value='Market'>Market</button>
            <button onClick={this.handleActive} name='activeTab' className={this.state.activeTab === 'Tracker' ? ' activeTab' : ''} value='Tracker'>Tracker</button>
            </div>
          </div>
          <div className="tickerFull">{this.props.webviewSwitch.currentTicker.tickerFull
            ? this.props.webviewSwitch.currentTicker.tickerFull : 'LOADING...'}
            </div>
          <div className='bodycontainer'>
          <div className='columncontainer'>
            { this.state.activeTab === 'Tracker' ?
            <div className='inputcontainer'>
            <label title=''>Update: {this.state.update.frequancy} {this.state.update.frequancyUnit === 'M' ? 'Minutes' : 'Seconds' }</label>
              <div className='inputrow'>
                <input onChange={this.handleUpdateInput} name='frequancy' value={this.state.update.frequancy}/>
                <button onClick={this.handleUpdateInput} name='frequancyUnit' className='buttongray unit' value={this.state.update.frequancyUnit === 'M' ? 'S' : 'M' }>{this.state.update.frequancyUnit}</button>
              </div>
            </div> : <div></div>}
            { this.state.activeTab === 'Tracker' ?
            <div className='inputcontainer'>
            <label title=''>Low Price: {this.state.priceRange.randomlow}</label>
              <div className='inputrow'>
                <input onChange={this.handlePriceInput} name='low' value={this.state.priceRange.low}/>
              </div>
            </div> : <div></div>}
            { this.state.activeTab !== 'Tracker' ?
            <div className='inputcontainer'>
            <label>Price:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.buyPrice}  name='buyPrice'/>
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
              </div>
            </div> : <div></div>}
            <div className='inputcontainer'>
              <label>Amount:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.buyAmount} name='buyAmount'/>
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(0,-3)
                : 'UKN'}</p>
              </div>
            </div>
            <div className='percencontainer'>
              <label className=''></label>
              <div className='percentagebuttons'>
                <button className='buttongray'>25%</button>
                <button className='buttongray'>50%</button>
                <button className='buttongray'>75%</button>
                <button className='buttongray'>100%</button>
              </div>
            </div>
            { this.state.activeTab !== 'Tracker' ?
            <div className='inputcontainer'>
              <label className=''>Total:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.buyTotal} name='total' />
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                  ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                  : 'UKN'}</p>
              </div>
            </div>
            : null }
            {this.props.config.autoOrder === true ?
            <div className='submitcontainer' >
            <label>Side:</label>
              <div className='submitbutton'>
                <button onClick={this.handleActiveOrder} name='activeOrder' value='BUY' className={this.state.activeOrder === 'BUY' ? 'button buttongreen activeOrder' : 'button buttongray buttongrayhover'}>BUY {this.props.webviewSwitch.currentTicker.ticker.slice(0,3)}</button>
              </div>
            </div> :
            <div className='submitcontainer' >
              <div className='submitbutton'>
                <button onClick={this.handleActiveOrder} name='activeOrder' value='BUY' className={this.state.activeOrder === 'BUY' ? 'button buttongreen buttongreenhover activeOrder' : 'button buttongreen buttongreenhover'}>BUY {this.props.webviewSwitch.currentTicker.ticker.slice(0,3)}</button>
              </div>
            </div>}
          </div>
          <div className='columncontainer'>
            { this.state.activeTab === 'Tracker' ?
            <div className='inputcontainer'>
            <label title=''>Interval: {this.state.update.interval} {this.state.update.intervalUnit === 'M' ? 'Minutes' : 'Seconds' }</label>
              <div className='inputrow'>
              <input onChange={this.handleUpdateInput} name='interval' className='' value={this.state.update.interval}/>
              <button onClick={this.handleUpdateInput} name='intervalUnit' className='button buttongray unit' value={this.state.update.intervalUnit === 'M' ? 'S' : 'M' } type='button'>{this.state.update.intervalUnit}</button>
              </div>
            </div> : <div></div>}
            { this.state.activeTab === 'Tracker' ?
            <div className='inputcontainer'>
            <label title=''>High Price: {this.state.priceRange.randomhigh}</label>
              <div className='inputrow'>
                <input onChange={this.handlePriceInput} name='high' className='' value={this.state.priceRange.high}/>
              </div>
            </div> : <div></div>}
            { this.state.activeTab !== 'Tracker' ? <div className='inputcontainer'>
            <label>Price:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.sellPrice}  name='sellPrice'/>
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
              </div>
            </div> : <div></div>}
            <div className='inputcontainer'>
              <label>Amount:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.sellAmount} name='sellAmount'/>
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(0,-3)
                : 'UKN'}</p>
              </div>
            </div>
            <div className='percencontainer'>
              <label className=''></label>
              <div className='percentagebuttons'>
                <button className='buttongray'>25%</button>
                <button className='buttongray'>50%</button>
                <button className='buttongray'>75%</button>
                <button className='buttongray'>100%</button>
              </div>
            </div>
            { this.state.activeTab !== 'Tracker' ?
            <div className='inputcontainer'>
              <label className=''>Total:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.sellTotal} name='total' />
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                  ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                  : 'UKN'}</p>
              </div>
            </div>
            : null }
            {this.props.config.autoOrder === true ?
            <div className='submitcontainer' >
            <label style={{'minHeight': '17px'}}> </label>
              <div name={console.log(this)} className='submitbutton'>
                  <button onClick={this.handleActiveOrder} name='activeOrder' value='SELL' className={this.state.activeOrder === 'SELL' ? 'button buttonred activeOrder' : 'button buttongray buttongrayhover'} type='button'>SELL</button>
              </div>
            </div>
            :
            <div className='submitcontainer' >
              <div className='submitbutton'>
                  <button onClick={this.handleActiveOrder} name='activeOrder' value='SELL' className={this.state.activeOrder === 'SELL' ? 'button buttonred' : 'button buttonred buttonredhover'} type='button'>SELL</button>
              </div>
            </div>}


          </div>

        </div>
        { this.props.config.autoOrder === true ?
        <div className='submitcontainer' >
          <div className='createbuttons'>
            <button name='Create' onClick={this.handleCreate} className='button buttongray buttongrayhover'  type='button'>Create</button>
            <button name='Cancel' onClick={this.handleCreate} className='button buttongray buttonredhover' type='button'>Cancel</button>
          </div>
        </div> : <div></div>}
      </ManualStyle>
    );
  }
}

const mapStateToProps = state => ({
  webviewSwitch: state.toggleAlertLissnerReducer,
  binaceApi: state.binanceApiReducer
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(ManualOrder)
const ManualStyle = styled.div`

/* .createbuttons > button:first-child {
   margin-right: 8px;
}

.createbuttons > button:last-child {
   margin-left: 8px;
} */
.activeOrder {
  background-color: #17629e;
  outline: none;
  color: white;
}

.createbuttons {
  display: flex;

  flex-direction: column;
}

.createbuttons > button {
    margin-bottom: 20px;
}

.bodycontainer {
  display: flex;
  flex-direction: row;
}

.columncontainer {
  flex: 1;
  flex-direction: column;
}

.columncontainer > div {
  display flex;
  flex-direction: column;
}

.columncontainer > div > div {
  display flex;
  background: green;
}

.columncontainer > div > div > p {
  color: gray;
  width: 32px;
  background-color: white;
  border: 0px solid white;

}

.inputcontainer {
  padding: 5px 8px;
}

.percencontainer {
  padding: 5px 8px;
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
  height: 18px;
  flex: 1;
  background-color: white;
  border: 0px solid white;
}

input:focus {
  outline: none;
}



button {
  flex: 1;
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  transition-duration: 0.4s;
  cursor: pointer;
  outline: none;
}

.buttongray {
  background-color: #757882;
  color: black;
  border: none;
}

.buttongrayhover:hover {
  background-color: #17629e;
}

.buttongreen {
  background-color: #4CAF50;
  color: black;
  border: none;
}

.buttongreenhover:hover {
  background-color: #4CAF50;
  color: white;
}

.buttonred {
  background-color: #f44336;
  color: black;
  border: none;
}

.buttonredhover:hover {
  background-color: #f44336;
  color: white;
}
.button4hover:hover {background-color: #17629e;}

.unit {
  max-width: 30px;
  padding: 0px 8px 0px 8px;
  height: 20px;
}


.orderTypeButtons {
 display: flex;
 flex-grow: 1
}

.orderTypeButtons > button {
 flex: 1;
 color: white;
 padding: 10px 8px;
 background-color: #131722;
 transition-duration: 0.4s;
 border: none;
}

.orderTypeButtons > button:focus {
  outline: none;
}

.orderTypeButtons > button:hover {
  background-color: #2f3241;
}

.orderTypeButtons > .activeTab {
  background-color: #2f3241;
}

.tickerFull {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0px
}

`
