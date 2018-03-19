import React from 'react';
import MakeCaption from './Game/MakeCaption';

class PlayArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      submitCaption : false,
      waiting : false,
      voting : false
    };

    this.onCaptionSubmit = this.onCaptionSubmit.bind(this);
  }

  componentWillMount(){
    var self = this;
    this.props.socket.on('uploaded image', function(data){
      self.setState({submitCaption : true});
    });
  }

  onCaptionSubmit(){
    this.setState({submitCaption : false, waiting : true, voting : false})
  }

  render(){
    if (this.state.submitCaption) {
      return (
        <div id="playarea">
          <MakeCaption captionHandler={this.onCaptionSubmit} socket={this.props.socket}/>
        </div>
      );
    }
    if (this.state.waiting) {
      <div id="playarea">
        Waiting for other players to finish
      </div>
    }
    return (
      <div id="playarea">
        Host is choosing an image.
      </div>
    );
  }
}
export default PlayArea;
