import React, { Component } from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import $ from 'jquery';
import matchHeight from 'jquery-match-height'
import  Status  from './homeComponents/status'
import  ManualOrder  from './homeComponents/manualOrder'
import { toggleAlertLissnerAction } from '../actions/webviewSwitchActions.js'

class Home extends Component {


  componentDidMount() {
    $('nav li').on('click', 'a', function(e){
    if ($(this).parent().children('.inside').length){
		e.preventDefault();
		$(this).addClass('active');
		$(this).parent().children('.inside').slideDown();
		setTimeout(function(){
		  $.fn.matchHeight._update();
		  $.fn.matchHeight._maintainScroll = true;
		}, 1000);
	}
  });

  $('nav li').on('click', 'a.active', function(e){
    e.preventDefault();
    $(this).removeClass('active');
	$(this).parent().children('.inside').slideUp();
    setTimeout(function(){
      $.fn.matchHeight._update();
      $.fn.matchHeight._maintainScroll = true;
    }, 1000);
  });
  $( ".target" ).click()
  }


  render() {
    return (
      <HomeStyle>
          <nav className="">
            <ul className="">
              <li>
                <a className='title' >Statuus</a>
                <div className='inside'>
                <Status/>
                </div>
              </li>
              <li>
                <a className='title target' >Manual Order</a>
                <div className='inside'>
                  <ManualOrder/>
                </div>
              </li>
              <li>
                <a className='title' >Auto Order</a>
                <div className='inside'>
                  <div>this is a test div</div>
                </div>
              </li>
            </ul>
          </nav>
      </HomeStyle>
    );
  }
}

const mapStateToProps = state => ({

})

const mapActionsToProps = {
toggleAlertLissnerAction
}

export default connect(mapStateToProps, mapActionsToProps)(Home)
// #2f3241
const HomeStyle = styled.div`
color: white;
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


`
