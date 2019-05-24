import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

class Test extends Component {
  render() {
    return (
      <div id='sideNav'>
          Test Page
      <button type="button" onClick={() => {console.log(this.props)}}>test router</button>
      </div>
    );
  }
}

export default Test;


const SettingsStyle = styled.div`
color: white;
#sideNav{
  width: 100%;
}
`
