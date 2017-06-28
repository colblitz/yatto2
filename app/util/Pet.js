import { BonusType, stringToBonus, addBonus, notPercentageBonuses } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
var parse = require('csv-parse');

var petCSV = require('../data/PetInfo.csv');

function getPassivePercentage(level) {
  return Math.min(1.0, Math.floor(level / ServerVarsModel.petPassiveLevelGap) * ServerVarsModel.petPassiveLevelGap * ServerVarsModel.petPassiveLevelIncrement);
}

export class Pet {
  constructor(id, number, baseDamage, inc1, inc2, inc3, bonusType, bonusBase, bonusInc) {
    this.id = id;
    this.number = number;
    this.baseDamage = baseDamage;
    this.inc1 = inc1;
    this.inc2 = inc2;
    this.inc3 = inc3;
    this.bonusType = bonusType;
    this.bonusBase = bonusBase;
    this.bonusInc = bonusInc;

    this.total1 = ServerVarsModel.petDamageIncLevel1 * this.inc1;
    this.total2 = (ServerVarsModel.petDamageIncLevel2 - ServerVarsModel.petDamageIncLevel1) * this.inc2;
  }

  getDamage(level) {
    if (level <= ServerVarsModel.petDamageIncLevel1) {
      return this.baseDamage + level * this.inc1;
    } else if (level <= ServerVarsModel.petDamageIncLevel2) {
      return this.baseDamage + this.total1 + (level - ServerVarsModel.petDamageIncLevel1) * this.inc2;
    } else {
      return this.baseDamage + this.total1 + this.total2 + (level - ServerVarsModel.petDamageIncLevel2) * this.inc3;
    }
  }

  getActiveBonus(level) {
    return this.bonusBase + level * this.bonusInc;
  }

  getActiveBonuses(level, allBonuses = {}) {
    addBonus(allBonuses, BonusType.PetDamage, this.getDamage(level));
    addBonus(allBonuses, this.bonusType, this.getActiveBonus(level));
    return allBonuses;
  }

  getPassiveBonuses(level, allBonuses = {}) {
    var pMultiplier = getPassivePercentage(level);

    addBonus(allBonuses, BonusType.PetDamage, this.getDamage(level) * pMultiplier);
    if (!(this.bonusType in notPercentageBonuses)) {
      addBonus(allBonuses, this.bonusType, (this.getActiveBonus(level) - 1) * pMultiplier + 1);
    } else {
      addBonus(allBonuses, this.bonusType, this.getActiveBonus(level) * pMultiplier);
    }
    return allBonuses;
  }
}

export const PetInfo = {};

export function loadPetInfo(callback) {
  parse(petCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var pet of data) {
      PetInfo[pet.PetID] = new Pet(
        pet.PetID,
        parseInt(pet.PetID.substring(3)),
        parseFloat(pet.DamageBase),
        parseFloat(pet.DamageInc1to40),
        parseFloat(pet.DamageInc41to80),
        parseFloat(pet.DamageInc80on),
        stringToBonus[pet.BonusType],
        parseFloat(pet.BonusBase),
        parseFloat(pet.BonusInc)
      );
    }
    callback(true);
  });
}