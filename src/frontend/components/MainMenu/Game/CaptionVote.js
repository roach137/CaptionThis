import React from 'react';
import { getCaptions } from '../../../api';

class CaptionVote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captions : [],
      captionElmts : []
    }
    this.getCaption_callback = this.getCaption_callback.bind(this);
    // this.winning_caption = null;
    this.onSelection = this.onSelection.bind(this);
  }

  componentWillMount() {
    // console.log(this.props.imageId);
    getCaptions(this.props.imageId, this.getCaption_callback);
  }

  onSelection = (caption, author) => (e) => {
    //get the caption text from the function call
    console.log(caption);
    console.log(author);
    // this.winner = author;
    // this.winning_caption = caption;
    //emit the data (THIS DOES NOT WORK, it only emits the lobby ID, I don't know why)
    var data = {room: this.props.lobbyId, imageId: this.props.imageId, caption: caption, author : author};
    this.props.socket.emit('voting complete', data);
    // console.log("emitting", this.props.imageId, this.props.lobbyId, this.winner);
  }

  getCaption_callback(err, res) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(res);
    var elmts = [];
    for (var i = 0; i < res.length; i++) {
      var id = res[i]._id;
      var caption_text = res[i].caption;
      var author = res[i].author
      // console.log(this.state.captions[i]._id, id);
      // console.log(caption_text);
      elmts.push(
      <button key={id}
        author={author}
        id={id}
        onClick={this.onSelection(caption_text, author)}>{caption_text}</button>
      );
    }
    // console.log(elmts);
    this.setState({captions : res, captionElmts : elmts});
  }

  render() {
    return <div>{this.state.captionElmts}</div>;
  }
}
export default CaptionVote;
