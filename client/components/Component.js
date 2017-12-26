/**
 * Created by ShanGuo on 2017/12/23.
 */
import React , { Component } from 'react';

class Clock extends Component{
    constructor (props){
        super(props);
    }
    clickHandler(){
        alert(this.props.msg)
    }

    render(){
        return (
            <button onClick={this.clickHandler}>
                {this.props.msg }
            </button>
        )
    }
}
export default Clock;