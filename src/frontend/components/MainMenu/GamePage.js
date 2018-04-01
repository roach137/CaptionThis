import React, {Component} from 'react';
import { getCurrentUser, addCaption, leaveGame, destroyLobby } from '../../api';
import GameOptions from './GameOptions';
import Winner from './Game/Winner';
import CaptionVote from './Game/CaptionVote';
import PlayArea_Host from './PlayArea_Host';
import PlayArea_Client from './PlayArea_Client';
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  constructor(props){
    super(props);
    this.state = {leaving_game : false};
    this.leaveGame = this.leaveGame.bind(this);
    this.leaveGame_callback = this.leaveGame_callback.bind(this);
  }

  componentWillMount() {
    console.log(this.props.lobbyId);
    var self = this;
    this.props.socket.on('host left', function(data){
      leaveGame(self.props.lobbyId, self.leaveGame_callback);
    });
  }

  leaveGame_callback(err, res){
    if (err) {
      console.log(err);
      return;
    }
    if (this.props.host === getCurrentUser()) {
      destroyLobby(this.props.lobbyId, function(err, res){
        if (err) {
          console.log(err);
          return;
        }
      })
      this.props.socket.emit('host left', this.props.lobbyId);
    }

    this.props.socket.emit('leave game', this.props.lobbyId);
    this.setState({leaving_game : true});
  }

  leaveGame(){
    leaveGame(this.props.lobbyId, this.leaveGame_callback);

  }

  render() {
    if (this.state.leaving_game) {
      return(
        <GameOptions/>
      );
    }

    if (getCurrentUser() === this.props.host) {
      return(
        <div>
          <PlayArea_Host socket={this.props.socket} lobbyId={this.props.lobbyId}/>
          <button id='leave-game-btn' onClick={this.leaveGame}>Leave Game</button>
        </div>
      );
    }
    return(
      <div>
        <PlayArea_Client socket={this.props.socket} lobbyId={this.props.lobbyId}/>
        <button id='leave-game-btn' onClick={this.leaveGame}>Leave Game</button>
      </div>
    );
  }
}
export default GamePage;
