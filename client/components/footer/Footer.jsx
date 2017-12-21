import './Footer.scss';
import React, {Component} from 'react';

function ICP() {
    return (
        <div className="ICP">
            京ICP备 17040738号-1
        </div>
    )
}

function Copy() {
    return (
        <div className="copy">
            Copyright&nbsp;&copy;&nbsp;2018 Shan&Guo
        </div>
    )
}

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="content">
                    <Copy/>
                    <ICP/>
                </div>
            </footer>
        )
    }
}
export default Footer;