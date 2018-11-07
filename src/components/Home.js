import React, { Component } from 'react';
import { webview } from 'react-electron-web-view'
import styled from 'styled-components'

class Home extends Component {

  render() {
    return (
      <HomeStyle>
          <div id='sideNav'>
              Controls
              <button type="button" onClick={() => {document.getElementsByTagName("webview")[0].openDevTools();}}>test router</button>
          </div>
          <webview id="foo" src="https://www.tradingview.com/chart/xZlrCJ3o/" />
      </HomeStyle>
    );
  }
}

export default Home;

const HomeStyle = styled.div`
    display: inline-flex;
    height: 100%;
    width: 100%;
    background-color: #2f3241;

    color: white;
    #sideNav{
        
        min-width: 20%;

    }


    webview {
        height: 100%;
        width: 100%;
    }
`
