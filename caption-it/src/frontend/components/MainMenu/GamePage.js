import React, {Component} from 'react';
import '../../style/components/MainMenu/GamePage.css'

class GamePage extends Component {
  componentDidMount() {

  }

  render() {
    return(
      // <div className="hidden">
      <div>
        <form id="submit-img" className="img-form">
          <input id="img-file" type="file" name="file" accept="image/*" required/>
          <button type="submit" id="submit-btn" >Submit</button>
        </form>
        <div id="players">
        </div>
      </div>

    );
  }
}
export default GamePage;
