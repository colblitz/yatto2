import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { Equipment, EquipmentInfo } from './Equipment';
import { Skill, SkillInfo } from './Skill';
import { getHeroImprovementBonus } from './HeroImprovementBonus';
import { getPlayerImprovementBonus } from './PlayerImprovementBonus';
import { ServerVarsModel } from './ServerVarsModel';
import { BonusType, getBonus } from './BonusType';
/*
  "info":{
    "playerId":"ebd20042-c0c6-4abd-aafd-22099b9dc3b9",
    "supportCode":"z3wkz",
    "reportedPlayers":[
      "7qwww5",
      "v3qxn"
    ],
    "totalActiveGameTime":116726.512856383,
    "gold":7.70443469899896e+44,
    "relics":101,
    "lastEquipMaxStage":596,
    "lastSkillMaxStage":551,
    "skillPoints":16,
    "maxStage":600
  },
  "swordmaster":{ "level":1640 },
  "artifacts":{ "Artifact1":8, "Artifact5":7, ... },
  "heroes":{
    "levels":{ "H18":900, "H01":900, ... },
    "weapons":{ "H37":1, "H22":1, ... }
  },
  "equipment":{
    "Hat_Robot": { "level": 30, "equipped": false },
    "Slash_EmbersBlue": { "level": 26, "equipped": true },
    ...
  },
  "pets":{
    "equipped": "Pet13",
    "levels": { Pet1":7, "Pet2":15, ... },
  },
  "skills":{
    "PetQTE":1,
    "BossDmgQTE":1,
    "PetGoldQTE":2,
    ...
  }
*/

export class GameState {
  constructor(info, swordmaster, artifacts, heroes, equipment, pets, skills) {
    this.info = info;
    this.swordmaster = swordmaster;
    this.artifacts = artifacts;
    this.heroes = heroes;
    this.equipment = equipment;
    this.pets = pets;
    this.skills = skills;
    this.bonuses = this.getBonuses();
  }

  getBonuses() {
    var allBonuses = {};
    console.log(" --- adding artifacts");
    for (var artifact in this.artifacts) {
      ArtifactInfo[artifact].getAllBonuses(this.artifacts[artifact], allBonuses);
    }
    console.log(" --- adding heroes");
    for (var hero in this.heroes.levels) {
      HeroInfo[hero].getAllBonuses(this.heroes.levels[hero], allBonuses);
    }
    console.log(" --- adding equipment");
    for (var equip in this.equipment) {
      if (this.equipment[equip].equipped) {
        EquipmentInfo[equip].getBonus(this.equipment[equip].level, allBonuses);
      }
    }
    console.log(" --- adding pets");
    for (var pet in this.pets.levels) {
      if (pet === this.pets.equipped) {
        PetInfo[pet].getActiveBonuses(this.pets.levels[pet], allBonuses);
      } else {
        PetInfo[pet].getPassiveBonuses(this.pets.levels[pet], allBonuses);
      }
    }
    console.log(" --- adding skills");
    for (var skill in this.skills) {
      if (SkillInfo[skill].bonusType != BonusType.None) {
        SkillInfo[skill].getBonus(this.skills[skill], allBonuses);
      }
    }
    return allBonuses;
  }

  getBaseTapDamage() {
    var swordmaster = this.swordmaster.level *
                      getPlayerImprovementBonus(this.swordmaster.level) *
                      ServerVarsModel.playerDamageMult *
                      getBonus(this.bonuses, BonusType.TapDamage) *
                      getBonus(this.bonuses, BonusType.AllDamage);
    var heroDamage = this.getHeroDamage() * getBonus(this.bonuses, BonusType.TapDamageFromHelpers);
    return swordmaster + heroDamage;
  }

  getAverageCritDamage() {
    var critChance = Math.min(ServerVarsModel.maxCritChance, ServerVarsModel.playerCritChance + getBonus(this.bonuses, BonusType.CritChance));
    var critMinMult = ServerVarsModel.playerCritMinMult * getBonus(this.bonuses, BonusType.CritDamage);
    var critMaxMult = ServerVarsModel.playerCritMaxMult * getBonus(this.bonuses, BonusType.CritDamage);
    return this.getBaseTapDamage() * (1 + critChance * (critMinMult + critMaxMult) / 2);
  }

  getPetDamage() {

  }

  getHeroDamage() {

  }

  getDPS() {

  }
}

export function fromSaveFile(saveJSON) {
  var artifactLevels = {};
  for (var artifact in saveJSON.ArtifactModel.allArtifactInfo) {
    var level = saveJSON.ArtifactModel.allArtifactInfo[artifact].level.$content;
    if (level > 0) {
      artifactLevels[artifact] = level;
    }
  }

  var equipmentOwned = {};
  for (var equipment in saveJSON.EquipmentModel.allEquipment) {
    var equip = saveJSON.EquipmentModel.allEquipment[equipment];
    var eid = equip.equipmentID.$content;
    var level = equip.level.$content;
    var equipped = equip.equipped.$content;
    equipmentOwned[eid] = {
      level: level,
      equipped: equipped,
    };
  }

  var skillLevels = {};
  for (var skill in saveJSON.SkillTreeModel.idToLevelDict) {
    var level = saveJSON.SkillTreeModel.idToLevelDict[skill];
    if (level > 0) {
      skillLevels[skill] = level;
    }
  }

  return new GameState(
    // info
    {
      playerId            : saveJSON.AccountModel.playerID.$content,
      supportCode         : saveJSON.AccountModel.supportCode.$content,
      reportedPlayers     : saveJSON.PlayerModel.reportedPlayers.$content.slice(),
      totalActiveGameTime : saveJSON.GHTime.totalActiveGameTime.$content,
      gold                : saveJSON.PlayerModel.gold.$content,
      relics              : saveJSON.PlayerModel.relicsReceivedServer.$content - saveJSON.PlayerModel.relicsSpentServer.$content,
      lastEquipMaxStage   : saveJSON.EquipmentModel.lastMaxStage.$content,
      lastSkillMaxStage   : saveJSON.PlayerModel.lastSkillPointsCollectedStage.$content,
      skillPoints         : saveJSON.PlayerModel.skillPointsReceivedServer.$content,
      maxStage            : saveJSON.PrestigeModel.maxPrestigeStageCount.$content,
    },
    // swordmaster
    {
      level: saveJSON.PlayerModel.level.$content,
      // TODO: active skills?
    },
    // artifacts
    artifactLevels,
    // heroes
    {
      levels: Object.assign({}, saveJSON.HelperModel.allHelperLevels),
      weapons: Object.assign({}, saveJSON.HelperModel.allHelperWeaponLevels),
    },
    // equipment
    equipmentOwned,
    // pets
    {
      levels: Object.assign({}, saveJSON.PetModel.allPetLevels),
      equipped: saveJSON.PetModel.currentPet.$content,
    },
    // skills
    skillLevels
  );
}