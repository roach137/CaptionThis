import React from 'react';
import MakeCaption from './Game/MakeCaption';

class PlayArea extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      submitCaption : false,
      voting : false
    };

    this.onCaptionSubmit = this.onCaptionSubmit.bind(this);
  }

  onImageUpload() {
    this.setState({submitCaption : true});
  }

  render(){
    if (this.state.submitCaption) {
      return (
        <div id="playarea">
          <MakeCaption captionHandler={this.onCaptionSubmit} socket={this.props.socket}/>
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
