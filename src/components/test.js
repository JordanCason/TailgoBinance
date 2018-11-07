import React, { Component } from 'react';

class Test extends Component {
  render() {
    return (
      <div>
          Test Page
      <button type="button" onClick={() => {console.log(this.props)}}>test router</button>
      </div>
    );
  }
}

export default Test;
