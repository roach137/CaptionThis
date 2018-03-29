import React from 'react';
import { createLobby, getCurrentUser } from '../../api'
import Lobby from './Lobby/Lobby';
import LobbiesTable from './Lobby/LobbiesTable';
import '../../style/components/MainMenu/GameOptions.css';
import '../../style/components/MainMenu/Lobby/LobbyTable.css'

class GameOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId : "",
      destination : ""
    }
    this.createLobby_callback = this.createLobby_callback.bind(this);
    this.createLobby = this.createLobby.bind(this);
    this.showLobbiesTable = this.showLobbiesTable.bind(this);
  }

  createLobby(e) {
    e.preventDefault();
    console.log("creating lobby");
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

  showLobbiesTable() {
    this.setState({lobbyId : "", destination : "lobbiesTable"});
  }

  render() {
    if (this.state.destination === "lobbiesTable") {
      return(<LobbiesTable/>);
    }
    if (this.state.lobbyId !== '') {
      return(<Lobby lobbyId={this.state.lobbyId} host={getCurrentUser()}/>);
    }

    return(
      <div className="buttons">
        <form onSubmit = {this.createLobby} class="lobby_form">
          <textarea className="lobby_name_field" id="lobby-name" placeholder="enter lobby name" required></textarea>
          <button className="lobby_button">Host a game</button>
        </form>
        <div className="or_break"> OR </div>
        <button className="lobby_button" onClick={this.showLobbiesTable}>Join a game</button>
      </div>
    );
  }
}
export default GameOptions;
