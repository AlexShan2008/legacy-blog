import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pic from '../../components/Pic/Pic';
import Text from '../../components/Text/Text';
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
          <Link to='/article-01' className='article clearfix'>
            <Pic url='/img/banner/banner-01_small.jpg' name='beijing' />
            <Text />
          </Link>
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
