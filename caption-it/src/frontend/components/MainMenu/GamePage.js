import React, {Component} from 'react';
import { getCurrentUser, addCaption } from '../../api';
import PlayArea from './PlayArea'
import UploadImage from './Game/UploadImage'
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  render() {
    if (getCurrentUser() === this.props.host) {
      return <UploadImage/>;
    }
    return <PlayArea socket={this.props.socket}/>;
  }
}
export default GamePage;
