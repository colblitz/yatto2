export const BonusType = {
  AllDamage                :  0,
  AllHelperDamage          :  1,
  MeleeHelperDamage        :  2,
  RangedHelperDamage       :  3,
  SpellHelperDamage        :  4,
  CritDamage               :  5,
  ArmorBoost               :  6,
  ArtifactDamage           :  7,
  AuraBoost                :  8,
  BossTimer                :  9,
  BurstDamageSkillAmount   : 10,
  BurstDamageSkillMana     : 11,
  ChestAmount              : 12,
  ChestChance              : 13,
  ClanQTEDamage            : 14,
  CritBoostSkillDuration   : 15,
  CritBoostSkillAmount     : 16,
  CritBoostSkillMana       : 17,
  CritChance               : 18,
  DoubleFairyChance        : 19,
  GoblinQTE                : 20,
  GoldAll                  : 21,
  GoldBoss                 : 22,
  GoldMonster              : 23,
  Goldx10Chance            : 24,
  HandOfMidasSkillDuration : 25,
  HandOfMidasSkillAmount   : 26,
  HandOfMidasSkillMana     : 27,
  HelmetBoost              : 28,
  HelperBoostSkillDuration : 29,
  HelperBoostSkillAmount   : 30,
  HelperBoostSkillMana     : 31,
  HelperUpgradeCost        : 32,
  HelperQTECount           : 33,
  InactiveAdvance          : 34,
  InactiveGold             : 35,
  ManaPoolCap              : 36,
  ManaRegen                : 37,
  ManaMonsterMana          : 38,
  ManaTapRegen             : 39,
  ThisHelperDamage         : 40,
  Memory                   : 41,
  MonsterCountPerStage     : 42,
  MonsterHP                : 43,
  PetDamage                : 44,
  PetDamageMult            : 45,
  PetBossDamage            : 46,
  PetBossCount             : 47,
  PetQTEGold               : 48,
  PetOfflineDamage         : 49,
  PrestigeRelic            : 50,
  ShadowCloneSkillDuration : 51,
  ShadowCloneSkillAmount   : 52,
  ShadowCloneSkillMana     : 53,
  SplashDamage             : 54,
  SlashBoost               : 55,
  SwordBoost               : 56,
  TapBoostSkillDuration    : 57,
  TapBoostSkillAmount      : 58,
  TapBoostSkillMana        : 59,
  TapDamage                : 60,
  TapDamageFromHelpers     : 61,
  None                     : 62,
};

export const stringToBonus = {
  "AllDamage"                : BonusType.AllDamage                ,
  "AllHelperDamage"          : BonusType.AllHelperDamage          ,
  "MeleeHelperDamage"        : BonusType.MeleeHelperDamage        ,
  "RangedHelperDamage"       : BonusType.RangedHelperDamage       ,
  "SpellHelperDamage"        : BonusType.SpellHelperDamage        ,
  "CritDamage"               : BonusType.CritDamage               ,
  "ArmorBoost"               : BonusType.ArmorBoost               ,
  "ArtifactDamage"           : BonusType.ArtifactDamage           ,
  "AuraBoost"                : BonusType.AuraBoost                ,
  "BossTimer"                : BonusType.BossTimer                ,
  "BurstDamageSkillAmount"   : BonusType.BurstDamageSkillAmount   ,
  "BurstDamageSkillMana"     : BonusType.BurstDamageSkillMana     ,
  "ChestAmount"              : BonusType.ChestAmount              ,
  "ChestChance"              : BonusType.ChestChance              ,
  "ClanQTEDamage"            : BonusType.ClanQTEDamage            ,
  "CritBoostSkillDuration"   : BonusType.CritBoostSkillDuration   ,
  "CritBoostSkillAmount"     : BonusType.CritBoostSkillAmount     ,
  "CritBoostSkillMana"       : BonusType.CritBoostSkillMana       ,
  "CritChance"               : BonusType.CritChance               ,
  "DoubleFairyChance"        : BonusType.DoubleFairyChance        ,
  "GoblinQTE"                : BonusType.GoblinQTE                ,
  "GoldAll"                  : BonusType.GoldAll                  ,
  "GoldBoss"                 : BonusType.GoldBoss                 ,
  "GoldMonster"              : BonusType.GoldMonster              ,
  "Goldx10Chance"            : BonusType.Goldx10Chance            ,
  "HandOfMidasSkillDuration" : BonusType.HandOfMidasSkillDuration ,
  "HandOfMidasSkillAmount"   : BonusType.HandOfMidasSkillAmount   ,
  "HandOfMidasSkillMana"     : BonusType.HandOfMidasSkillMana     ,
  "HelmetBoost"              : BonusType.HelmetBoost              ,
  "HelperBoostSkillDuration" : BonusType.HelperBoostSkillDuration ,
  "HelperBoostSkillAmount"   : BonusType.HelperBoostSkillAmount   ,
  "HelperBoostSkillMana"     : BonusType.HelperBoostSkillMana     ,
  "HelperUpgradeCost"        : BonusType.HelperUpgradeCost        ,
  "HelperQTECount"           : BonusType.HelperQTECount           ,
  "InactiveAdvance"          : BonusType.InactiveAdvance          ,
  "InactiveGold"             : BonusType.InactiveGold             ,
  "ManaPoolCap"              : BonusType.ManaPoolCap              ,
  "ManaRegen"                : BonusType.ManaRegen                ,
  "ManaMonsterMana"          : BonusType.ManaMonsterMana          ,
  "ManaTapRegen"             : BonusType.ManaTapRegen             ,
  "ThisHelperDamage"         : BonusType.ThisHelperDamage         ,
  "Memory"                   : BonusType.Memory                   ,
  "MonsterCountPerStage"     : BonusType.MonsterCountPerStage     ,
  "MonsterHP"                : BonusType.MonsterHP                ,
  "PetDamage"                : BonusType.PetDamage                ,
  "PetDamageMult"            : BonusType.PetDamageMult            ,
  "PetBossDamage"            : BonusType.PetBossDamage            ,
  "PetBossCount"             : BonusType.PetBossCount             ,
  "PetQTEGold"               : BonusType.PetQTEGold               ,
  "PetOfflineDamage"         : BonusType.PetOfflineDamage         ,
  "PrestigeRelic"            : BonusType.PrestigeRelic            ,
  "ShadowCloneSkillDuration" : BonusType.ShadowCloneSkillDuration ,
  "ShadowCloneSkillAmount"   : BonusType.ShadowCloneSkillAmount   ,
  "ShadowCloneSkillMana"     : BonusType.ShadowCloneSkillMana     ,
  "SplashDamage"             : BonusType.SplashDamage             ,
  "SlashBoost"               : BonusType.SlashBoost               ,
  "SwordBoost"               : BonusType.SwordBoost               ,
  "TapBoostSkillDuration"    : BonusType.TapBoostSkillDuration    ,
  "TapBoostSkillAmount"      : BonusType.TapBoostSkillAmount      ,
  "TapBoostSkillMana"        : BonusType.TapBoostSkillMana        ,
  "TapDamage"                : BonusType.TapDamage                ,
  "TapDamageFromHelpers"     : BonusType.TapDamageFromHelpers     ,
  "None"                     : BonusType.None                     ,
};

const bonusToString = {};
for (var s in stringToBonus) {
  bonusToString[stringToBonus[s]] = s;
}

export function printBonuses(allBonuses) {
  var bonuses = {};
  for (var b in allBonuses) {
    bonuses[bonusToString[b]] = getBonus(allBonuses, b);
  }
  console.log(bonuses);
}

export const additiveBonuses = {
  [BonusType.ArtifactDamage           ]: true,
  [BonusType.BossTimer                ]: true,
  [BonusType.BurstDamageSkillMana     ]: true,
  [BonusType.ChestChance              ]: true,
  [BonusType.CritBoostSkillDuration   ]: true,
  [BonusType.CritBoostSkillMana       ]: true,
  [BonusType.CritChance               ]: true,
  [BonusType.DoubleFairyChance        ]: true,
  [BonusType.Goldx10Chance            ]: true,
  [BonusType.HandOfMidasSkillDuration ]: true,
  [BonusType.HandOfMidasSkillMana     ]: true,
  [BonusType.HelperBoostSkillDuration ]: true,
  [BonusType.HelperBoostSkillMana     ]: true,
  [BonusType.HelperUpgradeCost        ]: true,
  [BonusType.HelperQTECount           ]: true,
  [BonusType.InactiveAdvance          ]: true,
  [BonusType.ManaPoolCap              ]: true,
  [BonusType.ManaRegen                ]: true,
  [BonusType.ManaMonsterMana          ]: true,
  [BonusType.ManaTapRegen             ]: true,
  [BonusType.Memory                   ]: true,
  [BonusType.MonsterCountPerStage     ]: true,
  [BonusType.PetDamage                ]: true,
  [BonusType.PetBossCount             ]: true,
  [BonusType.PetQTEGold               ]: true,
  [BonusType.PetOfflineDamage         ]: true,
  [BonusType.ShadowCloneSkillDuration ]: true,
  [BonusType.ShadowCloneSkillMana     ]: true,
  [BonusType.SplashDamage             ]: true,
  [BonusType.TapBoostSkillDuration    ]: true,
  [BonusType.TapBoostSkillMana        ]: true,
  [BonusType.TapDamageFromHelpers     ]: true,
};

export const notPercentageBonuses = {
  [BonusType.BossTimer                ]: false,
  [BonusType.BurstDamageSkillMana     ]: false,
  [BonusType.ChestChance              ]: false,
  [BonusType.CritBoostSkillDuration   ]: false,
  [BonusType.CritBoostSkillMana       ]: false,
  [BonusType.CritChance               ]: false,
  [BonusType.DoubleFairyChance        ]: false,
  [BonusType.Goldx10Chance            ]: false,
  [BonusType.HandOfMidasSkillDuration ]: false,
  [BonusType.HandOfMidasSkillMana     ]: false,
  [BonusType.HelperBoostSkillDuration ]: false,
  [BonusType.HelperBoostSkillMana     ]: false,
  [BonusType.HelperUpgradeCost        ]: false,
  [BonusType.HelperQTECount           ]: false,
  [BonusType.InactiveAdvance          ]: false,
  [BonusType.ManaPoolCap              ]: false,
  [BonusType.ManaRegen                ]: false,
  [BonusType.ManaMonsterMana          ]: false,
  [BonusType.ManaTapRegen             ]: false,
  [BonusType.Memory                   ]: false,
  [BonusType.MonsterCountPerStage     ]: false,
  [BonusType.MonsterHP                ]: false,
  [BonusType.PetDamage                ]: false,
  [BonusType.PetBossCount             ]: false,
  [BonusType.PetQTEGold               ]: false,
  [BonusType.PetOfflineDamage         ]: false,
  [BonusType.ShadowCloneSkillDuration ]: false,
  [BonusType.ShadowCloneSkillMana     ]: false,
  [BonusType.SplashDamage             ]: false,
  [BonusType.TapBoostSkillDuration    ]: false,
  [BonusType.TapBoostSkillMana        ]: false,
  [BonusType.TapDamageFromHelpers     ]: false,
};

export function addBonus(allBonuses, bonusType, magnitude) {
  if (bonusType in allBonuses) {
    if (bonusType in additiveBonuses) {
      allBonuses[bonusType] += magnitude;
    } else {
      if (magnitude != 0) {
        allBonuses[bonusType] *= magnitude;
      }
    }
  } else {
    allBonuses[bonusType] = magnitude;
  }
}

export function getBonus(allBonuses, bonusType) {
  if (bonusType in allBonuses) {
    if (bonusType in additiveBonuses && !(bonusType in notPercentageBonuses)) {
      return 1 + allBonuses[bonusType];
    }
    return allBonuses[bonusType];
  } else {
    if (bonusType in additiveBonuses) {
      return 0;
    } else {
      return 1;
    }
  }
}