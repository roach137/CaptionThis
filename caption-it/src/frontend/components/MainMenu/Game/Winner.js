import React from 'react';
import { getCaptions } from '../../../api';
import '../../../style/components/MainMenu/GamePage.css'
import '../../../style/components/MainMenu/Lobby/LobbyTable.css'

class Winner extends React.Component {
  constructor(props) {
    super(props);
    this.getCaption_callback = this.getCaption_callback.bind(this);
    this.state = {
      caption: []
    }
  }
  
  componentWillMount() {
    console.log(this.props.imageId);
    getCaptions(this.props.imageId, this.getCaption_callback);
  }

  getCaption_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(res);
    this.setState({caption: res});
  }

  render() {
    var link = '/api/images/' + this.props.imageId + '/image/';
    console.log(this.state.caption, this.state.caption[0]);
    var caption_text = null;
    if (this.state.caption[0]) {
      caption_text = this.state.caption[0].caption;
      console.log(caption_text);
    }
    return <div class="winner">
              <div class="winner_title_text"> Winner! </div>
              <div class="caption_text">{caption_text}</div>
              <img src={link}></img>
           </div>
  }
}
export default Winner;
