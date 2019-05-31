import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
// import BigNumber from "./bignumber.js"

class AutoOrder extends Component {

  constructor (props) {
    super(props);
    this.state = {
      'type': '',
      'update': {
        'frequancy': 1,
        'interval': 15,
        'frequancyUnit': 'M',
        'intervalUnit': 'S'
      },
      'price': {
        'low': 5,
        'high': 25,
        'cryptolow': '0.00000005',
        'cryptohigh': '0.00000025',
      }
    }
    this.handleInput = this.handleInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleActive = this.handleActive.bind(this);
  }


  handleActive = e => {
    console.log(e)
    this.setState({
      ...this.state,
      'activeTab': e.target.value
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
        <input onClick={this.handleActive} className={this.state.activeTab === 'Limit' ? 'button activeTab' : 'button'} type='button' value='Limit'/>
        <input onClick={this.handleActive} className={this.state.activeTab === 'Market' ? 'button activeTab' : 'button'} type='button' value='Market'/>
        <input onClick={this.handleActive} className={this.state.activeTab === 'Follow' ? 'button activeTab' : 'button'} type='button' value='Follow'/>
        </div>
      </div>
      {this.state.activeTab === 'Follow' ?
      <div className='autoOrderBody'>
        <p>Update Interval:</p>
        <div>
          <div>
          <p>Freqancy: every {this.state.update.frequancy} {this.state.update.frequancyUnit === 'M' ? 'Minutes' : 'Seconds' } </p>
            <div>
            <input onChange={this.handleUpdateInput} name='frequancy' className='' value={this.state.update.frequancy}/>
            <button onClick={this.handleUpdateInput} name='frequancyUnit' className='button buttongray unit' value={this.state.update.frequancyUnit === 'M' ? 'S' : 'M' } type='button'>{this.state.update.frequancyUnit}</button>
            </div>
          </div>
          <p>+/-</p>
          <div>
            <p>Interval: every {this.state.update.interval} {this.state.update.intervalUnit === 'M' ? 'Minutes' : 'Seconds' }</p>
            <div>
            <input onChange={this.handleUpdateInput} name='interval' className='' value={this.state.update.interval}/>
            <button onClick={this.handleUpdateInput} name='intervalUnit' className='button buttongray unit' value={this.state.update.intervalUnit === 'M' ? 'S' : 'M' } type='button'>{this.state.update.intervalUnit}</button>
            </div>
          </div>
        </div>
        <p>Price Interval: </p>
        <div>
          <div>
            <p>Low: {this.state.price.cryptolow}</p>
            <div>
              <input onChange={this.handlePriceInput} name='low' className='' value={this.state.price.low}/>
            </div>
          </div>
          <p>+/-</p>
          <div>
            <p>High: {this.state.price.cryptohigh}</p>
            <div>
              <input onChange={this.handlePriceInput} name='high' className='' value={this.state.price.high}/>
            </div>
          </div>
        </div>
      </div> : <div></div>}
      <div>
        <div>
          <div className='submitbtn'>
            <button onClick={this.handleSubmit} name='' className='button buttongray' type='button' >Submit</button>
          </div>
          <p></p>
          <div className='cancelbtn'>
            <button onClick={this.handleSubmit} name='' className='button buttongray' type='button'>Cancel</button>
          </div>
        </div>
      </div>

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
div {
  display: flex;
  flex-direction: column;

}

div > div {
  flex: 1;
  flex-direction: row;
  padding: 0px 0px 5px 0px;
  border: none;

}
input{
  outline: none;
  border: none;
}

input:focus {
  outline: none;

}

div > div > div {
  display: flex;
  flex-direction: column;

}

div > div > div > div {
  display: flex;
  flex-direction: row;

}

div > div > div > div > input {
  flex: 1;
}

div > div > p {
  min-width: 40px;
}

.unit {
  max-width: 35px;
  min-width: 35px;
}

.autoOrderBody {
  margin: 0px 8px;
}

.autoOrderBody > p {
  font-weight: bold;
  padding-bottom: 8px;
}

.submitbtn {
    margin: 20px 0px 20px 8px;
}

.cancelbtn {
  margin: 20px 8px 20px 0px;
}

.button {
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  transition-duration: 0.4s;
  cursor: pointer;

}

.button:focus {
    outline: none;
}


.buttongray {
  background-color: #e7e7e7;
  color: black;
  border: none;
}

.buttongray:hover {
  background-color: #17629e;
}

}


.button4:hover {background-color: #17629e;}

.orderTypeButtons > .activeTab {
  background-color: #2f3241;
}


`
