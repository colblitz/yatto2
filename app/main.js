import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { loadedCSV, artifactChanged } from './actions/actions';
import rootReducer, { defaultState } from './reducers/Reducer';
import App from './components/App';
import Home from './components/Home';

console.log("in main.js");

let store = createStore(rootReducer, defaultState);

// console.log(store.getState());

// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState().toJS())
// )

// store.dispatch(loadedCSV("ArtifactInfo"));
// store.dispatch(artifactChanged("Artifact1", 5));
// store.dispatch(artifactChanged("Artifact1", 2));
// store.dispatch(artifactChanged("Artifact1", 78));

// unsubscribe();



render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
    </Route>
  </Router>
), document.getElementById('app'))


