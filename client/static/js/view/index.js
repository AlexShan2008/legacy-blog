/**
 * Created by ShanGuo on 2017/12/18.
 */
import React , { Component } from 'react';
// import App from '/client/static/output/js/views/app.bundle';

class Clock extends Component{
    constructor (props){
        super(props);
        this.state = { date : new Date() }
    }

    /*lifecycle hooks interval*/

    /*We want to set up a timer whenever the Clock is rendered to the DOM for the first time.
     This is called “mounting” in React.
     The componentDidMount() hook runs after the component output has been rendered to the DOM. This is a good place to set up a timer:*/
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    /*We can declare special methods on the component class to run some code when a component mounts and unmounts:*/
    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render(){
        return(
        <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
    )
    }
}

React.render(
    Clock,
    document.getElementById('root')
);

