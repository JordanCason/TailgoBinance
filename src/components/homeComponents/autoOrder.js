import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'

class Home extends Component {
  render() {
    return (
      <HomeStyle>
      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({
})

const mapActionsToProps = {
}

export default connect(mapStateToProps, mapActionsToProps)(Home)

const HomeStyle = styled.div`
`
