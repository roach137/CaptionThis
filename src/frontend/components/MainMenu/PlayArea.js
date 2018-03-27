import React from 'react';
import MakeCaption from './Game/MakeCaption';
import CaptionVote from './Game/CaptionVote';
import Winner from './Game/Winner';

class PlayArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      submitCaption : false,
      waiting : false,
      voting : false,
      endRound: false,
      imageId : null,
      winner: null
    };
    this.imageId = null;
    this.winner = null;

    this.onCaptionSubmit = this.onCaptionSubmit.bind(this);
  }

  componentWillMount(){
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      this.imageId = data;
      self.setState({submitCaption : true, waiting : false, voting : false, endRound: false, imageId : data});
    });
    this.props.socket.on('voting begins', function(data) {
      self.setState({submitCaption: false, waiting: false, voting: true, endRound: false, imageId : data});
    });
    this.props.socket.on('voting complete', function(data) {
      self.setState({submitCaption: false, waiting: false, voting: false, endRound: true, imageId : data.imageId, winner: data.caption});
    });
    this.props.socket.on('next round', function(data) {
      self.setState({submitCaption: false, waiting: false, voting: false, endRound: false, imageId: null});
    });
  }

  onCaptionSubmit(){
    this.setState({submitCaption : false, waiting : true, voting : false, endRound: false, imageId : this.state.imageId});
  }

  render() {
    var link = '/api/images/' + this.props.imageId + '/image/'
    if (this.state.submitCaption) {
      console.log(this.imageId);
      return (
        <div id="playarea">
          <MakeCaption captionHandler={this.onCaptionSubmit} socket={this.props.socket} imageId={this.state.imageId} lobbyId={this.props.lobbyId}/>
        </div>
      );
    }
    if (this.state.waiting) {
      return(<div id="playarea">
        Waiting for other players to finish
      </div>
      );
    }
    if (this.state.endRound) {
      return (<div id="playarea">
                <Winner imageId={this.state.imageId} caption={this.state.winner}/>
              </div>);
    }

    if (this.state.voting) {
      console.log(this.state.imageId);
      return(<div id="playarea">
            Waiting for the host's selection.
      </div>
      );
    }
    return (
      <div id="playarea">
        Host is choosing an image.
      </div>
    );
  }
}
export default PlayArea;
