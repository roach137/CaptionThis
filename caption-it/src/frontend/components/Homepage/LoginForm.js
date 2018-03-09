import React, {Component} from 'react';
import '../../style/components/Homepage/LoginForm.css'

class LoginForm extends Component {
  render() {
    return(
      // <div id="login">
        <form id="login-form" className="form">
          <div className="form-title">Get Started!</div>
          <input type="text" name="username" placeholder="Enter your username"/>
          <input type="password" name="password" placeholder="Enter your password"/>
          <button id="signin" name="action" className="btn">Sign In</button>
          <button id="signup" name="action" className="btn">Sign Up</button>
        </form>
      // </div>
    );
  }
}
export default LoginForm;
