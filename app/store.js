import { createStore, applyMiddleware } from 'redux';
import rootReducer, { defaultState } from './reducers/Reducer';
import { GameState } from './util/GameState';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const stateTransformer = (state) => { return state.toJS(); };

const loggerMiddleware = createLogger({
  stateTransformer,
  diff: true
});

// const store = createStore(rootReducer, defaultState);
const store = createStore(rootReducer, defaultState, applyMiddleware(thunkMiddleware, loggerMiddleware));

export default store;