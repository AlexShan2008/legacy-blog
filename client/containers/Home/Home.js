import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Pic from '../../components/Pic/Pic';
import Text from '../../components/Text/Text';
import Clock from '../../components/Clock';
import Modal from '../Modal/Modal';

import actions from '../../store/actions/home';

import banner from '../../static/img/banner/banner-01.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='app-container'>
        <Modal />
        <Header />
        <div className='content main text-center'>
          <Link to='/article-01' className='article clearfix'>
            <Pic url={banner} name='beijing' />
            <Text />
          </Link>
        </div>
        <Clock />
      </div>
    );
  }
}

export default connect((state) => ({
  ...state
}), actions)(Home);
