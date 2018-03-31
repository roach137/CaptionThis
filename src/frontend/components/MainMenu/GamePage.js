import React, {Component} from 'react';
import { getCurrentUser, addCaption, leaveGame } from '../../api';
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

  leaveGame_callback(err, res){
    if (err) {
      console.log(err);
      return;
    }
    this.props.socket.emit('leave game', this.props.lobbyId);
    this.setState({leaving_game : true});
  }

  leaveGame(){
    console.log('leaving game');
    leaveGame(this.props.lobbyId, this.leaveGame_callback);

  }

  render() {
    if (this.state.leaving_game) {
      // if (getCurrentUser() === this.props.host) {
      //
      // }
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
