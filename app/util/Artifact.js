import { BonusType } from './BonusType';

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

  getCostToLevel(cLevel) {
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

export const ArtifactInfo = {
   1: new Artifact( 1, "Heroic Shield"         , 0.70, 1.8,  0, {[BonusType.ArtifactDamage]:  50, [BonusType.GoldBoss                 ]:  20.0}),
   2: new Artifact( 2, "Stone of the Valrunes" , 0.70, 1.8,  0, {[BonusType.ArtifactDamage]:  50, [BonusType.GoldMonster              ]:  10.0}),
   3: new Artifact( 3, "The Arcana Cloak"      , 0.60, 3.0, 40, {[BonusType.ArtifactDamage]:  80, [BonusType.HelperBoostSkillMana     ]: 100.0}),
   4: new Artifact( 4, "Axe of Muerte"         , 0.80, 2.5, 20, {[BonusType.ArtifactDamage]: 300, [BonusType.CritChance               ]:   0.5}),
   5: new Artifact( 5, "Invader's Shield"      , 0.50, 2.1, 20, {[BonusType.ArtifactDamage]: 160, [BonusType.DoubleFairyChance        ]:   0.5}),
   6: new Artifact( 6, "Elixir of Eden"        , 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.ShadowCloneSkillAmount   ]:  20.0}),
   7: new Artifact( 7, "Parchment of Foresight", 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.HelperBoostSkillAmount   ]:  20.0}),
   8: new Artifact( 8, "Hunter's Ointment"     , 0.60, 3.0, 40, {[BonusType.ArtifactDamage]:  80, [BonusType.ShadowCloneSkillMana     ]: 100.0}),
   9: new Artifact( 9, "Laborer's Pendant"     , 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.HandOfMidasSkillAmount   ]:  20.0}),
  10: new Artifact(10, "Bringer of Ragnarok"   , 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.TapBoostSkillAmount      ]:  20.0}),
  11: new Artifact(11, "Titan's Mask"          , 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.BurstDamageSkillAmount   ]:  20.0}),
  12: new Artifact(12, "Swamp Gauntlet"        , 0.60, 2.4, 30, {[BonusType.ArtifactDamage]: 150, [BonusType.ShadowCloneSkillDuration ]: 200.0}),
  13: new Artifact(13, "Forbidden Scroll"      , 0.60, 2.4, 30, {[BonusType.ArtifactDamage]: 150, [BonusType.CritBoostSkillDuration   ]: 200.0}),
  14: new Artifact(14, "Aegis"                 , 0.60, 2.4, 30, {[BonusType.ArtifactDamage]: 150, [BonusType.HelperBoostSkillDuration ]: 200.0}),
  15: new Artifact(15, "Ring of Fealty"        , 0.60, 2.4, 30, {[BonusType.ArtifactDamage]: 150, [BonusType.HandOfMidasSkillDuration ]: 200.0}),
  16: new Artifact(16, "Glacial Axe"           , 0.60, 2.4, 30, {[BonusType.ArtifactDamage]: 150, [BonusType.TapBoostSkillDuration    ]: 200.0}),
  17: new Artifact(17, "Hero's Blade"          , 0.65, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.HelmetBoost              ]:   5.0}),
  18: new Artifact(18, "Egg of Fortune"        , 1.40, 3.0, 10, {[BonusType.ArtifactDamage]:  30, [BonusType.ChestChance              ]:   1.0}),
  19: new Artifact(19, "Chest of Contentment"  , 1.00, 1.8,  0, {[BonusType.ArtifactDamage]:  40, [BonusType.ChestAmount              ]:  10.0}),
  20: new Artifact(20, "Book of Prophecy"      , 0.70, 2.2,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.GoldAll                  ]:   5.0}),
  21: new Artifact(21, "Divine Chalice"        , 0.80, 2.6, 50, {[BonusType.ArtifactDamage]:  80, [BonusType.Goldx10Chance            ]:   1.0}),
  22: new Artifact(22, "Book of Shadows"       , 0.60, 2.5,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.PrestigeRelic            ]:   5.0}),
  23: new Artifact(23, "Helmet of Madness"     , 0.65, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.ArmorBoost               ]:   5.0}),
  24: new Artifact(24, "Staff of Radiance"     , 0.50, 2.6, 25, {[BonusType.ArtifactDamage]:  80, [BonusType.HelperUpgradeCost        ]:   2.0}),
  25: new Artifact(25, "Lethe Water"           , 0.65, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.SwordBoost               ]:   5.0}),
  26: new Artifact(26, "Heavenly Sword"        , 0.70, 2.2,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.ArtifactDamage           ]:   5.0}),
  27: new Artifact(27, "Glove of Kuma"         , 0.60, 3.0, 30, {[BonusType.ArtifactDamage]:  80, [BonusType.CritBoostSkillMana       ]: 100.0}),
  28: new Artifact(28, "Amethyst Staff"        , 0.65, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.SlashBoost               ]:   5.0}),
  29: new Artifact(29, "Drunken Hammer"        , 0.60, 1.7,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.TapDamage                ]:   1.0}),
  31: new Artifact(31, "Divine Retribution"    , 1.00, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.AllDamage                ]:   2.0}),
  32: new Artifact(32, "Fruit of Eden"         , 0.70, 1.7,  0, {[BonusType.ArtifactDamage]:  60, [BonusType.MeleeHelperDamage        ]:  15.0}),
  33: new Artifact(33, "The Sword of Storms"   , 0.70, 1.7,  0, {[BonusType.ArtifactDamage]:  50, [BonusType.RangedHelperDamage       ]:  15.0}),
  34: new Artifact(34, "Charm of the Ancient"  , 0.70, 1.7,  0, {[BonusType.ArtifactDamage]:  60, [BonusType.SpellHelperDamage        ]:  15.0}),
  35: new Artifact(35, "Blade of Damocles"     , 0.70, 1.7,  0, {[BonusType.ArtifactDamage]:  50, [BonusType.AllHelperDamage          ]:   5.0}),
  36: new Artifact(36, "Infinity Pendulum"     , 0.60, 3.0, 20, {[BonusType.ArtifactDamage]:  90, [BonusType.BurstDamageSkillMana     ]: 100.0}),
  37: new Artifact(37, "Oak Staff"             , 0.60, 3.0, 30, {[BonusType.ArtifactDamage]:  80, [BonusType.TapBoostSkillMana        ]: 100.0}),
  38: new Artifact(38, "Furies Bow"            , 0.70, 2.0,  0, {[BonusType.ArtifactDamage]:  30, [BonusType.PetDamageMult            ]:  10.0}),
  39: new Artifact(39, "Titan Spear"           , 0.60, 3.0, 40, {[BonusType.ArtifactDamage]:  80, [BonusType.HandOfMidasSkillMana     ]: 100.0}),
};


// // constants.js
// export const ALABAMA = 1;
// export const ALASKA = 3;
// export const ARIZONA = 4;

// // test1.js
// import * as constants from './constants';
// console.log(constants.ALABAMA);
// console.log(constants.ALASKA);

// // test2.js
// import {ALABAMA, ALASKA} from './constants';
// console.log(ALABAMA);
// console.log(ALASKA);