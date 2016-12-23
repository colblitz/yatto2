import * as types from './types';

export const loadedCSV = (infoName) => {
  return {
    type: types.LOADED_CSV,
    infoName
  }
}

export const artifactChanged = (aid, newLevel) => {
  return {
    type: types.ARTIFACT_CHANGED,
    aid,
    newLevel
  }
}