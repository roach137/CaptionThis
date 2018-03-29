import React, {Component} from 'react';
import LoginForm from './LoginForm';
import '../../style/components/Homepage/Body.css';

class Body extends Component {
  render() {
    return(
      <div className="front-page-body">
        <div className='homepage-bg'>
        </div>
        <div className="description">
        <h1>Welcome to Caption it!</h1>
        <p>Caption it! is a game where up to five people create
        a caption for an image and the player with the best caption wins!
        </p>
        </div>
        <div className="login">
          <LoginForm />
        </div>
        <div className='footer'></div>
        <a href="/credits" className='credits'>Credits</a>
      </div>
    );
  }
}
export default Body
