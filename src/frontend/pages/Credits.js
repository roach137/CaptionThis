import React from 'react';
import '../style/pages/Credits.css'

class Credits extends React.Component {
  render() {
    return(
      <div className='credits'>
        <header>
          <a href='/'>Caption it!</a>
        </header>
        <div className='credits-content'>
          <p>The Caption it! web application is created and owned by David Wan and Gavin Zhang.</p>
        </div>
        <h2>Background image</h2>
        <ul>
          <li>The main menu background image was created by <a href="http://fancycrave.com/">Fancycrave</a> and retrieved from Pexels at this <a href="https://www.pexels.com/photo/architecture-background-buildings-business-218983/">link</a></li>
        </ul>
      </div>
    );
  }
}
export default Credits;
