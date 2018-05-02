import React, { Component } from 'react';
import './index.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className='modal-wrap'>
        <CloseBtn />
      </div>
    );
  }
}

function CloseBtn(props) {
  return (
    <div className='closeBtn-wrap clearfix'>
      <button type='button' className='closeBtn' onClick={props.closeLayer}>
        <CloseIcon />
      </button>
    </div>
  );
}
function SeparatorLine() {
  return (
    <div className="sepLine-wrap">
      <span className="sepLine-text">
        <span>Or</span>
      </span>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="关闭" focusable="false">
      <path
        d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22"></path>
    </svg>
  );
}


class CreateBtn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button className='reg-btn' onClick={this.props.handleReg}>
        Create Account
            </button>
    );
  }
}

export default Modal;