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

// console.log(store.getState());

// let unsubscribe = store.subscribe(() =>
//   console.log(store.getState().toJS())
// )

// store.dispatch(loadedCSV("ArtifactInfo"));
// store.dispatch(artifactChanged("Artifact1", 5));
// store.dispatch(artifactChanged("Artifact1", 2));
// store.dispatch(artifactChanged("Artifact1", 78));

// unsubscribe();

store.dispatch(test(5));


render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))


console.log("after render");

console.log(store.getState().toJS());

store.dispatch(test(15));

setTimeout(function() {
  console.log("after 1 seconds");
  console.log(store.getState().toJS());
}, 1000);