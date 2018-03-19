import React from 'react';
import LobbyRow from './LobbyRow';
import Lobby from './Lobby';
import { getLobbies } from '../../../api';

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
  }

  getLobbies() {
    getLobbies(this.getLobbies_callback);
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
    // if (this.state.loading) {
    //   return (<div>TBD</div>);
    // } else {
      // getLobbies((function(err, res){
      //   var lobbies = [];
      //   res.forEach(function(lobby){
      //     lobbies.push(<LobbyRow key={lobby._id} name={lobby.name}/>);
      //   });
      //   return <div>{lobbies}</div>
      // }).bind(this))
    // }
    if (this.state.selectedLobby) {
      return (<Lobby lobbyId={this.state.selectedLobby.lobbyId} host={this.state.selectedLobby.host}/>);
    }
    return (<div>
      <button onClick={this.getLobbies}>Click to get lobbies</button>
    <div>{this.state.lobbies}</div>
    </div>
  );
  }
}
export default LobbiesTable;
