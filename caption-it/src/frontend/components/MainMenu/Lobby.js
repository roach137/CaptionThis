import React, { Component } from 'react';
import SocketClient from "socket.io-client";
import { getPlayers } from '../../api';
import '../../style/components/MainMenu/HostGame.css'

const socket = SocketClient("https://localhost:5000");

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players : []
    }

    this.startGame = this.startGame.bind(this);
    this.displayPlayers = this.displayPlayers.bind(this);
    this.displayPlayers_callback = this.displayPlayers_callback.bind(this);
  }

  componentDidMount() {

  }

  displayPlayers() {
    getPlayers(this.props.lobbyId, this.displayPlayers_callback);
  }

  displayPlayers_callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      this.setState({players : res});
    }
  }

  startGame() {
    this.displayPlayers();
  }


  render() {
    // this.displayPlayers();
    return(
      <div id="host-game-menu">
        <button className="btn" onClick={this.startGame}>Start game</button>
        <div id="player-list">
          <div>{this.props.lobbyId}</div>
          <div>{this.state.players}</div>
        </div>
      </div>
    );
  }
}
export default Lobby;
