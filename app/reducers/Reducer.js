import { combineReducers } from 'redux';
import * as types from '../actions/types';
import { GameState } from '../util/GameState';
import { BonusType, getBonus } from '../util/BonusType';
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
    swordmaster: {
      level: 1,
    },
    artifacts: {
      Artifact4: 2
    },
    heroes: {
      levels: {},
      weapons: {},
    },
    equipment: {},
    pets: {
      active: "",
      levels: {},
    },
    skills: {},
    clan: {
      score: 1,
    },
  },
  options: {

  },
  gamestateStats: {
    artifactDamage:        { order: 0, value: 0, label: "Artifact Damage" },
    baseTapDamage:         { order: 1, value: 0, label: "Tap Damage" },
    averageCritDamage:     { order: 2, value: 0, label: "Average Tap Damage with Crits" },
    petDamage:             { order: 3, value: 0, label: "Pet Damage" },
    heroDamage:            { order: 4, value: 0, label: "Hero Damage" },
    allDamageMultiplier:   { order: 5, value: 0, label: "All Damage Multiplier" },
    heroDamageMultiplier:  { order: 6, value: 0, label: "Hero Damage Multiplier" },
    meleeDamageMultiplier: { order: 7, value: 0, label: "Melee Damage Multiplier" },
    rangeDamageMultiplier: { order: 8, value: 0, label: "Range Damage Multiplier" },
    magicDamageMultiplier: { order: 9, value: 0, label: "Spell Damage Multiplier" },
    goldMultiplier:        { order: 10, value: 0, label: "Gold Multiplier" },
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
  gamestate.calculateBonuses();

  return state.withMutations(state => {
    state.setIn(['gamestateStats', 'artifactDamage', 'value'], getBonus(gamestate.bonuses, BonusType.ArtifactDamage))
      .setIn(['gamestateStats', 'baseTapDamage', 'value'], gamestate.getBaseTapDamage())
      .setIn(['gamestateStats', 'averageCritDamage', 'value'], gamestate.getAverageCritDamage())
      .setIn(['gamestateStats', 'petDamage', 'value'], gamestate.getPetDamage())
      .setIn(['gamestateStats', 'heroDamage', 'value'], gamestate.getHeroDamage())
      .setIn(['gamestateStats', 'allDamageMultiplier', 'value'], (getBonus(gamestate.bonuses, BonusType.AllDamage) - 1) * 100)
      .setIn(['gamestateStats', 'heroDamageMultiplier', 'value'], (getBonus(gamestate.bonuses, BonusType.AllHelperDamage) - 1) * 100)
      .setIn(['gamestateStats', 'meleeDamageMultiplier', 'value'], (getBonus(gamestate.bonuses, BonusType.MeleeHelperDamage) - 1) * 100)
      .setIn(['gamestateStats', 'rangeDamageMultiplier', 'value'], (getBonus(gamestate.bonuses, BonusType.RangedHelperDamage) - 1) * 100)
      .setIn(['gamestateStats', 'magicDamageMultiplier', 'value'], (getBonus(gamestate.bonuses, BonusType.SpellHelperDamage) - 1) * 100)
      .setIn(['gamestateStats', 'goldMultiplier', 'value'], getBonus(gamestate.bonuses, BonusType.GoldAll));
  });
}

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case types.LOADED_CSV:
      var left = [];
      for (var doc in state.get('infoDocs').toJS()) {
        if (!state.getIn(['infoDocs', doc])) {
          left.push(doc);
        }
      }
      if (left.length == 1 && action.infoName == left[0]) {
        return updateGamestateValues(state.setIn(['infoDocs', action.infoName], true));
      }
      return state.setIn(['infoDocs', action.infoName], true);

    case types.SWORDMASTER_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'swordmaster', 'level'], action.newLevel));
    case types.HERO_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'heroes', 'levels', action.hid], action.newLevel));
    case types.HERO_WEAPON_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'heroes', 'weapons', action.hid], action.newLevel));
    case types.ARTIFACT_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'artifacts', action.aid], action.newLevel));
    case types.PET_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'pets', 'levels', action.pid], action.newLevel));
    case types.PET_ACTIVE_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'pets', 'active'], action.pid));
    case types.EQUIPMENT_BONUS_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'equipment', action.eid, 'bonus'], action.newBonus));
    case types.EQUIPMENT_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'equipment', action.eid, 'level'], action.newLevel));
    case types.EQUIPMENT_ACTIVE_CHANGED:
      // unequip all others in that category
      return updateGamestateValues(state.withMutations(state => {
        state.updateIn(['gamestate', 'equipment'], equipmentMap => equipmentMap.map(
          (eMap, eKey) => eKey.slice(0, 2) == action.eid.slice(0, 2) ? eMap.update('equipped', v => false) : eMap
        ))
          .setIn(['gamestate', 'equipment', action.eid, 'equipped'], true);
      }));
      // return state.setIn(['gamestate', 'equipment', action.eid, 'equipped'], true);
    case types.SKILL_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'skills', action.sid], action.newLevel));

    case types.STEPS_REQUESTED:
      return state.set('calculatingSteps', true);
    case types.STEPS_CHANGED:
      return state.withMutations(state => {
        state.set('calculatingSteps', false)
          .set('steps', Immutable.fromJS(action.newSteps));
      });

    case types.OPTION_VALUE_CHANGED:
      if (JSON.stringify(action.key).includes('gamestate')) {
        return updateGamestateValues(state.setIn(action.key, action.newValue));
      } else {
        return state.setIn(action.key, action.newValue);
      }

    case types.NEW_GAME_STATE:
      return updateGamestateValues(state.withMutations(state => {
        action.newGameState.fillWithEquipmentBonuses();
        state.setIn(['gamestate', 'info'], Immutable.fromJS(action.newGameState.info))
          .setIn(['gamestate', 'swordmaster'], Immutable.fromJS(action.newGameState.swordmaster))
          .setIn(['gamestate', 'artifacts'], Immutable.fromJS(action.newGameState.artifacts))
          .setIn(['gamestate', 'heroes'], Immutable.fromJS(action.newGameState.heroes))
          .setIn(['gamestate', 'equipment'], Immutable.fromJS(action.newGameState.equipment))
          .setIn(['gamestate', 'pets'], Immutable.fromJS(action.newGameState.pets))
          .setIn(['gamestate', 'skills'], Immutable.fromJS(action.newGameState.skills))
          .setIn(['gamestate', 'clan'], Immutable.fromJS(action.newGameState.clan));
      }));

    case types.TEST:
      return state.set('test', action.value);
    default:
      return state;
  }
}

export default rootReducer;