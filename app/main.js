import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import jwt from 'jsonwebtoken';

import store from './store';

import { loadedCSV, tokenChanged, usernameChanged, getUserState, updateGamestateValues } from './actions/actions';

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

// See if we're logged in
var token = localStorage.getItem('token');
if (token) {
  var decoded = jwt.decode(token, {complete: true});
  if (decoded.payload.exp > (Date.now() / 1000)) {
    var username = localStorage.getItem('username');
    console.log("token still good, setting username: ", username);
    // token is still good
    store.dispatch(usernameChanged(username));
    store.dispatch(tokenChanged(token));
  } else {
    // token expired
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}

console.log("calling loadArtifactInfo");
var numberLoaded = 0;

const loadFile = (filename) => {
  return (loaded) => {
    if (loaded) {
      store.dispatch(loadedCSV(filename));
      numberLoaded += 1;
      if (numberLoaded == 9) {
        console.log("all files loaded, getting user state");
        store.dispatch(getUserState());
        console.log("all files loaded, updating gamestate values");
        store.dispatch(updateGamestateValues());
      }
    }
  };
}

loadArtifactInfo(          loadFile("ArtifactInfo"));
loadEquipmentInfo(         loadFile("EquipmentInfo"));
loadHeroInfo(              loadFile("HeroInfo"));
loadHeroSkillInfo(         loadFile("HeroSkillInfo"));
loadHeroImprovementInfo(   loadFile("HeroImprovementInfo"));
loadLocalizationInfo(      loadFile("LocalizationInfo"));
loadPetInfo(               loadFile("PetInfo"));
loadPlayerImprovementInfo( loadFile("PlayerImprovementInfo"));
loadSkillInfo(             loadFile("SkillInfo"));

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