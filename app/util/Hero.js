import { BonusType, addBonus } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
import { getImprovementBonus } from './HeroImprovementBonus';

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

export const HeroInfo = {
// copy from CSVs
   0: new Hero(  0, "H18", BonusType.SpellHelperDamage  , 3.0000e+01 ),
   1: new Hero(  1, "H01", BonusType.MeleeHelperDamage  , 1.8000e+02 ),
   2: new Hero(  2, "H21", BonusType.MeleeHelperDamage  , 8.0000e+02 ),
   3: new Hero(  3, "H02", BonusType.MeleeHelperDamage  , 4.0000e+03 ),
   4: new Hero(  4, "H06", BonusType.RangedHelperDamage , 2.8000e+04 ),
   5: new Hero(  5, "H24", BonusType.RangedHelperDamage , 2.2400e+05 ),
   6: new Hero(  6, "H08", BonusType.MeleeHelperDamage  , 2.6880e+06 ),
   7: new Hero(  7, "H26", BonusType.RangedHelperDamage , 2.1504e+07 ),
   8: new Hero(  8, "H09", BonusType.MeleeHelperDamage  , 2.3654e+08 ),
   9: new Hero(  9, "H04", BonusType.SpellHelperDamage  , 1.8924e+09 ),
  10: new Hero( 10, "H20", BonusType.MeleeHelperDamage  , 9.4618e+09 ),
  11: new Hero( 11, "H10", BonusType.SpellHelperDamage  , 8.5156e+10 ),
  12: new Hero( 12, "H03", BonusType.RangedHelperDamage , 8.5156e+11 ),
  13: new Hero( 13, "H25", BonusType.SpellHelperDamage  , 1.5328e+13 ),
  14: new Hero( 14, "H27", BonusType.RangedHelperDamage , 1.8394e+14 ),
  15: new Hero( 15, "H22", BonusType.SpellHelperDamage  , 3.6787e+15 ),
  16: new Hero( 16, "H05", BonusType.RangedHelperDamage , 3.3109e+16 ),
  17: new Hero( 17, "H13", BonusType.SpellHelperDamage  , 1.1919e+18 ),
  18: new Hero( 18, "H19", BonusType.MeleeHelperDamage  , 6.5555e+19 ),
  19: new Hero( 19, "H29", BonusType.SpellHelperDamage  , 1.3111e+21 ),
  20: new Hero( 20, "H12", BonusType.MeleeHelperDamage  , 1.9667e+22 ),
  21: new Hero( 21, "H23", BonusType.RangedHelperDamage , 1.7700e+24 ),
  22: new Hero( 22, "H30", BonusType.SpellHelperDamage  , 3.5400e+26 ),
  23: new Hero( 23, "H11", BonusType.RangedHelperDamage , 1.4160e+29 ),
  24: new Hero( 24, "H07", BonusType.MeleeHelperDamage  , 1.5576e+32 ),
  25: new Hero( 25, "H32", BonusType.SpellHelperDamage  , 6.8534e+36 ),
  26: new Hero( 26, "H31", BonusType.SpellHelperDamage  , 2.4124e+43 ),
  27: new Hero( 27, "H34", BonusType.MeleeHelperDamage  , 6.7933e+51 ),
  28: new Hero( 28, "H15", BonusType.RangedHelperDamage , 1.5304e+62 ),
  29: new Hero( 29, "H17", BonusType.SpellHelperDamage  , 2.7581e+74 ),
  30: new Hero( 30, "H28", BonusType.RangedHelperDamage , 3.9767e+88 ),
  31: new Hero( 31, "H37", BonusType.SpellHelperDamage  , 4.5868e+104),
  32: new Hero( 32, "H35", BonusType.MeleeHelperDamage  , 2.6453e+122),
  33: new Hero( 33, "H16", BonusType.RangedHelperDamage , 7.6279e+141),
  34: new Hero( 34, "H33", BonusType.RangedHelperDamage , 1.0998e+163),
  35: new Hero( 35, "H14", BonusType.MeleeHelperDamage  , 7.9283e+185),
  36: new Hero( 36, "H36", BonusType.SpellHelperDamage  , 2.8577e+210),
};

HeroInfo[ 0].addSkill(   20, BonusType.CritDamage           , 1.100);
HeroInfo[ 0].addSkill(   40, BonusType.CritChance           , 0.001);
HeroInfo[ 0].addSkill(   60, BonusType.ChestAmount          , 1.100);
HeroInfo[ 0].addSkill(  100, BonusType.ChestChance          , 0.001);
HeroInfo[ 0].addSkill(  200, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 0].addSkill(  500, BonusType.TapDamage            , 1.100);
HeroInfo[ 0].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 0].addSkill( 2000, BonusType.GoldBoss             , 1.100);
HeroInfo[ 0].addSkill( 3000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 0].addSkill( 4000, BonusType.GoldAll              , 1.100);
HeroInfo[ 1].addSkill(   20, BonusType.ChestAmount          , 1.100);
HeroInfo[ 1].addSkill(   40, BonusType.ChestChance          , 0.001);
HeroInfo[ 1].addSkill(   60, BonusType.CritDamage           , 1.100);
HeroInfo[ 1].addSkill(  100, BonusType.CritChance           , 0.001);
HeroInfo[ 1].addSkill(  200, BonusType.GoldMonster          , 1.100);
HeroInfo[ 1].addSkill(  500, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 1].addSkill( 1000, BonusType.GoldAll              , 1.100);
HeroInfo[ 1].addSkill( 2000, BonusType.AllDamage            , 1.100);
HeroInfo[ 1].addSkill( 3000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 1].addSkill( 4000, BonusType.GoldAll              , 1.100);
HeroInfo[ 2].addSkill(   20, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill(   40, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill(   60, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill(  100, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill(  200, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill(  500, BonusType.TapDamage            , 1.100);
HeroInfo[ 2].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 2].addSkill( 2000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 2].addSkill( 3000, BonusType.GoldAll              , 1.100);
HeroInfo[ 2].addSkill( 4000, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(   20, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(   40, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(   60, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(  100, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(  200, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill(  500, BonusType.GoldBoss             , 1.100);
HeroInfo[ 3].addSkill( 1000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 3].addSkill( 2000, BonusType.ChestAmount          , 1.100);
HeroInfo[ 3].addSkill( 3000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 3].addSkill( 4000, BonusType.GoldBoss             , 1.100);
HeroInfo[ 4].addSkill(   20, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill(   40, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill(   60, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill(  100, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill(  200, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill(  500, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill( 1000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 4].addSkill( 2000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 4].addSkill( 4000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 5].addSkill(   20, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill(   40, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill(   60, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill(  100, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill(  200, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill(  500, BonusType.GoldMonster          , 1.100);
HeroInfo[ 5].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 5].addSkill( 2000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 5].addSkill( 3000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 5].addSkill( 4000, BonusType.GoldMonster          , 1.100);
HeroInfo[ 6].addSkill(   20, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill(   40, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill(   60, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill(  100, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill(  200, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill(  500, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 6].addSkill( 2000, BonusType.ChestAmount          , 1.100);
HeroInfo[ 6].addSkill( 3000, BonusType.AllDamage            , 1.100);
HeroInfo[ 6].addSkill( 4000, BonusType.ChestAmount          , 1.100);
HeroInfo[ 7].addSkill(   20, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill(   40, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill(   60, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill(  100, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill(  200, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill(  500, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 7].addSkill( 1000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 7].addSkill( 2000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 7].addSkill( 3000, BonusType.AllDamage            , 1.100);
HeroInfo[ 7].addSkill( 4000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[ 8].addSkill(   20, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill(   40, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill(   60, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill(  100, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill(  200, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill(  500, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[ 8].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 8].addSkill( 2000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 8].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[ 8].addSkill( 4000, BonusType.GoldAll              , 1.100);
HeroInfo[ 9].addSkill(   20, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[ 9].addSkill(   40, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 9].addSkill(   60, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 9].addSkill(  100, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 9].addSkill(  200, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 9].addSkill(  500, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[ 9].addSkill( 1000, BonusType.GoldAll              , 1.100);
HeroInfo[ 9].addSkill( 2000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[ 9].addSkill( 3000, BonusType.CritDamage           , 1.100);
HeroInfo[ 9].addSkill( 4000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[10].addSkill(   20, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill(   40, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill(   60, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill(  100, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill(  200, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill(  500, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[10].addSkill( 2000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[10].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[10].addSkill( 4000, BonusType.AllDamage            , 1.100);
HeroInfo[11].addSkill(   20, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill(   40, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill(   60, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill(  100, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill(  200, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill(  500, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[11].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[11].addSkill( 2000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[11].addSkill( 3000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[11].addSkill( 4000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[12].addSkill(   20, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill(   40, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill(   60, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill(  100, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill(  200, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill(  500, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[12].addSkill( 1000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[12].addSkill( 2000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[12].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[12].addSkill( 4000, BonusType.GoldAll              , 1.100);
HeroInfo[13].addSkill(   20, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill(   40, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill(   60, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill(  100, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill(  200, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill(  500, BonusType.AllHelperDamage      , 1.100);
HeroInfo[13].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[13].addSkill( 2000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[13].addSkill( 3000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[13].addSkill( 4000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[14].addSkill(   20, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill(   40, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill(   60, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill(  100, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill(  200, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill(  500, BonusType.TapDamage            , 1.100);
HeroInfo[14].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[14].addSkill( 2000, BonusType.GoldAll              , 1.100);
HeroInfo[14].addSkill( 3000, BonusType.AllHelperDamage      , 1.100);
HeroInfo[14].addSkill( 4000, BonusType.TapDamage            , 1.100);
HeroInfo[15].addSkill(   20, BonusType.CritDamage           , 1.100);
HeroInfo[15].addSkill(   40, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill(   60, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill(  100, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill(  200, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill(  500, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill( 1000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[15].addSkill( 2000, BonusType.ChestAmount          , 1.100);
HeroInfo[15].addSkill( 3000, BonusType.ManaRegen            , 0.100);
HeroInfo[15].addSkill( 4000, BonusType.GoldMonster          , 1.100);
HeroInfo[16].addSkill(   20, BonusType.TapDamage            , 1.100);
HeroInfo[16].addSkill(   40, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[16].addSkill(   60, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[16].addSkill(  100, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[16].addSkill(  200, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[16].addSkill(  500, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[16].addSkill( 1000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[16].addSkill( 2000, BonusType.AllDamage            , 1.100);
HeroInfo[16].addSkill( 3000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[16].addSkill( 4000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[17].addSkill(   20, BonusType.TapDamage            , 1.100);
HeroInfo[17].addSkill(   40, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[17].addSkill(   60, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[17].addSkill(  100, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[17].addSkill(  200, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[17].addSkill(  500, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[17].addSkill( 1000, BonusType.GoldAll              , 1.100);
HeroInfo[17].addSkill( 2000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[17].addSkill( 3000, BonusType.CritChance           , 0.001);
HeroInfo[17].addSkill( 4000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[18].addSkill(   20, BonusType.TapDamage            , 1.100);
HeroInfo[18].addSkill(   40, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[18].addSkill(   60, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[18].addSkill(  100, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[18].addSkill(  200, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[18].addSkill(  500, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[18].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[18].addSkill( 2000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[18].addSkill( 3000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[18].addSkill( 4000, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(   20, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(   40, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(   60, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(  100, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(  200, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill(  500, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill( 1000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[19].addSkill( 2000, BonusType.GoldMonster          , 1.100);
HeroInfo[19].addSkill( 3000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[19].addSkill( 4000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[20].addSkill(   20, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill(   40, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill(   60, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill(  100, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill(  200, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill(  500, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill( 1000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[20].addSkill( 2000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[20].addSkill( 3000, BonusType.TapDamage            , 1.100);
HeroInfo[20].addSkill( 4000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[21].addSkill(   20, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill(   40, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill(   60, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill(  100, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill(  200, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill(  500, BonusType.CritChance           , 0.001);
HeroInfo[21].addSkill( 1000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[21].addSkill( 2000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[21].addSkill( 3000, BonusType.CritDamage           , 1.100);
HeroInfo[21].addSkill( 4000, BonusType.AllDamage            , 1.100);
HeroInfo[22].addSkill(   20, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill(   40, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill(   60, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill(  100, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill(  200, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill(  500, BonusType.ChestChance          , 0.001);
HeroInfo[22].addSkill( 1000, BonusType.GoldAll              , 1.100);
HeroInfo[22].addSkill( 2000, BonusType.AllDamage            , 1.100);
HeroInfo[22].addSkill( 3000, BonusType.GoldBoss             , 1.100);
HeroInfo[22].addSkill( 4000, BonusType.ChestChance          , 0.001);
HeroInfo[23].addSkill(   20, BonusType.GoldBoss             , 1.100);
HeroInfo[23].addSkill(   40, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[23].addSkill(   60, BonusType.GoldBoss             , 1.100);
HeroInfo[23].addSkill(  100, BonusType.GoldBoss             , 1.100);
HeroInfo[23].addSkill(  200, BonusType.GoldBoss             , 1.100);
HeroInfo[23].addSkill(  500, BonusType.GoldBoss             , 1.100);
HeroInfo[23].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[23].addSkill( 2000, BonusType.GoldAll              , 1.100);
HeroInfo[23].addSkill( 3000, BonusType.AllDamage            , 1.100);
HeroInfo[23].addSkill( 4000, BonusType.GoldBoss             , 1.100);
HeroInfo[24].addSkill(   20, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill(   40, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill(   60, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill(  100, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill(  200, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill(  500, BonusType.GoldAll              , 1.100);
HeroInfo[24].addSkill( 1000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[24].addSkill( 2000, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[24].addSkill( 3000, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[24].addSkill( 4000, BonusType.GoldAll              , 1.100);
HeroInfo[25].addSkill(   20, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill(   40, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill(   60, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill(  100, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill(  200, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill(  500, BonusType.CritDamage           , 1.100);
HeroInfo[25].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[25].addSkill( 2000, BonusType.GoldAll              , 1.100);
HeroInfo[25].addSkill( 3000, BonusType.AllDamage            , 1.100);
HeroInfo[25].addSkill( 4000, BonusType.CritDamage           , 1.100);
HeroInfo[26].addSkill(   20, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill(   40, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill(   60, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill(  100, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill(  200, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill(  500, BonusType.AllDamage            , 1.100);
HeroInfo[26].addSkill( 1000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[26].addSkill( 2000, BonusType.GoldAll              , 1.100);
HeroInfo[26].addSkill( 3000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[26].addSkill( 4000, BonusType.AllDamage            , 1.100);
HeroInfo[27].addSkill(   20, BonusType.GoldBoss             , 1.100);
HeroInfo[27].addSkill(   40, BonusType.GoldMonster          , 1.100);
HeroInfo[27].addSkill(   60, BonusType.Goldx10Chance        , 0.001);
HeroInfo[27].addSkill(  100, BonusType.GoldAll              , 1.100);
HeroInfo[27].addSkill(  200, BonusType.GoldBoss             , 1.100);
HeroInfo[27].addSkill(  500, BonusType.GoldMonster          , 1.100);
HeroInfo[27].addSkill( 1000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[27].addSkill( 2000, BonusType.GoldAll              , 1.100);
HeroInfo[27].addSkill( 3000, BonusType.GoldMonster          , 1.100);
HeroInfo[27].addSkill( 4000, BonusType.GoldBoss             , 1.100);
HeroInfo[28].addSkill(   20, BonusType.ChestAmount          , 1.100);
HeroInfo[28].addSkill(   40, BonusType.ChestChance          , 0.001);
HeroInfo[28].addSkill(   60, BonusType.ChestAmount          , 1.100);
HeroInfo[28].addSkill(  100, BonusType.ChestChance          , 0.001);
HeroInfo[28].addSkill(  200, BonusType.ChestAmount          , 1.100);
HeroInfo[28].addSkill(  500, BonusType.ChestChance          , 0.001);
HeroInfo[28].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[28].addSkill( 2000, BonusType.ChestChance          , 0.001);
HeroInfo[28].addSkill( 3000, BonusType.ChestAmount          , 1.100);
HeroInfo[28].addSkill( 4000, BonusType.TapDamage            , 1.100);
HeroInfo[29].addSkill(   20, BonusType.ManaPoolCap          , 3.000);
HeroInfo[29].addSkill(   40, BonusType.ManaRegen            , 0.100);
HeroInfo[29].addSkill(   60, BonusType.ManaPoolCap          , 3.000);
HeroInfo[29].addSkill(  100, BonusType.ManaRegen            , 0.100);
HeroInfo[29].addSkill(  200, BonusType.ManaPoolCap          , 3.000);
HeroInfo[29].addSkill(  500, BonusType.ManaRegen            , 0.100);
HeroInfo[29].addSkill( 1000, BonusType.AllDamage            , 1.100);
HeroInfo[29].addSkill( 2000, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[29].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[29].addSkill( 4000, BonusType.ManaRegen            , 0.100);
HeroInfo[30].addSkill(   20, BonusType.CritDamage           , 1.100);
HeroInfo[30].addSkill(   40, BonusType.CritChance           , 0.001);
HeroInfo[30].addSkill(   60, BonusType.CritDamage           , 1.100);
HeroInfo[30].addSkill(  100, BonusType.CritChance           , 0.001);
HeroInfo[30].addSkill(  200, BonusType.CritDamage           , 1.100);
HeroInfo[30].addSkill(  500, BonusType.CritChance           , 0.001);
HeroInfo[30].addSkill( 1000, BonusType.TapDamageFromHelpers , 0.001);
HeroInfo[30].addSkill( 2000, BonusType.Goldx10Chance        , 0.001);
HeroInfo[30].addSkill( 3000, BonusType.TapDamage            , 1.100);
HeroInfo[30].addSkill( 4000, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(   20, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(   40, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(   60, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(  100, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(  200, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill(  500, BonusType.CritDamage           , 1.100);
HeroInfo[31].addSkill( 1000, BonusType.ManaRegen            , 0.100);
HeroInfo[31].addSkill( 2000, BonusType.TapDamage            , 2.000);
HeroInfo[31].addSkill( 3000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[31].addSkill( 4000, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(   20, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(   40, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(   60, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(  100, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(  200, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill(  500, BonusType.ChestAmount          , 1.100);
HeroInfo[32].addSkill( 1000, BonusType.ManaRegen            , 0.100);
HeroInfo[32].addSkill( 2000, BonusType.TapDamage            , 2.000);
HeroInfo[32].addSkill( 3000, BonusType.CritDamage           , 1.100);
HeroInfo[32].addSkill( 4000, BonusType.ManaPoolCap          , 3.000);
HeroInfo[33].addSkill(   20, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill(   40, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill(   60, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill(  100, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill(  200, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill(  500, BonusType.CritChance           , 0.001);
HeroInfo[33].addSkill( 1000, BonusType.ManaRegen            , 0.100);
HeroInfo[33].addSkill( 2000, BonusType.TapDamage            , 2.000);
HeroInfo[33].addSkill( 3000, BonusType.CritDamage           , 1.100);
HeroInfo[33].addSkill( 4000, BonusType.ChestAmount          , 1.100);
HeroInfo[34].addSkill(   20, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[34].addSkill(   40, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[34].addSkill(   60, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[34].addSkill(  100, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[34].addSkill(  200, BonusType.SpellHelperDamage    , 1.100);
HeroInfo[34].addSkill(  500, BonusType.GoldMonster          , 1.200);
HeroInfo[34].addSkill( 1000, BonusType.GoldBoss             , 1.200);
HeroInfo[34].addSkill( 2000, BonusType.AllHelperDamage      , 1.200);
HeroInfo[34].addSkill( 3000, BonusType.GoldAll              , 1.200);
HeroInfo[34].addSkill( 4000, BonusType.AllDamage            , 1.200);
HeroInfo[35].addSkill(   20, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[35].addSkill(   40, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[35].addSkill(   60, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[35].addSkill(  100, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[35].addSkill(  200, BonusType.MeleeHelperDamage    , 1.100);
HeroInfo[35].addSkill(  500, BonusType.GoldMonster          , 1.200);
HeroInfo[35].addSkill( 1000, BonusType.GoldBoss             , 1.200);
HeroInfo[35].addSkill( 2000, BonusType.AllHelperDamage      , 1.200);
HeroInfo[35].addSkill( 3000, BonusType.GoldAll              , 1.200);
HeroInfo[35].addSkill( 4000, BonusType.AllDamage            , 1.200);
HeroInfo[36].addSkill(   20, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[36].addSkill(   40, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[36].addSkill(   60, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[36].addSkill(  100, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[36].addSkill(  200, BonusType.RangedHelperDamage   , 1.100);
HeroInfo[36].addSkill(  500, BonusType.GoldMonster          , 1.200);
HeroInfo[36].addSkill( 1000, BonusType.GoldBoss             , 1.200);
HeroInfo[36].addSkill( 2000, BonusType.AllHelperDamage      , 1.200);
HeroInfo[36].addSkill( 3000, BonusType.GoldAll              , 1.200);
HeroInfo[36].addSkill( 4000, BonusType.AllDamage            , 1.200);