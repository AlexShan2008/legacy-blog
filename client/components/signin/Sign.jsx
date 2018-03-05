import React, {Component} from "react";
import Layer from "../layer/Layer";

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showClassName: "layer-wrap"
        };
        this.handleClick = this.handleClick.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
    }

    componentDidMount() {

    }
    componentWillUnmount() {

    }

    handleClick(e) {
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
                    <li><a onClick={this.handleClick} href="javascript:void(0)">Sign in</a></li>
                    <li><a href="/user/signout">Sign out</a></li>
                </ul>
                <Layer
                    showClassName={this.state.showClassName}
                    toggleShow={ this.toggleShow }/>
            </div>
        );
    }
}

export default  Signin;