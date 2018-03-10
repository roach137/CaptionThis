import React, { Component } from 'react';
import '../../style/components/MainMenu/HostGame.css'

class HostGame extends Component {
  // constructor(props) {
    // super(props);
    // this.updateState = this.updateState.bind(this);
  // }
  startGame() {
    console.log('starting Game');
  }
  
  render() {
    return(
      <div id="host-game-menu">
        <button className="btn" onClick={this.startGame}>Start game</button>
        <div id="player-list">
        </div>
      </div>
    );
  }
}
export default HostGame;
