import React, { Component } from 'react';
import { createLobby, getCurrentUser } from '../../api'
import Lobby from '../../components/MainMenu/Lobby';
import '../../style/components/MainMenu/GameOptions.css';

class GameOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId : ""
    }
    this.createLobby_callback = this.createLobby_callback.bind(this);
    this.createLobby = this.createLobby.bind(this);
  }

  createLobby() {
    var name = document.querySelector('#lobby-name').value;
    createLobby(name, getCurrentUser(), this.createLobby_callback);
  }

  createLobby_callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
      this.setState({lobbyId : res._id});
      // this.forceUpdate();
    }
  }

  joinGame() {
    console.log(getCurrentUser());
  }

  render() {
    if (this.state.lobbyId != '') {
      return(<Lobby lobbyId={this.state.lobbyId}/>);
    }
    return(
      <div className="buttons">
        <textarea id="lobby-name" placeholder="enter lobby name"></textarea>
        <button className="btn" onClick={() => this.createLobby()}>Host a game</button>
        <button className="btn" onClick={this.joinGame}>Join a game</button>
      </div>
    );
  }
}
export default GameOptions;
