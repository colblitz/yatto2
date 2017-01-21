import * as types from './types';
import { GameState } from '../util/GameState';
import { getRelicSteps } from '../util/Calculator';
import { getGamestateFromState } from '../reducers/Reducer';
require('es6-promise').polyfill();
require('isomorphic-fetch');

export const loadedCSV = (infoName) => {
  return {
    type: types.LOADED_CSV,
    infoName
  }
}

export const swordmasterChanged = (newLevel) => {
  return {
    type: types.SWORDMASTER_CHANGED,
    newLevel
  }
}

export const heroLevelChanged = (hid, newLevel) => {
  return {
    type: types.HERO_LEVEL_CHANGED,
    hid,
    newLevel
  }
}

export const heroWeaponChanged = (hid, newLevel) => {
  return {
    type: types.HERO_WEAPON_CHANGED,
    hid,
    newLevel
  }
}

export const artifactLevelChanged = (aid, newLevel) => {
  return {
    type: types.ARTIFACT_LEVEL_CHANGED,
    aid,
    newLevel
  }
}

export const petLevelChanged = (pid, newLevel) => {
  return {
    type: types.PET_LEVEL_CHANGED,
    pid,
    newLevel
  }
}

export const petActiveChanged = (pid) => {
  return {
    type: types.PET_ACTIVE_CHANGED,
    pid
  }
}

export const equipmentLevelChanged = (eid, newLevel) => {
  return {
    type: types.EQUIPMENT_LEVEL_CHANGED,
    eid,
    newLevel
  }
}

export const equipmentBonusChanged = (eid, newBonus) => {
  return {
    type: types.EQUIPMENT_BONUS_CHANGED,
    eid,
    newBonus
  }
}

export const equipmentActiveChanged = (eid) => {
  return {
    type: types.EQUIPMENT_ACTIVE_CHANGED,
    eid
  }
}

export const skillLevelChanged = (sid, newLevel) => {
  return {
    type: types.SKILL_LEVEL_CHANGED,
    sid,
    newLevel
  }
}

export function getStepsAction() {
  return (dispatch, getState) => {
    dispatch(stepsRequested());
    setTimeout(function() {
      var state = getState();
      var gamestate = getGamestateFromState(state);
      var relics = state.getIn(['options', 'relics'], 0);
      var maxstage = state.getIn(['options', 'maxstage'], 0);
      var results = getRelicSteps(gamestate, relics);
      dispatch(stepsChanged(results.steps, results.summarySteps));
    }, 0);
  }
}

export const stepsRequested = () => {
  return {
    type: types.STEPS_REQUESTED
  }
}

export const stepsChanged = (newSteps, newSummarySteps) => {
  return {
    type: types.STEPS_CHANGED,
    newSteps,
    newSummarySteps
  }
}

export const stepApplied = (index) => {
  return {
    type: types.STEP_APPLIED,
    index
  }
}

export const summaryStepApplied = (index) => {
  return {
    type: types.SUMMARY_STEP_APPLIED,
    index
  }
}

export const optionValueChanged = (key, newValue) => {
  return {
    type: types.OPTION_VALUE_CHANGED,
    key,
    newValue
  }
}

export const equipmentAdded = (eid) => {
  return {
    type: types.EQUIPMENT_ADDED,
    eid
  }
}

export const equipmentRemoved = (eid) => {
  return {
    type: types.EQUIPMENT_REMOVED,
    eid
  }
}

export const equipmentSelected = (category, eid) => {
  return {
    type: types.EQUIPMENT_SELECTED,
    category,
    eid
  }
}

export const newGameState = (newGameState) => {
  return {
    type: types.NEW_GAME_STATE,
    newGameState
  }
}

export const usernameChanged = (username) => {
  return {
    type: types.USERNAME_CHANGED,
    username
  }
}

export const passwordChanged = (password) => {
  return {
    type: types.PASSWORD_CHANGED,
    password
  }
}

export function register() {
  return (dispatch, getState) => {
    console.log("dispatching from register");

    var state = getState();
    var username = state.getIn(['auth', 'username']);
    var password = state.getIn(['auth', 'password']);

    fetch('/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      })
    }).then(response =>
      response.json().then(json => {
        if (json.error) {
          console.log("got error");
          console.log(json.error);
        } else {
          console.log("got response");
          console.log(json);
        }
      }, err => {
        console.log("Failed to get response");
      })
    );
  }
}

export function login() {
  return (dispatch, getState) => {
    console.log("dispatching from login");

    var state = getState();
    var username = state.getIn(['auth', 'username']);
    var password = state.getIn(['auth', 'password']);

    fetch('/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      })
    }).then(response =>
      response.json().then(json => {
        if (json.error) {
          console.log("got error");
          console.log(json.error);
        } else {
          console.log("got response");
          console.log(json);
        }
      }, err => {
        console.log("Failed to get response");
      })
    );

  }
}

export const test = (value) => {
  return {
    type: types.TEST,
    value
  }
}