import React, { Component } from 'react';
import { Link } from 'react-router-dom';
 
import './Header.scss';
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';

class Logo extends Component {
  render() {
    return (
      <div className='logo'>
        <Link to='/'>
          <img src='/img/logo.png' alt='AlexShan' />
        </Link>
      </div>
    );
  }
}

class Nav extends Component {
  render() {
    return (
      <nav className='nav'>
        <ul className='clearfix'>
          <li><Link to='/' className='active'>Home</Link></li>
          <li><Link to='/article'>Latest Stories</Link></li>
          <li><Link to='/article/post'>Post Stories</Link></li>
          <li><Link to='/topics'>Topics</Link></li>
        </ul>
      </nav>
    );
  }
}

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='header-wrap'>
        <header className='header'>
          <Logo />
          <Nav />
          <Signin />
          <Signup />
        </header>
      </div>
    );
  }
}
export default Header;