import React, {Component} from 'react';
import '../../style/components/Homepage/LoginForm.css'
import { signup, signin } from '../../api.js';

class LoginForm extends Component {
  signupUser(e) {
    e.preventDefault();
    var username = document.querySelector('form [name=username]').value;
    var password = document.querySelector('form [name=password]').value;
    signup(username, password, function(err, res){
      if (err) console.log(err);
      //TODO: go to game page
    });
  }

  signinUser(e) {
    e.preventDefault();
    var username = document.querySelector('form [name=username]').value;
    var password = document.querySelector('form [name=password]').value;
    signin(username, password, function(err, res){
      if (err) {
        console.log(err);
      } else {
        window.location = '/mainmenu';
      }      
    });
  }

  render() {
    return(
      // <div id="login">
        <form id="login-form" className="form">
          <div className="form-title">Get Started!</div>
          <input type="text" name="username" placeholder="Enter your username"/>
          <input type="password" name="password" placeholder="Enter your password"/>
          <button id="signin" name="action" className="btn" onClick={this.signinUser}>Sign In</button>
          <button id="signup" name="action" className="btn" onClick={this.signupUser}>Sign Up</button>
        </form>
      // </div>
    );
  }
}
export default LoginForm;
