import React from 'react';
import MakeCaption from './Game/MakeCaption';
import CaptionVote from './Game/CaptionVote';
import Winner from './Game/Winner';

class PlayArea_Client extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      waiting_image : true,
      making_caption : false,
      waiting_all_captions : false,
      waiting_vote : false,
      show_winner : false,
    };

    this.onCaptionSubmit = this.onCaptionSubmit.bind(this);
  }

  componentWillMount(){
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      self.setState({
        waiting_image : false,
        making_caption : true,
        waiting_all_captions : false,
        waiting_vote : false,
        show_winner : false,
        imageId : data
      });
    });
    this.props.socket.on('voting begins', function(data) {
      self.setState({
        waiting_image : false,
        making_caption : false,
        waiting_all_captions : false,
        waiting_vote : true,
        show_winner : false
      });
    });
    this.props.socket.on('voting complete', function(data) {
      self.setState({
        waiting_image : false,
        making_caption : false,
        waiting_all_captions : false,
        waiting_vote : false,
        show_winner : true,
        winner : data.author,
        winning_caption : data.caption
      });
    });
    this.props.socket.on('next round', function(data) {
      self.setState({
        waiting_image : true,
        making_caption : false,
        waiting_all_captions : false,
        waiting_vote : false,
        show_winner : false,
      });
    });
  }

  onCaptionSubmit(){
    this.setState({
      waiting_image : false,
      making_caption : false,
      waiting_all_captions : true,
      waiting_vote : false,
      show_winner : false
    });
  }

  render() {
    if (this.state.waiting_image) {
      return (
        <div id="playarea">
          Host is choosing an image.
        </div>
      );
    }

    if (this.state.making_caption) {
      var link = '/api/images/' + this.state.imageId + '/image/';
      return (
        <div id="playarea">
          <MakeCaption captionHandler={this.onCaptionSubmit} socket={this.props.socket} imageId={this.state.imageId} lobbyId={this.props.lobbyId}/>
        </div>
      );
    }

    if (this.state.waiting_all_captions) {
      return(<div id="playarea">
        Waiting for other players to finish
      </div>
      );
    }
    if (this.state.waiting_vote) {
      console.log(this.state.imageId);
      return(
        <div id="playarea">
          Waiting for the hosts selection.
        </div>
      );
    }

    if (this.state.show_winner) {
      console.log(this.state.winner);
      //just ignore the class being host screen, its just a styling thing, as long as theres no button it doesnt matter
      return (
        <div id="playarea" class="host_screen">
          <Winner imageId={this.state.imageId} author={this.state.winner} caption={this.state.winning_caption}/>
        </div>
      );
    }
  }
}
export default PlayArea_Client;
