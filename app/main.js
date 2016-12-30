import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { loadedCSV } from './actions/actions';
import rootReducer, { defaultState } from './reducers/Reducer';
import App from './components/App';
import Home from './components/Home';

import { loadArtifactInfo } from './util/Artifact';
import { loadEquipmentInfo } from './util/Equipment';
import { loadHeroInfo, loadHeroSkillInfo } from './util/Hero';
import { loadHeroImprovementInfo } from './util/HeroImprovementBonus';
import { loadLocalizationInfo } from './util/Localization';
import { loadPetInfo } from './util/Pet';
import { loadPlayerImprovementInfo } from './util/PlayerImprovementBonus';
import { loadSkillInfo } from './util/Skill';

console.log("in main.js");

let store = createStore(rootReducer, defaultState);

console.log("store created");

console.log("calling loadArtifactInfo");
loadArtifactInfo(          function(loaded) { if (loaded) { store.dispatch(loadedCSV("ArtifactInfo")); }});
loadEquipmentInfo(         function(loaded) { if (loaded) { store.dispatch(loadedCSV("EquipmentInfo")); }});
loadHeroInfo(              function(loaded) { if (loaded) { store.dispatch(loadedCSV("HeroInfo")); }});
loadHeroSkillInfo(         function(loaded) { if (loaded) { store.dispatch(loadedCSV("HeroSkillInfo")); }});
loadHeroImprovementInfo(   function(loaded) { if (loaded) { store.dispatch(loadedCSV("HeroImprovementInfo")); }});
loadLocalizationInfo(      function(loaded) { if (loaded) { store.dispatch(loadedCSV("LocalizationInfo")); }});
loadPetInfo(               function(loaded) { if (loaded) { store.dispatch(loadedCSV("PetInfo")); }});
loadPlayerImprovementInfo( function(loaded) { if (loaded) { store.dispatch(loadedCSV("PlayerImprovementInfo")); }});
loadSkillInfo(             function(loaded) { if (loaded) { store.dispatch(loadedCSV("SkillInfo")); }});

let unsubscribe = store.subscribe(() =>
  console.log(store.getState().toJS())
)

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