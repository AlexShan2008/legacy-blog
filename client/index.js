/**
 * Created by ShanGuo on 2017/12/18.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import '../static/css/common.scss';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import {Provider} from 'react-redux';
import store from './redux/index';

// /*引入组件*/
import Wrap from './containers/wrap/wrap';
import Header from './components/header/Header';

const UsersPage = () => <div>Users Page</div>;

const App = () => (
    <Provider store={ store }>
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Wrap}/>
                <Route path='/article' component={Header}/>
                <Route path="/article/post" component={UsersPage}/>
                <Route path="/article/post" component={UsersPage}/>
                <Route path="/topics" component={UsersPage}/>
                <Redirect to="/"/>
            </Switch>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
