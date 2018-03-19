import React from 'react';
import { getCaptions } from '../../../api';
import '../../../style/components/MainMenu/GamePage.css'

class Winner extends React.Component {
  constructor(props) {
    super(props);
    this.getCaption = this.getCaption.bind(this);
    this.getCaption_callback = this.getCaption_callback.bind(this);
  }
  
  getCaption() {
    var caption_link = '/api/images/'+this.props.imageId+'/captions/';
    console.log(caption_link);
    var all_captions = getCaptions(this.props.imageId, this.getCaption_callback);
    console.log(all_captions);
  }

  getCaption_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    this.props.captionHandler();
  }

  render() {
    var caption_text = this.getCaption();
    var link = '/api/images/' + this.props.imageId + '/image/';
    return <div class="winner">
              <div class="winner_title_text"> Winner! </div>
              <div class="caption_text"> {caption_text}</div>
              <img src={link}></img>
           </div>
  }
}
export default Winner;
