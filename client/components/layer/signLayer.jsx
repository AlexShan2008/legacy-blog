import React, { Component } from "react";
import Email from "../signin/Email";
import Password from "../signin/Password";
import { ajax } from "../../util/ajax";

import "./SignLayer.scss";

function Signbtn(props) {
  return (
    <div className="row signin-btn">
      <button type="submit" onClick={props.handleSignin}>
        Sign in
            </button>
    </div>
  );
}

class RegWrap extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="reg-warp">
        <span className="reg-left">No account yet?</span>
        <CreateBtn handleReg={this.props.handleReg} />
      </div>
    );
  }
}

function CloseBtn(props) {

  return (
    <div className="closeBtn-wrap clearfix">
      <button type="button" className="closeBtn" onClick={props.closeLayer}>
        <CloseIcon />
      </button>
    </div>
  );
}

class CreateBtn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button className="reg-btn" onClick={this.props.handleReg}>
        Create Account
            </button>
    );
  }
}

class SigninLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      checkInput: "",
      emailClassName: "",
      pwdClassName: "",
      tipClass: "",
      pwdTipClass: "",
      tipText: "Please input Email Address",
      pwdTipText: "Please input Password"
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeSigninLayer = this.closeSigninLayer.bind(this);
    this.openSignupLayer = this.openSignupLayer.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.checkPwd = this.checkPwd.bind(this);
    this.resetCheckEmail = this.resetCheckEmail.bind(this);
    this.resetCheckPwd = this.resetCheckPwd.bind(this);
    this.signIn = this.signIn.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.handleReg = this.handleReg.bind(this);
  }

  handleEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.checkEmail();
    this.checkPwd();

    this.setState({
      checkInput: true
    });
    const data = {
      email: this.state.email,
      password: this.state.password
    };

    console.log(data);

    if (this.state.email && this.state.password) {
      this.signIn(data);
    } else {
      return;
    }
  }

  closeSigninLayer() {
    this.props.toggleShow();
    this.clearForm();
  }
  openSignupLayer() {

  }

  clearForm() {
    this.setState({
      checkInput: false
    });
  }

  checkEmail() {
    const email = this.state.email;
    if (!email) {
      this.setState({
        emailClassName: "input-row warning",
        tipClass: "show",
        tipText: this.state.tipText

      });
    }
    if (!checkEmail(email)) {
      this.setState({
        tipClass: "show",
        className: "input-row warning",
        tipText: "Please input Correct Email Address"
      });
    } else {
      this.setState({
        className: "input-row",
        tipClass: ""
      });
    }
  }

  resetCheckEmail() {
    this.setState({
      emailClassName: "",
      tipClass: ""
    });
  }

  checkPwd() {
    const pwd = this.state.password;
    if (!pwd) {
      this.setState({
        pwdClassName: "input-row warning",
        pwdTipClass: "show",
        pwdTipText: this.state.pwdTipText

      });
    }
    if (!checkPassword(pwd)) {
      this.setState({
        pwdTipClass: "show",
        pwdClassName: "input-row warning",
        pwdTipText: "Please input Correct Email Address"
      });
    } else {
      this.setState({
        pwdClassName: "input-row",
        pwdTipClass: ""
      });
    }
  }

  resetCheckPwd() {
    this.setState({
      pwdClassName: "",
      pwdTipClass: ""
    });
  }

  signIn(data) {
    // 当输入格式符合要求时发起登录；
    ajax({
      url: "/api/signin",
      method: "post",
      data: data
    }).then((value) => {
      // debugger
      location.href = "/";
    }).catch((err) => {
      console.log(err);
    });
  }

  handleReg() {
    this.closeSigninLayer();

  }

  render() {
    const showClassName = this.props.showClassName;
    return (
      <div className={showClassName}>
        <div className="layer-container">
          <div className="layer-content">
            <CloseBtn closeLayer={this.closeSigninLayer} />
            <Email
              handleEmail={this.handleEmail}
              email={this.state.email}
              className={this.state.emailClassName}
              resetCheckEmail={this.resetCheckEmail}
              tipClass={this.state.tipClass} />
            <Password
              handlePassword={this.handlePassword}
              password={this.state.password}
              className={this.state.pwdClassName}
              resetCheckPwd={this.resetCheckPwd}
              pwdTipClass={this.state.pwdTipClass} />
            <Signbtn handleSignin={this.handleSubmit} />
            <SeparatorLine />
            <RegWrap handleReg={this.handleReg} />
          </div>
        </div>
      </div>
    );
  }

}

export default SigninLayer;

function checkEmail(email) {
  const reg = /^(\w)+@[\w\.]+$/;
  return reg.test(email);
}
function checkPassword(password) {
  const reg = /^[0-9a-zA-Z_]{6,8}$/;
  return reg.test(password);
}