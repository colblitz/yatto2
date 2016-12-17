import { BonusType, stringToBonus, addBonus, additiveBonuses } from './BonusType';
var parse = require('csv-parse');

var artifactCSV = require('../data/ArtifactInfo.csv');

export class Artifact {
  constructor(id, number, name, costc, coste, maxLevel, effects) {
    this.id = id; // Artifact1
    this.number = number; // 1
    this.name = name;
    this.costc = costc;
    this.coste = coste;
    this.maxLevel = maxLevel == 0 ? null : maxLevel;
    this.effects = effects;
    this.adpl = this.effects[BonusType.ArtifactDamage];
  }

  // TODO: precompute
  getCostToLevelUp(cLevel) {
    if (cLevel == 0 || (this.maxLevel != null && cLevel >= this.maxLevel)) {
      return Infinity;
    } else {
      return Math.round(costc * Math.pow(cLevel + 1, coste));
    }
  }

  getAllBonuses(level, allBonuses = {}) {
    console.log(this.name);
    // TODO: remove this hack for bugged Heavenly Sword
    if (this.id === "Artifact26") {
      addBonus(allBonuses, BonusType.ArtifactDamage, level * 0.3);
      addBonus(allBonuses, BonusType.ArtifactDamage, 1 + level * 0.05);
      return allBonuses;
    } else {
      for (var bonusType in this.effects) {
        if (!(bonusType in additiveBonuses)) {
          addBonus(allBonuses, bonusType, 1 + level * this.effects[bonusType]);
        } else {
          addBonus(allBonuses, bonusType, level * this.effects[bonusType]);
        }
      }
    }
    return allBonuses;
  }
}

export const ArtifactInfo = {};

parse(artifactCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var artifact of data) {
    ArtifactInfo[artifact.ArtifactID] = new Artifact(
      artifact.ArtifactID,
      parseInt(artifact.ArtifactID.substring(8)),
      artifact.Name,
      parseFloat(artifact.CostCoef),
      parseFloat(artifact.CostExpo),
      parseInt(artifact.MaxLevel),
      {
        [BonusType.ArtifactDamage] : parseFloat(artifact.DamageBonus),
        [stringToBonus[artifact.BonusType]]: parseFloat(artifact.EffectPerLevel),
      }
    );
  }
  console.log("Done loading ArtifactInfo");
});