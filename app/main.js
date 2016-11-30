import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import routes from './routes';
import { test } from './util/Calculator';

let history = createBrowserHistory();
console.log("asdf");
test();
ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));