import React, {Component} from 'react';
import { addImage } from '../../api';
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  addImage(e) {
    e.preventDefault();
    var file = document.querySelector('form [name=file]').files[0];
    addImage(file, function(err, res) {
      if (err) console.log(err);
      console.log(res);
    });
  }

  render() {
    return(
      // <div className="hidden">
      <div>
        <form id="submit-img" className="img-form">
          <input id="img-file" type="file" name="file" accept="image/*" required/>
          <button type="submit" id="submit-btn" onClick={this.addImage}>Submit</button>
        </form>
        <div id="players">
        </div>
      </div>

    );
  }
}
export default GamePage;
