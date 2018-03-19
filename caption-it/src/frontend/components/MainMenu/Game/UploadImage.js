import React from 'react';
import { addImage } from '../../../api';
import '../../../style/components/MainMenu/Lobby/LobbyTable.css'

class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.addImage = this.addImage.bind(this);
    this.addImage_callback = this.addImage_callback.bind(this);
  }

  addImage(e) {
    e.preventDefault();
    var file = document.querySelector('form [name=file]').files[0];
    addImage(this.props.lobbyId, file, this.addImage_callback);

  }

  addImage_callback(err, res){
    if (err) {
      console.log(err)
      return;
    };
    console.log(res);
    this.props.socket.emit('uploaded image', {room : this.props.lobbyId, imageId : res._id });
    this.props.onUpload();
  }

  render() {
    return(<div>
            <form id="submit-img" className="img-form" onSubmit={this.addImage}>
              <input id="img-file" type="file" name="file" accept="image/*" required/>
              <button class="lobby_button" type="submit" id="submit-btn">Submit</button>
            </form>
            <div id="players"></div>
          </div>
    );
  }
}
export default UploadImage;
