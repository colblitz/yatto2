import { combineReducers } from 'redux';
import * as types from '../actions/types';
var Immutable = require('immutable');

export const defaultState = Immutable.fromJS({
  infoDocs: {
    "ArtifactInfo": false,
    "HelperImprovementsInfo": false,
    "HeroImprovementsTotals": false,
    "HelperInfo": false,
    "HelperSkillInfo": false,
    "PetInfo": false,
    "EquipmentInfo": false,
    "SkillInfo": false,
    "PlayerImprovementsInfo": false,
    "PlayerImprovementsTotals": false,
    "LocalizationInfo": false,
  },
  gamestate: {
    info: {},
    swordmaster: {},
    artifacts: {},
    heroes: {},
    equipment: {},
    pets: {},
    skills: {},
    clan: {},
  }
});

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.LOADED_CSV:
      return state.setIn(['infoDocs', action.infoName], true);
    case types.ARTIFACT_CHANGED:
      return state.setIn(['gamestate', 'artifacts', 'levels', action.aid], action.newLevel);
    default:
      return state;
  }
}

export default rootReducer;