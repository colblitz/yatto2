import { BonusType, stringToBonus, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
import { getHeroImprovementBonus } from './HeroImprovementBonus';

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

    this.formulaOrder = Math.min(this.order, ServerVarsModel.maxHelperFormulaInt);
    var a = 1.0 - ServerVarsModel.helperInefficiency * Math.min(this.formulaOrder, ServerVarsModel.helperInefficiencySlowDown);
    this.efficiency = Math.pow(a, this.formulaOrder);

    this.constant1 = this.cost * ServerVarsModel.dMGScaleDown * this.efficiency;
    this.skills = {};
  }

  addSkill(level, type, magnitude) {
    this.skills[level] = {"type": type, "magnitude": magnitude};
  }

  getTypeString() {
    switch (this.type) {
      case BonusType.MeleeHelperDamage:
        return "melee";
      case BonusType.RangedHelperDamage:
        return "ranged";
      case BonusType.SpellHelperDamage:
        return "spell";
      default:
        return "none";
    }
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
    return this.constant1 * cLevel * getHeroImprovementBonus(cLevel);
  }

  getAllBonuses(level, allBonuses = {}) {
    for (var l in this.skills) {
      if (l <= level) {
        addBonus(allBonuses, this.skills[l].type, this.skills[l].magnitude);
      }
    }
    return allBonuses;
  }
}

export function printHeroLevels(levels) {
  var l = [];
  for (var hero of Object.keys(levels).sort(function(a, b) { return HeroInfo[a].order - HeroInfo[b].order; })) {
    l.push(levels[hero]);
  }
  console.log(l);
}

export const HeroInfo = {};

export function loadHeroInfo(callback) {
  parse(heroCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var hero of data) {
      HeroInfo[hero.HelperID] = new Hero(
        hero.HelperID,
        parseInt(hero.UnlockOrder),
        stringToBonus[hero.HelperType + 'HelperDamage'],
        hero.PurchaseCost1
      );
    }
    callback(true);
  });
}

export function loadHeroSkillInfo(callback) {
  parse(heroSkillCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var skill of data) {
      HeroInfo[skill.Owner].addSkill(
        skill.RequiredLevel,
        stringToBonus[skill.BonusType],
        parseFloat(skill.Magnitude));
    }
    callback(true);
  });
}