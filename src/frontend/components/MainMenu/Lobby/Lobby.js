import React, { Component } from 'react';
import SocketClient from "socket.io-client";
import { getPlayers, getCurrentUser, leaveGame } from '../../../api';
import GamePage from '../GamePage'
import GameOptions from '../GameOptions';
import '../../../style/components/MainMenu/HostGame.css'
import '../../../style/components/MainMenu/Lobby/LobbyTable.css'

const socket = SocketClient();

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startGame : false,
      leftGame : false
    }

    this.startGame = this.startGame.bind(this);
    this.startGame_callback = this.startGame_callback.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
  }

  componentWillMount() {
    var self = this;
    socket.emit('room', this.props.lobbyId);

    socket.on('start', function(message) {
      self.setState({startGame : true});
    })
  }

  componentWillUnmount() {
    socket.emit('leave room', this.props.lobbyId);
  }

  startGame() {
    if (getCurrentUser() === this.props.host) {
      getPlayers(this.props.lobbyId, this.startGame_callback);
    }
  }

  startGame_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    if (getCurrentUser() === res[0]) {
      socket.emit('start', {room : this.props.lobbyId, msg : "Starting Game"});
    }
  }

  leaveGame() {
    var self = this;
    leaveGame(this.props.lobbyId, getCurrentUser(), function(err, res){
      if (err) {
        console.log(err);
      } else {
        socket.emit('leave room', self.props.lobbyId);
        self.setState({leftGame : true});
      }
    })
  }



  render() {
    if (this.state.leftGame) {
      return (<GameOptions/>);
    }
    if (this.state.startGame) {
      return (<GamePage socket={socket} host={this.props.host} lobbyId={this.props.lobbyId}/>);
    }
    return(
      <div id="host-game-menu">
        <button className="lobby_button" onClick={this.leaveGame}>Leave Game</button>
        <button className="lobby_button" onClick={this.startGame}>Start game</button>
        <div id="player-list" class="players">
          <div class="section_title">Lobby ID: </div>
          <div>{this.props.lobbyId}</div>
          <div class="section_title">Host: </div>
          <div>{this.props.host}</div>
        </div>
      </div>
    );
  }
}
export default Lobby;
