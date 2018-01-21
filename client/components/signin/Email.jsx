import React, {Component} from 'react';

class Email extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: 'input-row',
            showError: 'hide',
            showErrorText: 'Please input Email Address'
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleFocus(e) {
        this.props.resetCheckEmail();
        this.setState({
            className: 'input-row focus'
        });
        if (!e.target.value) {
            this.setState({
                showErrorText: 'Please input Email Address',
                showError: 'show'
            });
        }
    }

    handleBlur(e) {
        if (!e.target.value) {
            this.setState({
                className: 'input-row',
                showError: 'hide'
            });
            return
        }
        if (!checkEmail(e.target.value)) {
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
        let email = e.target.value;
        if (!email) {
            this.setState({
                showErrorText: 'Please input Email Address'
            });
            return
        }
        if (email && !checkEmail(email)) {
            this.setState({
                showError: 'show',
                className: 'input-row warning',
                showErrorText: 'Please input Correct Email Address'
            });
        }
        if (checkEmail(email)) {
            this.setState({
                showError: 'hide',
                className: 'input-row focus'
            });
        }
    }

    render() {
        const className = this.props.className;
        const handleEmail = this.props.handleEmail;
        const tipClass = this.props.tipClass;
        const tipText = this.props.tipText;

        return (
            <div className="row">
                <div className={  className ? className : this.state.className }>
                    <div className="input-text">
                        <input className="email" name="email" type="email" placeholder="Email Address"
                               onFocus={ this.handleFocus }
                               onBlur={ this.handleBlur }
                               onKeyUp={ this.handleChange }
                               onChange={ handleEmail }/>
                    </div>
                    <div className="input-icon">
                        <EmailIcon/>
                    </div>
                </div>
                <TipText
                    showError={ tipClass ? tipClass : this.state.showError }
                    showErrorText={ this.state.showErrorText }/>
            </div>
        )
    }
}

export default  Email;

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
function checkEmail(email) {
    const reg = /^(\w)+@[\w\.]+$/;
    return reg.test(email)
}
function EmailIcon() {
    return (
        <svg className="email-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
                d="m22.5 4h-21c-.83 0-1.5.67-1.5 1.51v12.99c0 .83.67 1.5 1.5 1.5h20.99a1.5 1.5 0 0 0 1.51-1.51v-12.98c0-.84-.67-1.51-1.5-1.51zm.5 14.2-6.14-7.91 6.14-4.66v12.58zm-.83-13.2-9.69 7.36c-.26.2-.72.2-.98 0l-9.67-7.36h20.35zm-21.17.63 6.14 4.67-6.14 7.88zm.63 13.37 6.3-8.1 2.97 2.26c.62.47 1.57.47 2.19 0l2.97-2.26 6.29 8.1z"></path>
        </svg>
    )
}
