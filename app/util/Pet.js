import { BonusType, stringToBonus, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
// import { csv }  from 'd3';

function getPassivePercentage(level) {
  return Math.min(1.0, Math.floor(level / ServerVarsModel.petPassiveLevelGap) * ServerVarsModel.petPassiveLevelGap * ServerVarsModel.petPassiveLevelIncrement);
}

export class Pet {
  constructor(id, pid, baseDamage, inc1, inc2, inc3, bonusType, bonusBase, bonusInc) {
    this.id = id;
    this.pid = pid;
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

  getActiveBonuses(level) {
    var allBonuses = {};
    addBonus(allBonuses, BonusType.PetDamage, getDamage(level));
    addBonus(allBonuses, this.bonusType, this.bonusBase + level * this.bonusInc);
    return allBonuses;
  }

  getPassiveBonuses(level) {
    var pMultiplier = getPassivePercentage(level);
    var allBonuses = {};
    addBonus(allBonuses, BonusType.PetDamage, getDamage(level) * pMultiplier);
    addBonus(allBonuses, this.bonusType, (this.bonusBase + level * this.bonusInc) * pMultiplier);
    return allBonuses;
  }
}

export const PetInfo = {};

// csv("./data/PetInfo.csv", function(data) {
//   for (var pet of data) {
//     var id = parseInt(pet.PetID.substring(3));
//     PetInfo[id] = new Pet(
//       id,
//       pet.PetID,
//       pet.DamageBase,
//       pet.DamageInc1to40,
//       pet.DamageInc41to80,
//       pet.DamageInc80on,
//       stringToBonus[pet.BonusType],
//       pet.BonusBase,
//       pet.BonusInc
//     );
//   }
//   console.log("done loading PetInfo");
// });
