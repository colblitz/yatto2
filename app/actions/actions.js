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

export function login() {
  return (dispatch, getState) => {
    console.log("dispatching from login");
    // url (required), options (optional)
    var thing = fetch('/test', {
      method: 'get'
    }).then(function(response) {
      return response.json();
      // console.log("response");
      // console.log(response);
      // console.log(response.json());
      // var jsonPromise = response.json();
      // jsonPromise.then((val) => console.log("promise value:", val),
      //   (err) => console.log("rejected: ", err));

    }).catch(function(err) {
      // Error :(
      console.log("error");
      console.log(err);
    });

    thing.then((val) => console.log("got:", val),
        (err) => console.log("rejected: ", err));

  }
}

export const test = (value) => {
  return {
    type: types.TEST,
    value
  }
}