import './Signin.scss';
import React, {Component} from 'react';
import Layer from '../layer/Layer';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFlag:"layer-wrap"
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleClick(e) {
        e.preventDefault();
        this.setState({
            showFlag: "layer-wrap show"
        })
    }

    render() {
        return (
            <div className="signin">
                <ul className="clearfix">
                    <li><a onClick={this.handleClick} href="javascript:void(0)">Sign in</a></li>
                    <li><a href="/user/signout">Sign out</a></li>
                </ul>
                <Layer showFlag={this.state.showFlag}/>
            </div>
        )
    }
}

export default  Signin;