import React from 'react';
import { getCaptions } from '../../../api';
import { vote } from '../../../api';

class CaptionVote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captions : []
    }
    this.getCaption_callback = this.getCaption_callback.bind(this);
    this.vote_callback = this.vote_callback.bind(this);
    this.vote = this.vote.bind(this);
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
  
  vote(captionId) {
    vote(captionId, this.vote_callback);
  }

  vote_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(res);
    this.setState({captions : res});
  }

  render() {
    var captions = [];
    console.log(this.state.captions);
    for (var i = 0; i < this.state.captions.length; i++) {
      captions.push(
      <button key={this.state.captions[i]._id} id={this.state.captions[i]._id}>{this.state.captions[i].caption}</button>)
    }
    console.log(captions);
    return <div>{captions}</div>;
  }
}
export default CaptionVote;
