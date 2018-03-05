import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter, Route } from 'react-router-dom'

import Homepage from './frontend/pages/Homepage'

ReactDOM.render((
  <HashRouter>
    <Route path="/" component={Homepage}/>
  </HashRouter>
), document.getElementById('root'));
