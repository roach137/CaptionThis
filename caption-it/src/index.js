import React from 'react';
import ReactDOM from 'react-dom';

// import { Switch, HashRouter, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {Router, Route, Switch} from 'react-router';

import Homepage from './frontend/pages/Homepage'
import MainMenu from './frontend/pages/MainMenu'
import HostGame from './frontend/components/MainMenu/HostGame'
import GamePage from './frontend/components/MainMenu/GamePage'

const history = createHistory();

ReactDOM.render((
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/mainmenu" component={MainMenu}/>

        <Route exact path="/host" component={HostGame}/>
        <Route exact path="/game" component={GamePage}/>
      </Switch>
    </Router>
), document.getElementById('root'));
