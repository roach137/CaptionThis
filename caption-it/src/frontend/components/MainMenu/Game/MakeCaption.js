import React from 'react';
import {addCaption} from '../../../api';
import '../../../style/components/MainMenu/Game/PlayerBox.css';
import '../../../style/components/MainMenu/Lobby/LobbyTable.css'


class MakeCaption extends React.Component {
  constructor(props){
    super(props);
    this.submitCaptionHandler = this.submitCaptionHandler.bind(this);
    this.submitCaptionHandler_callback = this.submitCaptionHandler_callback.bind(this);
  }

  submitCaptionHandler(e) {
    e.preventDefault();
    var caption = document.querySelector('#caption-text').value;
    console.log(caption);
    var imageId = "PLACEHOLDER";
    addCaption(caption, imageId, this.props.lobbyId, this.submitCaptionHandler_callback);
  }

  submitCaptionHandler_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    this.props.captionHandler();
  }

  render() {
    var link = '/api/images/' + this.props.imageId + '/image/'
    return (
      <div className='playerbox'>
        <img src={link}/>
        <form id='caption-form' onSubmit={this.submitCaptionHandler}>
          <textarea id='caption-text' placeholder='enter your caption here...' required></textarea>
          <button class = "lobby_button">Submit caption</button>
        </form>
      </div>
    );
  }
}
export default MakeCaption;
