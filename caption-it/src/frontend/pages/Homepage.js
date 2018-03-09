import React, {Component} from 'react';
import Body from '../components/Homepage/Body'
import Header from '../components/Homepage/Header'
import '../style/pages/Homepage.css';

class Homepage extends Component {
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
