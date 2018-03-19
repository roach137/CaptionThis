import React, { Component } from 'react';
import SocketClient from "socket.io-client";
import { getPlayers, getCurrentUser } from '../../../api';
import GamePage from '../GamePage'
import '../../../style/components/MainMenu/HostGame.css'

const socket = SocketClient("https://localhost:5000");

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startGame : false
    }

    this.startGame = this.startGame.bind(this);
    // this.displayPlayers = this.displayPlayers.bind(this);
    // this.displayPlayers_callback = this.displayPlayers_callback.bind(this);
  }

  componentWillMount() {
    var self = this;
    socket.emit('room', this.props.lobbyId);

    socket.on('start', function(message) {
      self.setState({startGame : true});
    })
  }

  // displayPlayers() {
  //   getPlayers(this.props.lobbyId, this.displayPlayers_callback);
  // }

  // displayPlayers_callback(err, res) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     this.setState({players : res});
  //   }
  // }

  startGame() {
    socket.emit('start', {room : this.props.lobbyId, msg : "Starting Game"});
  }


  render() {
    if (this.state.startGame) {
      return (<GamePage socket={socket} host={this.props.host} lobbyId={this.props.lobbyId}/>);
    }
    return(
      <div id="host-game-menu">
        <button className="btn" onClick={this.startGame}>Start game</button>
        <div id="player-list">
          <div>{this.props.lobbyId}</div>
          <div>{this.props.host}</div>
        </div>
      </div>
    );
  }
}
export default Lobby;
