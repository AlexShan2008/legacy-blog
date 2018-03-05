import React, { Component } from "react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/footer/Footer.jsx";
import Pic from "../components/pic/Pic.jsx";
import Text from "../components/text/Text.jsx";
import Clock from "../components/Clock";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                <div className="content main text-center">
                    <a href="/article-01" className="article clearfix">
                        <Pic url="/img/banner/banner-01_small.jpg" name="beijing" />
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