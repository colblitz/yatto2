import { BonusType, stringToBonus, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
import { getImprovementBonus } from './HeroImprovementBonus';
var parse = require('csv-parse');

var heroCSV = require('../data/HelperInfo.csv');
var heroSkillCSV = require('../data/HelperSkillInfo.csv');

const UPGRADE_CONSTANT = 1.0 / (ServerVarsModel.helperUpgradeBase - 1.0);

export class Hero {
  constructor(id, heroId, type, cost) {
    this.id = id; // unlock order
    this.heroId = heroId;
    this.type = type;
    this.cost = cost;

    var a = 1.0 - ServerVarsModel.helperInefficiency * Math.min(this.id, ServerVarsModel.helperInefficiencySlowDown);
    this.efficiency = Math.pow(a, this.id);
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

  getAllBonuses(level) {
    var allBonuses = {};
    this.addBonuses(allBonuses, level);
    return allBonuses;
  }

  addBonuses(allBonuses, level) {
    Object.keys(this.skills).forEach(function(key, index) {
      if (key <= level) {
        var bonus = this.skills[key];
        addBonus(allBonuses, bonus.type, bonus.magnitude);
      }
    });
  }
}

export const HeroInfo = {};

var heroIdToId = {};
parse(heroCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var hero of data) {
    var id = parseInt(hero.UnlockOrder);
    heroIdToId[hero.HelperID] = id;
    HeroInfo[id] = new Hero(
      id,
      hero.HelperID,
      stringToBonus[hero.HelperType + 'HelperDamage'],
      hero.PurchaseCost1
    );
  }
  console.log("Done loading HelperInfo");
});

parse(heroSkillCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var skill of data) {
    HeroInfo[heroIdToId[skill.Owner]].addSkill(
      skill.RequiredLevel,
      stringToBonus[skill.BonusType],
      skill.Magnitude);
  }
  console.log("Done loading HelperSkillInfo");
});