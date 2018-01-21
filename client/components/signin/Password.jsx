import React, { Component } from 'react';
import Showpassword from './Showpassword';

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: 'input-row',
            passwordType: 'password',
            showText: 'Show Password',
            showError: 'hide',
            showErrorText: 'Please input Password'
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showPassword = this.showPassword.bind(this);
    }

    handleFocus(e) {
        this.props.resetCheckPwd();
        this.setState({
            className: 'input-row focus',
        });
        if (!e.target.value) {
            this.setState({
                showErrorText: 'Please input Password',
                showError: 'show'
            });
        }
    }

    handleBlur(e) {
        // if (!e.target.value && !this.props.checkStatus) {
        if (!e.target.value) {
            this.setState({
                className: 'input-row',
                showError: 'hide'
            });
            return
        }
        if (!checkPassword(e.target.value)) {
            this.setState({
                showError: 'show',
                className: 'input-row warning'
            });
        } else {
            this.setState({
                className: 'input-row'
            });
        }
    }

    handleChange(e) {
        const password = e.target.value;
        /* 未输入时*/
        if (!password) {
            this.setState({
                showErrorText: 'Please input Password'
            });
            return
        }
        /* 输入时温馨提醒*/
        if (password && !checkPassword(password)) {
            this.setState({
                showError: 'show',
                className: 'input-row warning',
                showErrorText: 'The password consists of 6-8 alphanumeric or underscore'
            });
        }
        /* 输入的值不符合正则匹配时*/
        if (checkPassword(password)) {
            this.setState({
                showError: 'hide',
                className: 'input-row focus'
            });
        }
    }

    showPassword() {
        this.setState({
            passwordType: this.state.passwordType === 'password' ? 'text' : 'password',
            showText: this.state.passwordType === 'password' ? 'Hide Password' : 'Show Password'
        });
    }

    render() {
        const className = this.props.className;
        const handlePassword = this.props.handlePassword;
        const tipClass = this.props.pwdTipClass;
        const tipText = this.props.pwdTipText;
        return (
            <div className="row">
                <div className={  className ? className : this.state.className }>
                    <div className="input-text">
                        <input className="password" name="password" type={this.state.passwordType} placeholder="Password"
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onKeyUp={this.handleChange}
                            onChange={handlePassword} />
                    </div>
                    <div className="input-icon">

                    </div>
                </div>
                <TipText showError={ tipClass ? tipClass : this.state.showError }
                    showErrorText={this.state.showErrorText} />
                <Showpassword showpassword={this.showPassword} showText={this.state.showText} />
            </div>
        )
    }
}

export default Password;

class TipText extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tip-text">
                <p className={this.props.showError}>{this.props.showErrorText}</p>
            </div>
        );
    }
}

function checkPassword(password) {
    const reg = /^[0-9a-zA-Z_]{6,8}$/;
    return reg.test(password)
}

function LockIocn() {
    return <svg className="email-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
            d="m19.5 9h-.5v-2a7 7 0 1 0 -14 0v2h-.5c-.78 0-1.5.72-1.5 1.5v12c0 .78.72 1.5 1.5 1.5h15c .78 0 1.5-.72 1.5-1.5v-12c0-.78-.72-1.5-1.5-1.5zm.5 13.5c0 .22-.28.5-.5.5h-15c-.22 0-.5-.28-.5-.5v-12c0-.22.28-.5.5-.5h1a .5.5 0 0 0 .5-.5v-2.5a6 6 0 1 1 12 0v2.5a.5.5 0 0 0 .5.5h1c .22 0 .5.28.5.5zm-8-10.5a3 3 0 0 0 -3 3c0 .83.36 1.59.94 2.15l-.9 2.16a.5.5 0 0 0 .46.69h5a .5.5 0 0 0 .46-.69l-.87-2.19c.56-.55.91-1.31.91-2.13a3 3 0 0 0 -3-3zm1.04 5.19.72 1.81h-3.51l.74-1.79a.5.5 0 0 0 -.17-.6 2 2 0 1 1 3.18-1.61c0 .64-.31 1.24-.8 1.6a.5.5 0 0 0 -.17.59zm-1.04-14.19a4 4 0 0 0 -4 4v2.5a.5.5 0 0 0 .5.5h7a .5.5 0 0 0 .5-.5v-2.5a4 4 0 0 0 -4-4zm3 6h-6v-2a3 3 0 1 1 6 0z"></path>
    </svg>
}