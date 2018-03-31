import React from 'react';
import MakeCaption from './Game/MakeCaption';
import CaptionVote from './Game/CaptionVote';
import UploadImage from './Game/UploadImage';
import Winner from './Game/Winner';

class PlayArea_Host extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      uploading_image : true,
      waiting_captions : false,
      voting : false,
      show_winner : false,
    };
    // this.imageId = null;
    // this.winner = null;
    // this.winning_caption = null;

    this.onForceStart = this.onForceStart.bind(this);
    this.onNextRound = this.onNextRound.bind(this);
  }

  componentWillMount(){
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      self.setState({uploading_image : false,
        waiting_captions : true,
        voting : false,
        imageId : data});
    });
    this.props.socket.on('voting begins', function(data) {
      self.setState({uploading_image : false,
        waiting_captions : false,
        voting : true,
        imageId : self.state.imageId});
    });
    this.props.socket.on('voting complete', function(data) {
      self.setState({uploading_image : false,
        waiting_captions : false,
        voting : false,
        show_winner : true,
        imageId : self.state.imageId,
        winner : data.author,
        winning_caption : data.caption});
    });
    this.props.socket.on('next round', function(data) {
      self.setState({uploading_image : true,
        waiting_captions : false,
        voting : false,
        show_winner : false});
    });
  }

  onForceStart() {
    this.props.socket.emit('voting begins', {room : this.props.lobbyId, imageId: this.state.imageId});
    console.log("emitting", this.imageId);
    console.log(this.state);
  }

  onNextRound() {
    this.props.socket.emit('next round', {room: this.props.lobbyId});
    console.log(this.state);
  }

  render() {
    if (this.state.uploading_image) {
      return (
        <div id="playarea">
          <UploadImage socket={this.props.socket} lobbyId={this.props.lobbyId}/>
        </div>
      );
    }
    if (this.state.waiting_captions) {
      return(
        <div className="host_screen">Now waiting for players to submit their captions
          <button className="host_override" onClick={this.onForceStart}>Force start voting</button>
        </div>
      );
    }
    if (this.state.voting) {
      return(
        <div class = "host_screen">Pick your favourite!
          <CaptionVote imageId={this.state.imageId} lobbyId={this.props.lobbyId} socket={this.props.socket}/>
        </div>
      );
    }
    if (this.state.show_winner) {
      console.log(this.state.winner);
      return(
        <div class = "host_screen">
        <Winner author={this.state.winner} caption={this.state.winning_caption} imageId={this.state.imageId}/>
        <button className="host_override" onClick={this.onNextRound}>Another!</button></div>
      );
    }
  }
}
export default PlayArea_Host;
