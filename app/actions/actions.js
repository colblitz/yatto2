import * as types from './types';
import { GameState } from '../util/GameState';
import { getRelicSteps } from '../util/Calculator';
import { getGamestateFromState, getStateString } from '../reducers/Reducer';
var Immutable = require('immutable');
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

export const equipmentActiveChanged = (eid, checked) => {
  return {
    type: types.EQUIPMENT_ACTIVE_CHANGED,
    eid,
    checked
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
      var method = state.getIn(['options', 'method'], 0);
      var relics = state.getIn(['options', 'relics'], 0);
      var maxstage = state.getIn(['options', 'maxstage'], 0);
      var tps = state.getIn(['options', 'tps'], 0);
      var results = getRelicSteps(gamestate, {
        method,
        relics,
        maxstage,
        tps
      });
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

export const allStepsApplied = () => {
  return {
    type: types.ALL_STEPS_APPLIED,
  }
}

export const resetSteps = () => {
  return {
    type: types.RESET_STEPS,
  }
}

export const methodChanged = (method) => {
  return {
    type: types.METHOD_CHANGED,
    method
  }
}

export const aorderChanged = (aorder) => {
  return {
    type: types.AORDER_CHANGED,
    aorder
  }
}

export const toggleAdvanced = (show) => {
  return {
    type: types.TOGGLE_ADVANCED,
    show
  }
}

export const toggleUpdate = (show) => {
  return {
    type: types.TOGGLE_UPDATE,
    show
  }
}


export const optionValueChanged = (key, newValue) => {
  return {
    type: types.OPTION_VALUE_CHANGED,
    key,
    newValue
  }
}

// TODO: change to a thunk
export const equipmentAdded = (eid, level, bonus) => {
  return {
    type: types.EQUIPMENT_ADDED,
    eid,
    level,
    bonus
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

export const equipmentAddedBonus = (category, bonus) => {
  return {
    type: types.EQUIPMENT_ADDED_BONUS,
    category,
    bonus
  }
}

export const newGameState = (newGameState) => {
  return {
    type: types.NEW_GAME_STATE,
    newGameState
  }
}

export const stateFromServer = (stateToMergeIn) => {
  return {
    type: types.STATE_FROM_SERVER,
    stateToMergeIn
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

export const tokenChanged = (token) => {
  return {
    type: types.TOKEN_CHANGED,
    token
  }
}

export function handleResponse(response, handleJson, endpoint) {
  console.log("Endpoint: ", endpoint);
  response.json().then(json => {
    if (json.error) {
      console.log("  Error: ", json.error);
    } else {
      console.log("  Response: ", json);
      handleJson(json);
    }
  }, err => {
    console.log("Failed to get response");
  })
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
    }).then(response => handleResponse(response, json => {
      if (json.token) {
        dispatch(tokenChanged(json.token));
      }
    }, "POST /register"));
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
    }).then(response => handleResponse(response, json => {
      if (json.token) {
        dispatch(tokenChanged(json.token));
        getUserState(json.token)(dispatch, getState);
      }
    }, "POST /login"));
  }
}

export const logout = () => {
  return {
    type: types.LOGOUT,
  }
}

export function saveUserState(token) {
  return (dispatch, getState) => {
    console.log("dispatching from saveState with token: ", token);

    fetch('/state', {
      method: 'post',
      headers: {
        'Authorization': 'JWT ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state: getStateString(getState())
      })
    }).then(response => handleResponse(response, json => {

    }, "POST /state"));
  }
}


export function getUserState(token) {
  return (dispatch, getState) => {
    console.log("dispatching from getState with token: ", token);

    fetch('/state', {
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + token
      }
    }).then(response => handleResponse(response, json => {
      var s = JSON.parse(json.state);
      dispatch(stateFromServer(Immutable.fromJS(s)));
    }, "GET /state"));
  }
}

export const tabChanged = (tabIndex) => {
  return {
    type: types.TAB_CHANGED,
    tabIndex
  }
}




export function test(token) {
  return (dispatch, getState) => {
    console.log("dispatching from state with token: ", token);

    fetch('/state', {
      method: 'get',
      headers: {
        'Authorization': 'JWT ' + token
      }
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
