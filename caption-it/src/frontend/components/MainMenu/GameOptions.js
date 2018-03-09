import React, { Component } from 'react';
import '../../style/components/MainMenu/GameOptions.css';

class GameOptions extends Component {
  render() {
    return(
      <div className="buttons">
        <button className="btn">Host a game</button>
        <button className="btn">Join a game</button>
      </div>
    );
  }
}
export default GameOptions;
