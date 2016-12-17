import { BonusType, stringToBonus, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
import { getImprovementBonus } from './HeroImprovementBonus';
var parse = require('csv-parse');

var heroCSV = require('../data/HelperInfo.csv');
var heroSkillCSV = require('../data/HelperSkillInfo.csv');

const UPGRADE_CONSTANT = 1.0 / (ServerVarsModel.helperUpgradeBase - 1.0);

export class Hero {
  constructor(id, order, type, cost) {
    this.id = id; // H18
    this.order = order; // 0
    this.type = type;
    this.cost = cost;

    var a = 1.0 - ServerVarsModel.helperInefficiency * Math.min(this.order, ServerVarsModel.helperInefficiencySlowDown);
    this.efficiency = Math.pow(a, this.order);
    this.constant1 = this.cost * ServerVarsModel.dMGScaleDown * this.efficiency;
    this.skills = {};
  }

  addSkill(level, type, magnitude) {
    this.skills[level] = {"type": type, "magnitude": magnitude};
  }

  // TODO: precompute
  getCostToLevelUp(cLevel) {
    // TODO: do this
  }

  // Without artifact bonus
  getCostToLevelFromTo(sLevel, eLevel) {
    var nLevels = eLevel - sLevel;
    return this.cost *
           Math.pow(ServerVarsModel.helperUpgradeBase, sLevel) *
           (Math.pow(ServerVarsModel.helperUpgradeBase, nLevels) - 1.0) *
           UPGRADE_CONSTANT;
  }

  // Without BonusType, BonusAll, BonusAllHelper, Weapons
  getBaseDamage(cLevel) {
    return this.constant1 * cLevel * getImprovementBonus(cLevel);
  }

  getAllBonuses(level, allBonuses = {}) {
    console.log(this.id + "(" + this.order + ")");
    for (var l in this.skills) {
      if (l <= level) {
        addBonus(allBonuses, this.skills[l].type, this.skills[l].magnitude);
      }
    }
    return allBonuses;
  }
}

export const HeroInfo = {};

parse(heroCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var hero of data) {
    HeroInfo[hero.HelperID] = new Hero(
      hero.HelperID,
      parseInt(hero.UnlockOrder),
      stringToBonus[hero.HelperType + 'HelperDamage'],
      hero.PurchaseCost1
    );
  }
  console.log("Done loading HelperInfo");
});

parse(heroSkillCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var skill of data) {
    HeroInfo[skill.Owner].addSkill(
      skill.RequiredLevel,
      stringToBonus[skill.BonusType],
      parseFloat(skill.Magnitude));
  }
  console.log("Done loading HelperSkillInfo");
});