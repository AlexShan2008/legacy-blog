import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Pic from '../../components/pic/Pic';
import Text from '../../components/text/Text';
import Clock from '../../components/Clock';
import Modal from '../Modal/Modal';

import actions from '../../store/actions/home';


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
          <a href='/article-01' className='article clearfix'>
            <Pic url='/img/banner/banner-01_small.jpg' name='beijing' />
            <Text />
          </a>
        </div>
        <Clock />
        <Footer />
      </div>
    );
  }
}

export default connect((state) => ({
...state
}), actions)(Home);