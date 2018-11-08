import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

import {settingsSetBinanceApiAction, settingsGitBinanceApiAction} from '../actions/binanceApiActions.js'

class Settings extends Component {

  render() {
    return (
      <SettingsStyle>
          <div>
          Setings Page
              <form>
              APIKEY: <input type="text" name="APIKEY"/><br/>
              APISECRET: <input type="text" name="APISECRET"/><br/>
              <input type="submit" value="Submit"/>
              </form>
          </div>
      </SettingsStyle>
    );
  }
}

const mapStateToProps = state => ({
    //test: testReducer,
})

const mapActionsToProps = {
    settingsSetBinanceApiAction,
    settingsGitBinanceApiAction
    //testAction,
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)

const SettingsStyle = styled.div`
    display: inline-flex;
    height: 100%;
    width: 100%;
    background-color: #2f3241;

    color: white;
    #sideNav{
        width: 300px;

    }

`
