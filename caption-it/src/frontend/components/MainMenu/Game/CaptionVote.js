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
    console.log(this.props.imageId);
    getCaptions(this.props.imageId, this.getCaption_callback);
  }

  getCaption_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(res);
    this.setState({captions : res});
  }

  render() {
    var captions = [];
    for (var i = 0; i < this.state.captions.length; i++) {
      captions.push(<button id={this.state.captions[i]._id}></button>)
    }
    return <div>{captions}</div>;
  }
}
export default CaptionVote;
