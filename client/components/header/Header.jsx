import './header.scss';
import React, {Component} from 'react';

function Logo() {
    return (
        <div className="logo">
            <a href="/">
                Shan&Guo
            </a>
        </div>
    )
}

function Nav() {
    return (
        <nav className="nav">
            <ul className="clearfix">
                <li><a className="active" href="/">Home</a></li>
                <li><a href="/article/list">Latest Stories</a></li>
                <li><a href="/article/post">Post Stories</a></li>
            </ul>
        </nav>
    )
}

function Profile() {
    return (
        <div className="profile">
            <ul className="clearfix">
                <li><a href="/user/signup">注册</a></li>
                <li><a href="/user/signin">登录</a></li>
                <li><a href="/user/signout">退出</a></li>
            </ul>
        </div>
    )
}

export default class extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <header className="header">
                <Logo />
                <Nav />
                <Profile />
            </header>
        )
    }
}
