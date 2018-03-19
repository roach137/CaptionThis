import React from 'react';
import MakeCaption from './Game/MakeCaption';
import CaptionVote from './Game/CaptionVote';

class PlayArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      submitCaption : false,
      waiting : false,
      voting : false,
      imageId : null
    };

    this.onCaptionSubmit = this.onCaptionSubmit.bind(this);
  }

  componentWillMount(){
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      self.setState({submitCaption : true, waiting : false, voting : false, imageId : data});
    });
  }

  onCaptionSubmit(){
    this.setState({submitCaption : false, waiting : true, voting : false});

  }

  render(){
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

    if (this.state.voting) {
      return(<div id="playarea">
        <CaptionVote imageId={this.state.imageId}/>
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
