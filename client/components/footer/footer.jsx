import './footer.scss';
import React, { Component } from 'react';

function ICP() {
    return(
        <div className="ICP">
            京ICP备 17040738号-1
        </div>
    )
}

function Copy() {
    return(
        <div className="copy">
            Copyright&copy;2017 Shan&Guo
        </div>
    )
}

class Footer extends Component{
    render(){
        return(
            <footer className="footer">
                <ICP/>
                <Copy/>
            </footer>
        )
    }
}
export default Footer;