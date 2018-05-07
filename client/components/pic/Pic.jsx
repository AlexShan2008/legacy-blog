import "./Pic.scss";
import React, {Component} from "react";

class Pic extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="pic float-l">
                <img
                    src={this.props.url}
                    alt={this.props.name}
                />
            </div>
        );
    }
}
export default Pic;