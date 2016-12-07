import { BonusType, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';

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

export const PetInfo = {
   1: new Pet(  1, Pet1 , 300, 170, 140,  30, BonusType.AllDamage          , 1.00, 0.100),
   2: new Pet(  2, Pet2 , 700, 160, 120,  25, BonusType.AllHelperDamage    , 1.00, 0.150),
   3: new Pet(  3, Pet3 , 300, 200, 100,  40, BonusType.MeleeHelperDamage  , 1.00, 0.200),
   4: new Pet(  4, Pet4 , 800, 150, 130,  55, BonusType.RangedHelperDamage , 1.00, 0.200),
   5: new Pet(  5, Pet5 , 300, 220,  80,  60, BonusType.SpellHelperDamage  , 1.00, 0.200),
   6: new Pet(  6, Pet6 , 300, 180,  90,  50, BonusType.GoldAll            , 1.00, 0.100),
   7: new Pet(  7, Pet7 , 600, 150, 140,  75, BonusType.AllDamage          , 1.00, 0.100),
   8: new Pet(  8, Pet8 , 100, 200,  80,  50, BonusType.AllHelperDamage    , 1.00, 0.150),
   9: new Pet(  9, Pet9 , 600, 150, 140,  60, BonusType.MeleeHelperDamage  , 1.00, 0.200),
  10: new Pet( 10, Pet10, 300, 220,  40,  73, BonusType.RangedHelperDamage , 1.00, 0.200),
  11: new Pet( 11, Pet11, 500, 180, 120,  45, BonusType.SpellHelperDamage  , 1.00, 0.200),
  12: new Pet( 12, Pet12, 500, 195,  70,  60, BonusType.GoldAll            , 1.00, 0.100),
  13: new Pet( 13, Pet13, 100, 220,  80,  40, BonusType.TapDamage          , 1.00, 1.000),
  14: new Pet( 14, Pet14, 400, 160, 120,  73, BonusType.TapDamage          , 1.00, 1.000),
  15: new Pet( 15, Pet15, 400, 180, 160,  35, BonusType.ManaRegen          , 0.00, 0.050),
  16: new Pet( 16, Pet16, 200, 200,  60,  70, BonusType.SplashDamage       , 0.01, 0.002),
};
