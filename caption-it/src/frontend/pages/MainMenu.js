import React, { Component } from 'react';
import GameOptions from '../components/MainMenu/GameOptions'
import '../style/pages/MainMenu.css'

class MainMenu extends Component {
  render() {
    return(
      <div id="main-menu" className="main-menu">
        <div id="game-choices" className="choices">
          <GameOptions/>
        </div>
      </div>
    );
  }
}
export default MainMenu;
