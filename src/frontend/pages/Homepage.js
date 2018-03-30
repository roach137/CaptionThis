import React, {Component} from 'react';
import Body from '../components/Homepage/Body';
import Header from '../components/Homepage/Header';
import '../style/pages/Homepage.css';
import { getCurrentUser, signout } from '../api';

class Homepage extends Component {
  componentWillMount() {
    if (getCurrentUser()) {
      window.location = '/mainmenu';
    }
  }

  render() {
    return(
      <div>
        <Header/>
        <Body/>
      </div>
    );
  }
}
export default Homepage
