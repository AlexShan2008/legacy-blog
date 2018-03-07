import React, { Component } from "react";
import SigninLayer from "../layer/signLayer";

function SigninButton(props) {
    return (
        <a onClick={props.handleClick} href="javascript:void(0);">
            Sign in
        </a>
    );
}

function SignoutButton(props) {
    return (
        <a href="/user/signout">
            Sign out
        </a>
    );
}

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showClassName: "layer-wrap"
        };
        this.showSigninWindow = this.showSigninWindow.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentDidMount() {

    }
    componentWillUnmount() {

    }

    showSigninWindow(e) {
        e.preventDefault();
        this.setState({
            showClassName: "layer-wrap show"
        });
    }

    //处理子函数传回来的state,改变自身的state
    toggleShow() {
        this.setState({
            showClassName: "layer-wrap"
        });
    }

    render() {
        return (
            <div className="signin">
                <ul className="clearfix">
                    <li>
                        <SigninButton handleClick={this.showSigninWindow} />
                    </li>
                    <li>
                        <SignoutButton />
                    </li>
                </ul>
                <SigninLayer
                    showClassName={this.state.showClassName}
                    toggleShow={this.toggleShow}
                />
            </div>
        );
    }
}

export default Signin;