import React, { Component } from 'react';
import GameOptions from '../components/MainMenu/GameOptions'
import '../style/pages/MainMenu.css'
import { signout } from '../api';

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.signout = this.signout.bind(this);
  }

  signout(e) {
    e.preventDefault();
    signout(function(err, res){
      window.location = '/';

    });
  }

  render() {
    return(
      <div id="main-menu" className="main-menu">
        <button className="signout-btn" onClick={(e)=>this.signout(e)}>Sign out</button>
        <div id="game-choices" className="choices">
          <GameOptions/>
        </div>
      </div>
    );
  }
}
export default MainMenu;
