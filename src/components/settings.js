import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import {
  settingsSetBinanceApiAction,
  settingsGitBinanceApiAction,
  loadSettings,
  settingsSetWebviewURLAction
} from '../actions/settingsAction.js'
const settings = window.require('electron-settings');
class Settings extends Component {
  constructor (props) {
    // Wanted to load setings for the redux store but could not get it to work
    // unless I want to tie the hole stat of this component to the store.
    super(props);
    this.state = {
      'APIKEY': '',
      'APISECRET': '',
      'TradingViewURL': settings.get('webviewURL')
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    switch (e.target.name) {
        case 'API':
          this.props.settingsSetBinanceApiAction(this.state.APIKEY, this.state.APISECRET)
          break
        case 'TradingView':
          this.props.settingsSetWebviewURLAction(this.state.TradingViewURL)
          break
        default:
          break
    }


  }

  render() {
    return (
      <SettingsStyle>
          <div id='sideNav'>
          Setings Page<br/><br/>
              <form name='API' onSubmit={this.handleSubmit}>
              APIKEY: <input type="text" name="APIKEY" onChange={this.handleInput} value={this.state.APIKEY}/><br/>
              APISECRET: <input type="text" name="APISECRET" onChange={this.handleInput} value={this.state.APISECRET}/><br/>
              <input type="submit" value="Submit" />
              </form>
              <br/>
              <form name='TradingView' onSubmit={this.handleSubmit}>
              TradingView URL: <input type="text" name="TradingViewURL" onChange={this.handleInput} value={this.state.TradingViewURL}/><br/>
              <input type="submit" value="Submit" />
              </form>
              <br/><br/><br/>Tests<br/>
              <button type='button' onClick={() => {this.props.settingsSetBinanceApiAction()}}>set API</button><br/>
              <button type='button' onClick={() => {this.props.settingsGitBinanceApiAction()}}>get API</button><br/>
              <button type='button' onClick={() => {console.log(this.props)}}>this.props</button><br/>
              <button type='button' onClick={() => {console.log(this.state)}}>this.state</button><br/>
              <button type='button' onClick={() => {this.props.loadSettings()}}>Load Settings</button><br/>

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
    loadSettings,
    settingsSetWebviewURLAction
    //testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)

const SettingsStyle = styled.div`
color: white;
#sideNav{
  width: 100%;
}
`
