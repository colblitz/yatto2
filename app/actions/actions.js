import * as types from './types';

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

export const stepsChanged = (newSteps) => {
  return {
    type: types.STEPS_CHANGED,
    newSteps
  }
}

export const newGameState = (newGameState) => {
  return {
    type: types.NEW_GAME_STATE,
    newGameState
  }
}

export const test = (value) => {
  return {
    type: types.TEST,
    value
  }
}