import React from 'react';
import { getCaptions } from '../../../api';

class CaptionVote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captions : []
    }
  }

  componentWillMount() {
    getCaptions(this.props.imageId);
  }

  getCaption_callback(err, res) {
    if (err) {
      console.log(res);
      return;
    }
    this.setState({captions : res});
  }

  render() {
    //TODO: show captions
    return null;
  }
}
export default CaptionVote;
