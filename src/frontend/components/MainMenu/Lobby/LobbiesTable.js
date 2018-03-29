import React from 'react';
import LobbyRow from './LobbyRow';
import Lobby from './Lobby';
import GameOptions from '../GameOptions'
import { getLobbies } from '../../../api';
import '../../../style/components/MainMenu/Lobby/LobbyTable.css'

class LobbiesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbies : [],
      selectedLobby : null
    }
    this.getLobbies = this.getLobbies.bind(this);
    this.getLobbies_callback = this.getLobbies_callback.bind(this);
    this.goToLobby = this.goToLobby.bind(this);
    this.backToMainMenu = this.backToMainMenu.bind(this);
  }

  getLobbies() {
    getLobbies(this.getLobbies_callback);
  }

  backToMainMenu() {
    this.setState({returningToMainMenu : true});
  }

  getLobbies_callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      var lobbies = [];
      var lobby = null;
      for (var i = 0; i < res.length; i++) {
        lobby = res[i];
        lobbies.push(<LobbyRow key={lobby._id} host={lobby.players[0]} id={lobby._id} name={lobby.name} clickHandler={this.goToLobby}/>);
      }
      this.setState({lobbies : lobbies});
    }
  }

  goToLobby(host, lobbyId) {
    this.setState({lobbies : this.state.lobbies, selectedLobby : {lobbyId : lobbyId, host : host}});
  }

  render() {
    if (this.state.returningToMainMenu) {
      return (
        <GameOptions />
      );
    }
    if (this.state.selectedLobby) {
      return (<Lobby lobbyId={this.state.selectedLobby.lobbyId} host={this.state.selectedLobby.host}/>);
    }
    return (
      <div>
        <button onClick={this.backToMainMenu}>Back</button>
        <button className="lobby_button" onClick={this.getLobbies}>Click to refresh lobbies</button>
        <div className="lobby_table">{this.state.lobbies}</div>
      </div>
    );
  }
}
export default LobbiesTable;
