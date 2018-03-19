import React, {Component} from 'react';
import { getCurrentUser, addCaption } from '../../api';
import PlayArea from './PlayArea'
import UploadImage from './Game/UploadImage'
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  constructor(props){
    super(props);
    this.submitCounter = 0;
    this.state = {
        uploadImage : true
    };

    this.onImageUpload = this.onImageUpload.bind(this);
    this.onForceStart = this.onForceStart.bind(this);
  }

  onImageUpload() {
    this.setState({uploadImage : false});
  }
  onForceStart() {
    this.props.socket.emit('voting begins', {room : this.props.lobbyId});
  }

  render() {
    if (getCurrentUser() === this.props.host) {
      if (this.state.uploadImage) {
        return <UploadImage socket={this.props.socket} onUpload={this.onImageUpload} lobbyId={this.props.lobbyId}/>;
      }
      return <div class = "host_screen">Now waiting for players to submit their captions
              <button class="host_override" onClick={this.onForceStart}>You're taking too long! (Force start voting)</button>
            </div>
    }
    return <PlayArea socket={this.props.socket} lobbyId={this.props.lobbyId}/>;
  }
}
export default GamePage;
