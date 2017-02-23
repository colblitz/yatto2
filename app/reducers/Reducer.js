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
      level: 0,
    },
    artifacts: {
      // Artifact4: 2
    },
    heroes: {
      levels: {},
      weapons: {},
    },
    equipment: {
      // "Hat_Ninja": { "level": 327, "equipped": false, bonus: 53.32 }, // TODO: something about bonuses - computed?
    },
    pets: {
      active: "",
      levels: {},
    },
    skills: {},
    clan: {
      score: 0,
    },
  },
  options: {
    maxstage: 2500,
    relics: 1000,
    steps: 0,
    method: 6,
    tps: 15,
    advanced: false,
    update: true,
    useAll: false,
    limittype: 0,
  },
  gamestateStats: {
    artifactDamage:        { order: 0, value: 0, label: "Artifact Damage (%)" },
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
  summarysteps: [],
  test: 0,
  auth: {
    username: "",
    password: "",
    token: "",
  },
  ui: {
    tabIndex: 4,
    update: true,
    lastUpdate: "",
  },
});

export function getGamestateFromState(state) {
  var jsState = state.toJS();
  if (!jsState.gamestate.info.maxStage) {
    jsState.gamestate.info.maxStage = state.getIn(['options', 'maxstage']);
  }
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

export function getStateString(state) {
  var jsState = state.toJS();
  return JSON.stringify({
    gamestate: jsState.gamestate,
    options: jsState.options,
    steps: jsState.steps,
    summarysteps: jsState.summarysteps,
    ui: jsState.ui
  });
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
    state.setIn(['gamestateStats', 'artifactDamage', 'value'], getBonus(gamestate.bonuses, BonusType.ArtifactDamage) * getBonus(gamestate.bonuses, BonusType.HSArtifactDamage) * 100)
      .setIn(['gamestateStats', 'baseTapDamage', 'value'], gamestate.getBaseTapDamage())
      .setIn(['gamestateStats', 'averageCritDamage', 'value'], gamestate.getAverageCritDamage())
      .setIn(['gamestateStats', 'petDamage', 'value'], gamestate.getPetDamage())
      .setIn(['gamestateStats', 'heroDamage', 'value'], gamestate.getHeroDamage())
      .setIn(['gamestateStats', 'allDamageMultiplier', 'value'], getBonus(gamestate.bonuses, BonusType.AllDamage) * 100)
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
      // var left = [];
      // for (var doc in state.get('infoDocs').toJS()) {
      //   if (!state.getIn(['infoDocs', doc])) {
      //     left.push(doc);
      //   }
      // }
      // if (left.length == 1 && action.infoName == left[0]) {
      //   return updateGamestateValues(state.setIn(['infoDocs', action.infoName], true));
      // }
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
      if (action.checked) {
        // unequip all others in that category
        return updateGamestateValues(state.withMutations(state => {
          state.updateIn(['gamestate', 'equipment'], equipmentMap => equipmentMap.map(
            (eMap, eKey) => eKey.slice(0, 2) == action.eid.slice(0, 2) ? eMap.update('equipped', v => false) : eMap
          ))
            .setIn(['gamestate', 'equipment', action.eid, 'equipped'], true);
        }));
      } else {
        return updateGamestateValues(state.setIn(['gamestate', 'equipment', action.eid, 'equipped'], false));
      }
    case types.SKILL_LEVEL_CHANGED:
      return updateGamestateValues(state.setIn(['gamestate', 'skills', action.sid], action.newLevel));

    case types.STEPS_REQUESTED:
      return state.withMutations(state => {
        state.setIn(['ui', 'calculatingSteps'], true)
          .setIn(['ui', 'stepsProgress'], 0)
          .setIn(['ui', 'stepsMessage'], '');
      });
    case types.STEPS_PROGRESSED:
      return state.setIn(['ui', 'stepsProgress'], action.progress);
    case types.STEPS_CHANGED:
      return state.withMutations(state => {
        state.setIn(['ui', 'calculatingSteps'], false)
          .setIn(['ui', 'stepsProgress'], 0)
          .set('steps', Immutable.fromJS(action.newSteps))
          .set('summarysteps', Immutable.fromJS(action.newSummarySteps));
      });
    case types.UPDATE_STEP_MESSAGE:
      return state.withMutations(state => {
        state.setIn(['ui', 'calculatingSteps'], false)
          .setIn(['ui', 'stepsProgress'], 0)
          .setIn(['ui', 'stepsMessage'], action.message);
      });
    case types.STEP_APPLIED:
      var step = state.get('steps').get(action.index).toJS();
      if (step.buy) {
        return state.update('steps', steps => steps.delete(action.index));
      }

      var artifact = step.artifact;
      var levelTo = step.levelTo;

      var totalCost = state.get('steps')
        .filter(s => s.get('artifact') == artifact && s.get('levelTo') <= levelTo)
        .reduce((total, s) => total + s.get('cost'), 0);

      var summaryIndex = state.get('summarysteps').findIndex(ss => ss.get('artifact') == artifact)

      var newSteps = state.get('steps')
        .filterNot(s => s.get('artifact') == artifact && s.get('levelTo') <= levelTo);

      return updateGamestateValues(state.withMutations(state => {
        state.updateIn(['options', 'relics'], val => Math.max(val - totalCost, 0))
          .updateIn(['summarysteps', summaryIndex, 'cost'], val => Math.max(val - totalCost, 0))
          .setIn(['gamestate', 'artifacts', artifact], levelTo)
          .set('steps', newSteps);
      }));

    case types.SUMMARY_STEP_APPLIED:
      var summarystep = state.get('summarysteps').get(action.index).toJS();
      if (summarystep.buy) {
        return state.update('summarysteps', summarysteps => summarysteps.delete(action.index));
      }

      var artifact = summarystep.artifact;
      var levelTo = summarystep.levelTo;
      var totalCost = summarystep.cost;

      var newSteps = state.get('steps')
        .filterNot(s => s.get('artifact') == artifact);

      return updateGamestateValues(state.withMutations(state => {
        state.update('summarysteps', summarysteps => summarysteps.delete(action.index))
          .updateIn(['options', 'relics'], val => Math.max(val - totalCost, 0))
          .setIn(['gamestate', 'artifacts', artifact], levelTo)
          .set('steps', newSteps);
      }));
    case types.ALL_STEPS_APPLIED:
      var totalCost = state.get('summarysteps')
        .reduce((total, s) => total + s.get('cost'), 0);
      var summaryLevels = state.get('summarysteps')
        .reduce((levels, s) => { levels[s.get('artifact')] = s.get('levelTo'); return levels; }, {});

      return updateGamestateValues(state.withMutations(state => {
        state.updateIn(['options', 'relics'], val => Math.max(val - totalCost, 0))
          .updateIn(['gamestate', 'artifacts'], artifact => artifact.map((v, k) => k in summaryLevels ? summaryLevels[k] : v))
          .set('steps', Immutable.fromJS([]))
          .set('summarysteps', Immutable.fromJS([]));
      }));

    case types.RESET_STEPS:
      return state.withMutations(state => {
        state.set('steps', Immutable.fromJS([]))
          .set('summarysteps', Immutable.fromJS([]));
      });

    case types.METHOD_CHANGED:
      return state.setIn(['options', 'method'], action.method);
    case types.AORDER_CHANGED:
      return state.setIn(['options', 'aorder'], action.aorder);
    case types.PORDER_CHANGED:
      return state.setIn(['options', 'porder'], action.porder);
    case types.OPTIONS_CHANGED:
      return state.setIn(['options', action.radio], action.value);
    case types.TOGGLE_ADVANCED:
      return state.setIn(['options', 'advanced'], action.show);
    case types.TOGGLE_UPDATE:
      localStorage.setItem('update', action.show);
      localStorage.setItem('lastUpdate', action.date);
      return state.withMutations(state => {
        state.setIn(['ui', 'update'], action.show)
          .setIn(['ui', 'lastUpdate'], action.date);
      });

    case types.OPTION_VALUE_CHANGED:
      if (JSON.stringify(action.key).includes('gamestate')) {
        return updateGamestateValues(state.setIn(action.key, action.newValue));
      } else {
        return state.setIn(action.key, action.newValue);
      }
    case types.EQUIPMENT_ADDED:
      return state.setIn(['gamestate', 'equipment', action.eid], Immutable.fromJS({level: action.level, bonus: action.bonus}));
    case types.EQUIPMENT_REMOVED:
      return state.deleteIn(['gamestate', 'equipment', action.eid]);
    case types.EQUIPMENT_SELECTED:
      return state.setIn(['equipmentSelected', action.category], action.eid);
    case types.EQUIPMENT_ADDED_BONUS:
      return state.setIn(['options', 'toAddBonus', action.category], action.bonus);

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
          .setIn(['gamestate', 'clan'], Immutable.fromJS(action.newGameState.clan))
          .setIn(['options', 'relics'], action.newGameState.info.relics)
          .setIn(['options', 'maxstage'], action.newGameState.info.maxStage);
      }));
    case types.STATE_FROM_SERVER:
      return updateGamestateValues(state.withMutations(state => {
        state.merge(action.stateToMergeIn)
          .setIn(['ui', 'calculatingSteps'], false)
          .setIn(['ui', 'stepsProgress'], 0);
      }));
    case types.UPDATE_GAMESTATE_VALUES:
      return updateGamestateValues(state);

    case types.USERNAME_CHANGED:
      return state.setIn(['auth', 'username'], action.username);
    case types.PASSWORD_CHANGED:
      return state.setIn(['auth', 'password'], action.password);
    case types.TOKEN_CHANGED:
      localStorage.setItem('token', action.token);
      localStorage.setItem('username', state.getIn(['auth', 'username']));
      return state.setIn(['auth', 'token'], action.token);
    case types.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return state.withMutations(state => {
        state.setIn(['auth', 'username'], "")
          .setIn(['auth', 'password'], "")
          .setIn(['auth', 'token'], "");
      });

    case types.TAB_CHANGED:
      return state.setIn(['ui', 'tabIndex'], action.tabIndex);

    case types.TEST:
      console.log("reducer, setting test");
      return state.set('test', action.value);
    default:
      return state;
  }
}

export default rootReducer;
