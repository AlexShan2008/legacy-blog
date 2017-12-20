import './wrap.scss';
import React, {Component} from 'react';
import Header from '../../components/header/Header.jsx';
import Footer from '../../components/footer/footer.jsx';
import Clock from '../../components/Clock';

class Wrap extends Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                <Clock />
                <Footer />
            </div>
        )
    }
}

export default Wrap;