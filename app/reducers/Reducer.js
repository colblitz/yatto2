import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { GameState } from '../util/GameState';
var Immutable = require('immutable');

export const defaultState = Immutable.fromJS({
  infoDocs: {
    "ArtifactInfo": false,
    "EquipmentInfo": false,
    "HeroInfo": false,
    "HeroSkillInfo": false,
    "HeroImprovementInfo": false,
    "LocalizationInfo": false,
    "PetInfo": false,
    "PlayerImprovementInfo": false,
    "SkillInfo": false,
  },
  gamestate: {
    info: {},
    swordmaster: {},
    artifacts: {
      Artifact4: 234
    },
    heroes: {},
    equipment: {},
    pets: {},
    skills: {},
    clan: {},
  },
  steps: [],
  test: 0
});

function getGamestateFromState(state) {
  var jsState = state.toJS();
  return new GameState(
    jsState.gamestate.info,
    jsState.gamestate.swordmaster,
    jsState.gamestate.artifacts,
    jsState.gamestate.heroes,
    jsState.gamestate.equipment,
    jsState.gamestate.pets,
    jsState.gamestate.skills,
    jsState.gamestate.clan
  );
}

 // "info":{
 //    "playerId":"ebd20042-c0c6-4abd-aafd-22099b9dc3b9",
 //    "supportCode":"z3wkz",
 //    "reportedPlayers":[
 //      "7qwww5",
 //      "v3qxn"
 //    ],
 //    "totalActiveGameTime":116726.512856383,
 //    "gold":7.70443469899896e+44,
 //    "relics":101,
 //    "lastEquipMaxStage":596,
 //    "lastSkillMaxStage":551,
 //    "skillPoints":16,
 //    "maxStage":600
 //  },

function updateGamestateValues(state) {
  var gamestate = getGamestateFromState(state);

}

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.LOADED_CSV:
      console.log("setting: " + action.infoName);
      return state.setIn(['infoDocs', action.infoName], true);

    case types.SWORDMASTER_CHANGED:
      return state.setIn(['gamestate', 'swordmaster'], action.newLevel);
    case types.HERO_LEVEL_CHANGED:
      return state.setIn(['gamestate', 'heroes', 'levels', action.hid], action.newLevel);
    case types.HERO_WEAPON_CHANGED:
      return state.setIn(['gamestate', 'heroes', 'weapons', action.hid], action.newLevel);
    case types.ARTIFACT_LEVEL_CHANGED:
      return state.setIn(['gamestate', 'artifacts', action.aid], action.newLevel);
    case types.PET_LEVEL_CHANGED:
      return state.setIn(['gamestate', 'pets', 'levels', action.pid], action.newLevel);
    case types.PET_ACTIVE_CHANGED:
      return state.setIn(['gamestate', 'pets', 'active'], action.pid);
    case types.EQUIPMENT_BONUS_CHANGED:
      return state.setIn(['gamestate', 'equipment', action.eid, 'bonus'], action.newBonus);
    case types.EQUIPMENT_LEVEL_CHANGED:
      return state.setIn(['gamestate', 'equipment', action.eid, 'level'], action.newLevel);
    case types.EQUIPMENT_ACTIVE_CHANGED:
      // unequip all others in that category
      return state.withMutations(state => {
        state.updateIn(['gamestate', 'equipment'], equipmentMap => equipmentMap.map(
          (eMap, eKey) => eKey.slice(0, 2) == action.eid.slice(0, 2) ? eMap.update('equipped', v => false) : eMap
        ))
          .setIn(['gamestate', 'equipment', action.eid, 'equipped'], true);
      })
      return state.setIn(['gamestate', 'equipment', action.eid, 'equipped'], true);
    case types.SKILL_LEVEL_CHANGED:
      return state.setIn(['gamestate', 'skills', action.sid], action.newLevel);

    case types.STEPS_REQUESTED:
      return state.set('calculatingSteps', true);
    case types.STEPS_CHANGED:
      return state.withMutations(state => {
        state.set('calculatingSteps', false)
          .set('steps', Immutable.fromJS(action.newSteps));
      });

    case types.NEW_GAME_STATE:
      return state.withMutations(state => {
        action.newGameState.fillWithEquipmentBonuses();
        state.setIn(['gamestate', 'info'], Immutable.fromJS(action.newGameState.info))
          .setIn(['gamestate', 'swordmaster'], Immutable.fromJS(action.newGameState.swordmaster))
          .setIn(['gamestate', 'artifacts'], Immutable.fromJS(action.newGameState.artifacts))
          .setIn(['gamestate', 'heroes'], Immutable.fromJS(action.newGameState.heroes))
          .setIn(['gamestate', 'equipment'], Immutable.fromJS(action.newGameState.equipment))
          .setIn(['gamestate', 'pets'], Immutable.fromJS(action.newGameState.pets))
          .setIn(['gamestate', 'skills'], Immutable.fromJS(action.newGameState.skills))
          .setIn(['gamestate', 'clan'], Immutable.fromJS(action.newGameState.clan));
      });

    case types.TEST:
      return state.set('test', action.value);
    default:
      return state;
  }
}

export default rootReducer;