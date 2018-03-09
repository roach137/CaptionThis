import React from 'react';
import ReactDOM from 'react-dom';

// import { Switch, HashRouter, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {Router, Route, Switch} from 'react-router';

import Homepage from './frontend/pages/Homepage'
import MainMenu from './frontend/pages/MainMenu'

const history = createHistory();

ReactDOM.render((
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route exact path="/mainmenu" component={MainMenu}/>
      </Switch>
    </Router>
), document.getElementById('root'));
