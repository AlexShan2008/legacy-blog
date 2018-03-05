import "./Header.scss";
import React, {Component} from "react";
import Signin from "../signin/Sign";

function Logo() {
    return (
        <div className="logo">
            <a href="/">
                <img src="/img/logo.png" alt="AlexShan"/>
            </a>
        </div>
    );
}

function Nav() {
    return (
        <nav className="nav">
            <ul className="clearfix">
                <li><a className="active" href="/">Home</a></li>
                <li><a href="/article">Latest Stories</a></li>
                <li><a href="/article/post">Post Stories</a></li>
                <li><a href="/topics">Topics</a></li>
            </ul>
        </nav>
    );
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFlag: "layer-wrap"
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState({
        });
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
        );
    }
}
export default Header;