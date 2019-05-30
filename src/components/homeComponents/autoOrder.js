import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

class AutoOrder extends Component {

  constructor (props) {
    super(props);
    this.state = {
      'type': '',
      'update': {
        'frequancy': 1,
        'interval': 15,
        'frequancyUnit': 'M',
        'intervalUnit': 'M'
      },
      'price': {
        'low': 5,
        'high': 25,
      }
    }
    this.handleInput = this.handleInput.bind(this);
    this.handlePriceInput = this.handlePriceInput.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        [e.target.name]: e.target.value
      }
    })
  }

  handlePriceInput = e => {
    console.log(this.state)
    this.setState({
      ...this.state,
      'price': {
        [e.target.name]: e.target.value
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
          <input onClick={this.handleActive} name='type' className={this.state.type === 'Limit' ? '' : ''} type='button' value='Limit'/>
          <input onClick={this.handleActive} name='type' className={this.state.type === 'Market' ? '' : ''} type='button' value='Market'/>
          <input onClick={this.handleActive} name='type' className={this.state.type === 'Follow' ? '' : ''} type='button' value='Follow'/>
        </div>
        <p>Update Interval:</p>
        <div>
          <div>
          <p>Freqancy:</p>
            <div>
            <input onChange={this.handleUpdateInput} name='frequancy' className={this.state.type === 'Follow' ? '' : ''} type='text' value={this.state.update.frequancy}/>
            <input onClick={this.handleUpdateInput} name='frequancyUnit' className='unit' type='button' value={this.state.update.frequancyUnit}/>
            </div>
          </div>
          <p>+/-</p>
          <div>
          <p>Interval:</p>
            <div>
            <input onChange={this.handleUpdateInput} name='interval' className='' type='text' value={this.state.update.interval}/>
            <input onClick={this.handleUpdateInput} name='intervalUnit' className='unit' type='button' value={this.state.update.intervalUnit}/>
            </div>
          </div>
        </div>
        <p>Price Interval:</p>
        <div>
          <div>
          <p>Low:</p>
            <div>
            <input onChange={this.handlePriceInput} name='low' className={this.state.type === 'Follow' ? '' : ''} type='text' value={this.state.price.low}/>
            </div>
          </div>
          <p>+/-</p>
          <div>
          <p>High:</p>
            <div>
            <input onChange={this.handlePriceInput} name='high' className={this.state.type === 'Follow' ? '' : ''} type='text' value={this.state.price.high}/>
            </div>
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

.unit {
  width: 32px;
}

`
