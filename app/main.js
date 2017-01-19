import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';

import store from './store';

import { loadedCSV } from './actions/actions';

import App from './components/App';
import Home from './components/Home';
import FAQ from './components/FAQ';
import Reference from './components/Reference';
import Formulas from './components/Formulas';


import { loadArtifactInfo } from './util/Artifact';
import { loadEquipmentInfo } from './util/Equipment';
import { loadHeroInfo, loadHeroSkillInfo } from './util/Hero';
import { loadHeroImprovementInfo } from './util/HeroImprovementBonus';
import { loadLocalizationInfo } from './util/Localization';
import { loadPetInfo } from './util/Pet';
import { loadPlayerImprovementInfo } from './util/PlayerImprovementBonus';
import { loadSkillInfo } from './util/Skill';

console.log("in main.js");

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

// unsubscribe();

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="faq" component={FAQ}/>
        <Route path="ref" component={Reference}/>
        <Route path="for" component={Formulas}/>
      </Route>
    </Router>
  </Provider>
), document.getElementById('app'))