import React from 'react';
import {addCaption} from '../../../api';
import '../../../style/components/MainMenu/Game/PlayerBox.css';

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
    addCaption(caption, imageId, this.submitCaptionHandler_callback);
  }

  submitCaptionHandler_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    this.props.captionHandler();
  }

  render() {
    return (
      <div className='playerbox'>
        <form id='caption-form'>
          <textarea id='caption-text' placeholder='enter your caption here...'></textarea>
          <button onClick={this.submitCaptionHandler}>Submit caption</button>
        </form>
      </div>
    );
  }
}
export default MakeCaption;
