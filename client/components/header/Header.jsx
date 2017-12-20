import './header.scss';
import React, {Component} from 'react';

function Logo() {
    return (
        <div className="logo">
            <a href="/">
                {/*Shan&Guo*/}
                <img src="img/logo.png" alt="AlexShan"/>
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

function Signin() {
    return (
        <div className="signin">
            <ul className="clearfix">
                <li><a href="/user/signin">Sign in</a></li>
                <li><a href="/user/signout">Sign out</a></li>
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
            <div className="header-wrap">
                <header className="header">
                    <Logo />
                    <Nav />
                    <Signin />
                </header>
            </div>
        )
    }
}
