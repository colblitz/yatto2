// import React from 'react';
// import Router from 'react-router';
// import ReactDOM from 'react-dom';
// import createBrowserHistory from 'history/createBrowserHistory';
// import routes from './routes';
// import { test } from './util/Calculator';

// let history = createBrowserHistory();
// console.log("asdf");
// test();
// ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';

console.log("in main.js");
render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
    </Route>
  </Router>
), document.getElementById('app'))