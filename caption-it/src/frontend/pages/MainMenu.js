import React, { Component } from 'react';
import GameOptions from '../components/MainMenu/GameOptions'
import Lobby from '../components/MainMenu/Lobby';
import '../style/pages/MainMenu.css'

class MainMenu extends Component {
  render() {
    return(
      <div id="main-menu" className="main-menu">
        <div id="game-choices" className="choices">
          <GameOptions/>
        </div>
        <div id="lobby-screen" className="hidden">
          <Lobby lobbyId={""}/>
        </div>
      </div>
    );
  }
}
export default MainMenu;
