import { createStore } from 'redux';
import rootReducer, { defaultState } from './reducers/Reducer';
import { GameState } from './util/GameState';

const store = createStore(rootReducer, defaultState);

let unsubscribe = store.subscribe(() =>
  console.log(store.getState().toJS())
)

export function getGameState() {
  var jsStore = store.getState().toJS();
  return new GameState(
    jsStore.gamestate.info,
    jsStore.gamestate.swordmaster,
    jsStore.gamestate.artifacts,
    jsStore.gamestate.heroes,
    jsStore.gamestate.equipment,
    jsStore.gamestate.pets,
    jsStore.gamestate.skills,
    jsStore.gamestate.clan
  );
}

export function getInStore(path, defaultV) {
  return store.getState().getIn(path, defaultV);
}

export default store;