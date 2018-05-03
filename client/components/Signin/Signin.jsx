import React, { Component } from "react";
import { connect } from 'react-redux';
import actions from '../../store/actions/home';

import './Signin.scss';

class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signin">
        <ul className="clearfix">
          <li>
            <a>Sign in</a>
          </li>
          <li>
          <a>Sign up</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default connect((state) => ({
  ...state
}), actions)(Signin);