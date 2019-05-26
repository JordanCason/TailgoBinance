import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

import {settingsSetBinanceApiAction, settingsGitBinanceApiAction, loadSettings} from '../actions/settingsAction.js'

class Settings extends Component {
  constructor (props) {
    super(props);
    this.state = {
      APIKEY: '',
      APISECRET: '',
    }
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
      <SettingsStyle>
          <div id='sideNav'>
          Setings Page<br/><br/>
              <form onSubmit={this.handleSubmit}>
              APIKEY: <input type="text" name="APIKEY" onChange={this.handleInput} value={this.state.APIKEY}/><br/>
              APISECRET: <input type="text" name="APISECRET" onChange={this.handleInput} value={this.state.APISECRET}/><br/>
              <input type="submit" value="Submit" />
              <br/><br/><br/>Tests<br/>
              <button type='button' onClick={() => {this.props.settingsSetBinanceApiAction()}}>set API</button><br/>
              <button type='button' onClick={() => {this.props.settingsGitBinanceApiAction()}}>get API</button><br/>
              <button type='button' onClick={() => {console.log(this.props)}}>this.props</button><br/>
              <button type='button' onClick={() => {console.log(this.state)}}>this.state</button><br/>
              <button type='button' onClick={() => {this.props.loadSettings()}}>Load Settings</button><br/>
              </form>
          </div>
      </SettingsStyle>
    );
  }
}

const mapStateToProps = state => ({
    //test: testReducer,
    settings: state.settingsReducer
})

const mapActionsToProps = {
    settingsSetBinanceApiAction,
    settingsGitBinanceApiAction,
    loadSettings
    //testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)

const SettingsStyle = styled.div`
color: white;
#sideNav{
  width: 100%;
}
`
