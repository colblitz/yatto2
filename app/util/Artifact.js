import { BonusType, stringToBonus } from './BonusType';
import { csv }  from 'd3';

export class Artifact {
  constructor(id, name, costc, coste, maxLevel, effects) {
    this.id = id;
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

  getAD(cLevel) {
    return cLevel > 0 ? adpl * cLevel : 0;
  }
}

export const ArtifactInfo = {};

csv("./data/ArtifactInfo.csv", function(data) {
  for (var artifact of data) {
    var id = parseInt(artifact.ArtifactID.substring(8));
    ArtifactInfo[id] = new Artifact(
      id,
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
  console.log("done loading ArtifactInfo");
});