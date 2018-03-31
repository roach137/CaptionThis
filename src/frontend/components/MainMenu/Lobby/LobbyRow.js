import React from 'react';
import { joinLobby, getCurrentUser } from '../../../api';

class LobbyRow extends React.Component {
  constructor(props) {
    super(props);
    this.joinLobby = this.joinLobby.bind(this);
    this.joinGame_callback = this.joinGame_callback.bind(this);
  }

  joinLobby() {
    joinLobby(this.props.id, this.joinGame_callback);
  }

  joinGame_callback(err, res) {
    if (err) {
      console.log(err);
    } else {
      this.props.clickHandler(this.props.host, this.props.id);
    }
  }

  render() {
    // return(<div id={this.props.key} onClick={this.joinGame}>{this.props.name}</div>)
    return(<button id={this.props.id} className="lobby_button" host={this.props.host} onClick={this.joinLobby}>{this.props.name}</button>)
  }
}
export default LobbyRow;
