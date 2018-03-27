import React, {Component} from 'react';
import { getCurrentUser, addCaption } from '../../api';
import PlayArea from './PlayArea'
import UploadImage from './Game/UploadImage'
import Winner from './Game/Winner';
import CaptionVote from './Game/CaptionVote';
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  constructor(props){
    super(props);
    this.submitCounter = 0;
    this.state = {
        uploadImage : true,
        voting: false,
        endRound: false,
        waiting: false,
        imageId: null,
        winner: null
    };

    this.onImageUpload = this.onImageUpload.bind(this);
    this.onForceStart = this.onForceStart.bind(this);
    this.onNextRound = this.onNextRound.bind(this);
  }

  componentWillMount() {
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      console.log(data);
      self.setState({uploadImage: false, voting: false, waiting: true, endRound: false, imageId: data});
    });
    this.props.socket.on('voting begins', function(data){
      console.log(data);
      self.setState({uploadImage: false, voting: true, waiting: false, endRound: false, imageId: data});
    });
    this.props.socket.on('voting complete', function(data){
      console.log("vote complete", data);
      self.setState({uploadImage: false, voting: false, waiting: false, endRound: true, imageId: data.imageId, winner: data.caption});
    });
    this.props.socket.on('next round', function(data) {
      console.log('next round', data);
      self.setState({uploadImage: true, voting: false, waiting: false, endRound: false, imageId: null});
    });
  }

  onImageUpload() {
    //this.setState({uploadImage : false, waiting: true, voting: false, endRound: false, imageId: this.imageId});
  }
  onForceStart() {
    this.props.socket.emit('voting begins', {room : this.props.lobbyId, imageId: this.state.imageId});
    console.log("emitting", this.state.imageId);
    console.log(this.state);
  }
  onNextRound() {
    this.props.socket.emit('next round', {room: this.props.lobbyId});
    console.log("emitting next round", this.props.lobbyId);
  }
  /*onForceVotes() {
    this.props.socket.emit('voting complete', {room: this.props.lobbyId, imageId: this.state.imageId});
    console.log("emitting", this.state.imageId, this.props.lobbyId);
    console.log(this.state);
  }*/

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
        //pass the data to CaptionVote with lobbyId, imageId and socket
        return <div class = "host_screen">Pick your favourite!
                <CaptionVote imageId={this.state.imageId} lobbyId={this.props.lobbyId} socket={this.props.socket}/>
              </div>
      }
      if (this.state.endRound) {
        //Winning image with caption
        console.log(this.state.winner);
        return <div className='host_screen'>
                  <Winner imageId={this.state.imageId} caption={this.state.winner}/>
                  <button class="host_override" onClick={this.onNextRound}>Another!</button>
               </div>
      }
    }
    return <PlayArea socket={this.props.socket} lobbyId={this.props.lobbyId}/>;
  }
}
export default GamePage;
