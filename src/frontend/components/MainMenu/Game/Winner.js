import React from 'react';
import { getCaptions } from '../../../api';
import '../../../style/components/MainMenu/GamePage.css';
import '../../../style/components/MainMenu/Game/Winner.css';
import '../../../style/components/MainMenu/Lobby/LobbyTable.css';

class Winner extends React.Component {
  constructor(props) {
    super(props);
    this.getCaption_callback = this.getCaption_callback.bind(this);
    this.state = {
      caption: null
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
    return <div className="winner">
              <div className="winner_title_text"> Winner! </div>
              <div className="winner_author">{this.props.author}</div>
              <div className="caption_text">{this.props.caption}</div>
              <img src={link}></img>
           </div>
  }
}
export default Winner;
