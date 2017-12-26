import './Footer.scss';
import React, {Component} from 'react';

function ICP() {
    return (
        <div className="ICP dis_i">
            京ICP备 17040738号-1
        </div>
    )
}

function Icon() {
    return (
        <img className="icon dis_i" src="/img/logo-icon-gray-round.png" alt="数据可视化-AlexShan"/>
    )
}

function Copy() {
    return (
        <div className="copy dis_i">
            &copy;&nbsp;2018 Shan&Guo
        </div>
    )
}

class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="content text-center">
                    <Copy/>
                    <Icon/>
                    <ICP/>
                </div>
            </footer>
        )
    }
}
export default Footer;