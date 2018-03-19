import React, {Component} from 'react';
import { getCurrentUser, addCaption } from '../../api';
import PlayArea from './PlayArea'
import UploadImage from './Game/UploadImage'
import Winner from './Game/Winner';
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  constructor(props){
    super(props);
    this.submitCounter = 0;
    this.state = {
        uploadImage : true,
        voting: false,
        endRound: false,
        waiting: false
    };
    this.imageId = null;

    this.onImageUpload = this.onImageUpload.bind(this);
    this.onForceStart = this.onForceStart.bind(this);
    this.onForceVotes = this.onForceVotes.bind(this);
  }

  componentWillMount() {
    this.props.socket.on('uploaded image', function(data){
      console.log(data);
      this.imageId = data;
    });
  }

  onImageUpload() {
    this.setState({uploadImage : false, waiting: true, voting: false, endRound: false});
  }
  onForceStart() {
    this.setState({uploadImage: false, voting: true, waiting: false, endRound: false});
    this.props.socket.emit('voting begins', {room : this.props.lobbyId});
    console.log(this.state);
  }
  onForceVotes() {
    this.setState({uploadImage: false, voting: false, waiting: false, endRound: true});
    this.props.socket.emit('voting complete', {room: this.props.lobbyId});
    console.log(this.state);
  }

  render() {
    if (getCurrentUser() === this.props.host) {
      if (this.state.uploadImage) {
        return <UploadImage socket={this.props.socket} onUpload={this.onImageUpload} lobbyId={this.props.lobbyId}/>;
      }
      if (this.state.waiting) {
        return <div class = "host_screen">Now waiting for players to submit their captions
                <button class="host_override" onClick={this.onForceStart}>You're taking too long! (Force start voting)</button>
              </div>
      }
      if (this.state.voting) {
        return <div class = "host_screen">Waiting for votes!
                <button class="host_override" onClick={this.onForceVotes}>Yeah we're done here. (Force end voting)</button>
              </div>
      }
      if (this.state.endRound) {
        //Winning image with caption
        return <div className='host_screen'>
                  <Winner imageId={this.imageId}/>
                  <button class="host_override">Another!</button>
               </div>
      }
    }
    return <PlayArea socket={this.props.socket} lobbyId={this.props.lobbyId}/>;
  }
}
export default GamePage;
