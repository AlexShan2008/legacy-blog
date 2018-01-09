import React, {Component} from 'react';

class TogglePassword extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div className="showPassword-btn">
                <button onClick={this.props.showpassword}>
                    {this.props.showText}
                </button>
            </div>
        )
    }
}

export default TogglePassword;