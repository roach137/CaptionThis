import React, {Component} from 'react';
import Body from '../components/Homepage/Body';
import Header from '../components/Homepage/Header';
import SocketClient from "socket.io-client";
import '../style/pages/Homepage.css';

class Homepage extends Component {
  send = function() {
    const socket = SocketClient("https://localhost:5000");
    socket.emit('test', 'memes are nice');
  }
  render() {
    const socket = SocketClient("https://localhost:5000");
    socket.on('test', function() {
      console.log('Server responded');
    });
    return(
      <div>
        <button onClick={() => this.send()}>Change Color</button>
        <Header/>
        <Body/>
      </div>
    );
  }
}
export default Homepage
