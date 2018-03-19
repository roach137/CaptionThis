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
  }

  onImageUpload() {
    this.setState({uploadImage : false});
  }

  render() {
    if (getCurrentUser() === this.props.host) {
      if (this.state.uploadImage) {
        return <UploadImage socket={this.props.socket} onUpload={this.onImageUpload} lobbyId={this.props.lobbyId}/>;
      }
      return <div>Now waiting for players to submit their captions</div>
    }
    return <PlayArea socket={this.props.socket} lobbyId={this.props.lobbyId}/>;
  }
}
export default GamePage;
