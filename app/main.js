import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { loadedCSV, artifactChanged, test } from './actions/actions';
import rootReducer, { defaultState } from './reducers/Reducer';
import App from './components/App';
import Home from './components/Home';

import { loadArtifactInfo } from './util/Artifact';

console.log("in main.js");

let store = createStore(rootReducer, defaultState);

console.log("store created");

console.log("calling loadArtifactInfo");
loadArtifactInfo(function(loaded) {
  if (loaded) {
    store.dispatch(loadedCSV("ArtifactInfo"));
  }
});

// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState().toJS())
// )

// unsubscribe();

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))