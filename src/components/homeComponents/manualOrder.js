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
          <form className=''>
            <div className='ticker'>
              <h3>Buy ENJ</h3>
              <i className='' >0.30129727 ETH</i>
            </div>
            <div className='inputcontainer'>
            <label className=''>Price:</label>
              <div className='inputrow'>
                <input className='' onChange={this.handleInput} value={this.state.price}  name='price'/>
                <p className='base'>ETH</p>
              </div>
            </div>
            <div className='inputcontainer'>
              <label className='' >Amount:</label>
              <div className='inputrow'>
                <input className='' onChange={this.handleInput} value={this.state.amount} name='amount'/>
                <p className='base'>ETH</p>
              </div>
            </div>
            <div className='inputcontainer'>
              <label className=''></label>
              <div className='percentagebuttons'>
                <input className='button button4'  type='button' value='25%'/>
                <input className='button button4'  type='button' value='50%'/>
                <input className='button button4'  type='button' value='75%'/>
                <input className='button button4'  type='button' value='100%'/>
              </div>
            </div>
            <div className='inputcontainer'>
              <label className=''>Total:</label>
              <div className='inputrow'>
                <input className='' onChange={this.handleInput} value={this.state.total} name='total' />
                <p className='base'>ETH</p>
              </div>
            </div>

            <div className='inputcontainer' >
              <div className='submitbutton'>
                <button className='button button1' type='button'>Buy ENJ</button>
              </div>
            </div>
          </form>
      </ManualStyle>
    );
  }
}

const mapStateToProps = state => ({
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(ManualOrder)

const ManualStyle = styled.div`


form {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.inputcontainer {
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
  -webkit-transition-duration: 0.4s; /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
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

.button4:hover {background-color: #17629e;}

`
