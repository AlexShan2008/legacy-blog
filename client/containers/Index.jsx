import React, { Component } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Pic from '../components/pic/Pic';
import Text from '../components/text/Text';
import Clock from '../components/Clock';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount(){
      console.log(99999)
    }
    render() {
        return (
            <div className='app-container'>
                <Header />
                <div className='content main text-center'>
                    <a href='/article-01' className='article clearfix'>
                        <Pic url='/img/banner/banner-01_small.jpg' name='beijing' />
                        <Text />
                    </a>
                </div>
                <Clock />
                <Footer />
            </div>
        );
    }
}

export default Index;