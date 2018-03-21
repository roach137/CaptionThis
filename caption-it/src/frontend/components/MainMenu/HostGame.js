import React, { Component } from 'react';
import SocketClient from "socket.io-client";
import '../../style/components/MainMenu/HostGame.css'

const socket = SocketClient("https://localhost:5000");

class HostGame extends Component {
  constructor(props) {
    super(props);
    this.isHost = this.props.isHost;
  }

  componentDidMount() {
    // const socket = SocketClient("https://localhost:5000");
  }

  onJoin() {

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
