import React from 'react';
import ReactDOM from 'react-dom';

// import { Switch, HashRouter, Route } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
// import {Router, Route, Switch} from 'react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Homepage from './frontend/pages/Homepage'
import MainMenu from './frontend/pages/MainMenu'
import Lobby from './frontend/components/MainMenu/Lobby/Lobby'
import GamePage from './frontend/components/MainMenu/GamePage'

ReactDOM.render((
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route path="/mainmenu" component={MainMenu}/>

        <Route path="/host" component={Lobby}/>
        <Route path="/game" component={GamePage}/>
      </Switch>
    </Router>
), document.getElementById('root'));
