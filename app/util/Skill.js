import { BonusType, addBonus, stringToBonus } from './BonusType';
var parse = require('csv-parse');

var skillCSV = require('../data/SkillTreeInfo.csv');

export const SkillType = {
  Engaged : 0,
  Lazy    : 1,
  Active  : 2,
};

// from SkillTreeModel.cs
var SkillToBonus = {
  AutoAdvance         : BonusType.InactiveAdvance,
  BossCountQTE        : BonusType.PetBossCount,
  BossDmgQTE          : BonusType.PetBossDamage,
  BossTimer           : BonusType.BossTimer,
  ClanQTE             : BonusType.ClanQTEDamage,
  Fairy               : BonusType.DoubleFairyChance,
  GoblinQTE           : BonusType.GoblinQTE,
  GoldRateBoost       : BonusType.GoldAll,
  LessMonsters        : BonusType.MonsterCountPerStage,
  ManaMonster         : BonusType.ManaMonsterMana,
  ManaStealSkillBoost : BonusType.ManaTapRegen,
  MeleeHelperDmg      : BonusType.MeleeHelperDamage,
  MPCapacityBoost     : BonusType.ManaPoolCap,
  MPRegenBoost        : BonusType.ManaRegen,
  OfflineGold         : BonusType.InactiveGold,
  PetDmg              : BonusType.PetDamageMult,
  PetGoldQTE          : BonusType.PetQTEGold,
  PetOfflineDmg       : BonusType.PetOfflineDamage,
  RangedHelperDmg     : BonusType.RangedHelperDamage,
  SpellHelperDmg      : BonusType.SpellHelperDamage,
  SplashDmg           : BonusType.SplashDamage,
};

export class Skill {
  constructor(id, type, req, stageReq, costs, amounts) {
    this.id = id; // PetQTE
    this.type = type;
    this.req = req;
    this.stageReq = stageReq;
    this.costs = costs;
    this.amounts = amounts;
    this.bonusType = BonusType.None;
    if (this.id in SkillToBonus) {
      this.bonusType = SkillToBonus[this.id];
    }
  }

  getBonus(level, allBonuses = {}) {
    addBonus(allBonuses, this.bonusType, this.amounts[level]);
    return allBonuses;
  }

  getCostToLevel(level) {

  }
}

export const SkillInfo = {};

// Roots of skill trees
const skillTypes = {
  "PetQTE" : SkillType.Engaged,
  "OfflineGold" : SkillType.Lazy,
  "BurstSkillBoost" : SkillType.Active
}

export function loadSkillInfo(callback) {
  parse(skillCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var skill of data) {

      var costs = Object.keys(skill).filter(function(k){return /C\d+/.test(k);})
                                    .sort(function(k1, k2){return parseInt(k1.substring(1)) - parseInt(k2.substring(1));})
                                    .map(function(k){return parseInt(skill[k])});
      var amounts = Object.keys(skill).filter(function(k){return /A\d+/.test(k);})
                                      .sort(function(k1, k2){return parseInt(k1.substring(1)) - parseInt(k2.substring(1));})
                                      .map(function(k){return parseFloat(skill[k])});
      var skillType;
      if (skill.Attributes in skillTypes) {
        skillType = skillTypes[skill.Attributes];
      } else {
        skillType = skillTypes[skill.Req];
        skillTypes[skill.Attributes] = skillType;
      }
      SkillInfo[skill.Attributes] = new Skill(
        skill.Attributes,
        skillType,
        skill.Req,
        skill.StageReq,
        costs,
        amounts
      );
    }
    callback(true);
    console.log("Done loading SkillInfo");
  });
}