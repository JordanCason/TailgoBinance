import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import $ from 'jquery';
import matchHeight from 'jquery-match-height'
import Status  from './homeComponents/status'
import ManualOrder  from './homeComponents/manualOrder'
import AutoOrder  from './homeComponents/autoOrder'
import Wallet from './homeComponents/wallet'
import { toggleAlertLissnerAction } from '../actions/webviewSwitchActions.js'

class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      'activeTab': 'Limit',
      'manualOrder': {
        lable1: 'Update:',
        title1: 'How offent to update the price',
        lable2: 'Low Price',
        title2: '',
        autoOrder: false,
        side: 'BUY'
      },
      'autoOrder': {
        lable1: 'Interval:',
        title1: 'Amount of random time to append to the update check',
        lable2: 'High Price:',
        title2: '',
        autoOrder: true,
        side: 'SELL'
      }
    }
    this.handleActive = this.handleActive.bind(this);
}

  handleActive = e => {
    // this.setState({[e.target.name]: e.target.name === this.state[e.target.name]})
    console.log(e)
    this.setState({
      'activeTab': e.target.value
    })
  }


  componentDidMount() {
    $('nav li').on('click', 'a', function(e){
    if ($(this).parent().children('nav > ul > li > div').length){
		e.preventDefault();
		$(this).addClass('active');
		$(this).parent().children('nav > ul > li > div').slideDown();
		setTimeout(function(){
		  $.fn.matchHeight._update();
		  $.fn.matchHeight._maintainScroll = true;
		}, 1000);
	}
  });

  $('nav li').on('click', 'a.active', function(e){
    e.preventDefault();
    $(this).removeClass('active');
	$(this).parent().children('nav > ul > li > div').slideUp();
    setTimeout(function(){
      $.fn.matchHeight._update();
      $.fn.matchHeight._maintainScroll = true;
    }, 1000);
  });
  $( ".tempclick" ).click()
  }


  render() {
    return (
      <HomeStyle>

          <nav>
            <ul>
              <li>
                <a>Status</a>
                <div>
                <Status/>
                </div>
              </li>
              <li>
                <a>Wallet</a>
                <div>
                <Wallet/>
                </div>
              </li>
              <li >
                <a className='tempclick'>Manual Order</a>
                <div>
                  <div className='orders'>
                    <ManualOrder orderType={this.state.activeTab} config={this.state.manualOrder}/>
                  </div>
                </div>
              </li>
              <li>
                <a className='tempclick' >Auto Order</a>
                <div>
                  <ManualOrder orderType={this.state.activeTab} config={this.state.autoOrder}/>
                </div>
              </li>
            </ul>
          </nav>
      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({
  webviewSwitch: state.toggleAlertLissnerReducer,
})

const mapActionsToProps = {
toggleAlertLissnerAction
}

export default connect(mapStateToProps, mapActionsToProps)(Home)
// #2f3241
const HomeStyle = styled.div`

.orders {
  display: flex;

}

nav {
display: flex;
flex-grow: 1;
color: white;
}

nav > ul {
  flex: 1;
}
/* Contents container */
nav > ul {
  display: flex;
  flex-direction: column;
}

nav > ul > li {
  flex: 1;
}
/* title */
nav > ul > li > a {
  display: flex;
  font-weight: 400;
  padding: 1.6rem;
  padding-left: 1.5rem;
  font-size: 1.25rem;
  text-decoration: none !important;
  font-family: Helvetica;
  background-color: #2f3241
}
/* title */
nav > ul > li > a:hover {
  color: #fff;
  background-color: #17629e;
  text-decoration: none;
}

nav > ul > li > div {
    display: none;
}

/*
#131722


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
} */



/* color: white;
a {
  text-decoration: none !important;
  font-family: Helvetica;
}
nav {
    background-color: #2f3241;
}

.title {
    font-weight: 400;
    display: block;
    padding: 1.6rem;
    padding-left: 1.5rem;
    font-size: 1.25rem;
}
.title:hover {
    color: #fff;
    background-color: #17629e;
    text-decoration: none
}
.inside {
    display: none;
    background-color: #2f3241
}

.buysell > .inside {
  display: flex;
} */


`
