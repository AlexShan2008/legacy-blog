/**
 * Created by ShanGuo on 2017/12/18.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import history from './history';

import {
  Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';


// /*引入组件 及样式表 */
import './static/css/common.scss';
import './components/Header/Header.scss';
import './components/Footer/Footer.scss';

import Home from './containers/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

const UsersPage = () => <div>Users Page</div>;

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Header />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/article' component={Header} />
          <Route path='/article/post' component={UsersPage} />
          <Route path='/topics' component={UsersPage} />
          <Redirect to='/' />
        </Switch>
        <Footer/>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
