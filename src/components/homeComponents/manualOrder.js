import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

class ManualOrder extends Component {

  constructor (props) {
    super(props);
    this.state = {}
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.settingsSetBinanceApiAction(this.state.APIKEY, this.state.APISECRET)
  }



  render() {
    return (
      <ManualStyle>
          <div>
          </div>
          <form>
            { this.props.orderType === 'Limit' ? <div className='inputcontainer'>
            <label>Price:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.price}  name='price'/>
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                : 'UKN'}</p>
              </div>
            </div> : <div></div>}
            <div className='inputcontainer'>
              <label>Amount:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.amount} name='amount'/>
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
            <div className='inputcontainer'>
              <label className=''>Total:</label>
              <div className='inputrow'>
                <input onChange={this.handleInput} value={this.state.total} name='total' />
                <p className='base'>{this.props.webviewSwitch.currentTicker.ticker
                  ? this.props.webviewSwitch.currentTicker.ticker.slice(-3)
                  : 'UKN'}</p>
              </div>
            </div>

            <div className='submitcontainer' >
              <div className='submitbutton'>
                <button className={this.props.side === 'BUY' ? 'button buttongreen' : 'button buttonred' } type='button'>{this.props.side} {this.props.webviewSwitch.currentTicker.ticker.slice(0,3)}</button>
              </div>
            </div>
          </form>
      </ManualStyle>
    );
  }
}

const mapStateToProps = state => ({
  webviewSwitch: state.toggleAlertLissnerReducer,
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(ManualOrder)

const ManualStyle = styled.div`

form {
  display: flex;
  flex-direction: column;
}

form > div {
  display flex;
  flex-direction: column;
}

form > div > div {
  display flex;
  background: green;
}

form > div > div > p {
  color: gray;
  width: 32px;
  background-color: white;
  border: 0px solid white;

}

.inputcontainer {
  padding: 5px 8px;
}

.percencontainer {
  padding: 0px 8px;
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

.buttongray {
  background-color: #e7e7e7;
  color: black;
  border: none;
}

.buttongray:hover {
  background-color: #17629e;
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

.buttonred:hover {
  background-color: #f44336;
  color: white;
}


.button4:hover {background-color: #17629e;}

/* .inputcontainer {
  padding-left: 5px;
  padding-right: 20px;
}
.percentagebuttons {
  display: flex;
  margin-bottom: 5px;
}

.percentagebuttons input {
  flex: 1;
}

.submitbutton {
  display: flex;
  margin-bottom: 10px;
}
.submitbutton button {
  flex: 1
}

.ticker {
  display: flex;
  flex-direction: row;
}

.inputrow {
  display: flex;

}
.inputrow input {
  flex 1;
  background-color: white;
  border: 0px solid white;
  margin-bottom: 5px;
}
.inputrow input:focus {
  outline: none;
}
.inputrow p {
  color: gray;
  width: 32px;
  background-color: white;
  border: 0px solid white;
  margin-bottom: 5px;
}

span {
  background-color: white;
}

.button {
  border: none;
  color: white;
  padding: 5px 8px;
  text-align: center;
  transition-duration: 0.4s;
  cursor: pointer;
}

.tickerFull {
  padding: 5px 8px;
  text-align: center;
  font-size: 16pt;
}

.button4 {
  background-color: #e7e7e7;
  color: black;
  border: none;
}

.button1 {
  background-color: #4CAF50;
  color: black;
  border: none;
}

.button1:hover {
  background-color: #4CAF50;
  color: white;
}

.button4:hover {background-color: #17629e;} */

`
