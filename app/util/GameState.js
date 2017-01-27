import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { Equipment, EquipmentInfo, eCategoryToBoostBonus } from './Equipment';
import { Skill, SkillInfo } from './Skill';
import { getHeroImprovementBonus, getHeroCurrentA } from './HeroImprovementBonus';
import { getPlayerImprovementBonus, getPlayerCurrentA } from './PlayerImprovementBonus';
import { ServerVarsModel } from './ServerVarsModel';
import { BonusType, addBonus, getBonus, printBonuses } from './BonusType';
import { getHeroName } from './Localization';

/*
  "info":{
    "playerId":"ebd20042-c0c6-4abd-aafd-22099b9dc3b9",
    "supportCode":"z3wkz",
    "reportedPlayers":[
      "7qwww5",
      "v3qxn"
    ],
    "totalActiveGameTime":116726.512856383,
    "gold":7.70443469899896e+44,
    "relics":101,
    "lastEquipMaxStage":596,
    "lastSkillMaxStage":551,
    "skillPoints":16,
    "maxStage":600
  },
  "swordmaster":{ "level":1640 },
  "artifacts":{ "Artifact1":8, "Artifact5":7, ... },
  "heroes":{
    "levels":{ "H18":900, "H01":900, ... },
    "weapons":{ "H37":1, "H22":1, ... }
  },
  "equipment":{
    "Hat_Robot": { "level": 30, "equipped": false },
    "Slash_EmbersBlue": { "level": 26, "equipped": true },
    ...
  },
  "pets":{
    "active": "Pet13",
    "levels": { Pet1":7, "Pet2":15, ... },
  },
  "skills":{
    "PetQTE":1,
    "BossDmgQTE":1,
    "PetGoldQTE":2,
    ...
  }
  "clan":{
    "id": "nzy5z",
    "name": "TT2 Beta",
    "score": 43,
  }
*/

export class GameState {
  constructor(info, swordmaster, artifacts, heroes, equipment, pets, skills, clan) {
    this.info = info;
    this.swordmaster = swordmaster;
    this.artifacts = artifacts;
    this.heroes = heroes;
    this.equipment = equipment;
    this.pets = pets;
    this.skills = skills;
    this.clan = clan;
  }

  fillWithEquipmentBonuses() {
    for (var equip in this.equipment) {
      this.equipment[equip]["bonus"] = EquipmentInfo[equip].getMultiplier(this.equipment[equip].level);
    }
  }

  calculateBonuses() {
    this.bonuses = this.getBonuses();
  }

  getCopy() {
    // TODO: is this really the best way to deep copy -__-
    return new GameState(
      JSON.parse(JSON.stringify(this.info)),
      JSON.parse(JSON.stringify(this.swordmaster)),
      JSON.parse(JSON.stringify(this.artifacts)),
      JSON.parse(JSON.stringify(this.heroes)),
      JSON.parse(JSON.stringify(this.equipment)),
      JSON.parse(JSON.stringify(this.pets)),
      JSON.parse(JSON.stringify(this.skills)),
      JSON.parse(JSON.stringify(this.clan))
    );
  }

  printStats() {
    this.calculateBonuses();
    printBonuses(this.bonuses);
    console.log("base tap damage: " + this.getBaseTapDamage());
    console.log("average crit damage: " + this.getAverageCritDamage());
    console.log("pet damage: " + this.getPetDamage());
    console.log("hero damage: " + this.getHeroDamage());
  }

  getBonuses() {
    var allBonuses = {};
    for (var artifact in this.artifacts) {
      ArtifactInfo[artifact].getAllBonuses(this.artifacts[artifact], allBonuses);
    }
    // ArtifactModel.ApplyAllArtifactBonuses
    addBonus(allBonuses, BonusType.AllDamage, getBonus(allBonuses, BonusType.ArtifactDamage) * getBonus(allBonuses, BonusType.HSArtifactDamage));

    for (var hero in this.heroes.levels) {
      HeroInfo[hero].getAllBonuses(this.heroes.levels[hero], allBonuses);
    }

    for (var equip in this.equipment) {
      if (this.equipment[equip].equipped) {
        // EquipmentInfo.GetBonusAmount
        var boost = getBonus(allBonuses, eCategoryToBoostBonus[EquipmentInfo[equip].category]);
        EquipmentInfo[equip].getBonus(this.equipment[equip].level, allBonuses, boost);
      }
    }

    for (var pet in this.pets.levels) {
      if (pet === this.pets.active) {
        PetInfo[pet].getActiveBonuses(this.pets.levels[pet], allBonuses);
      } else {
        PetInfo[pet].getPassiveBonuses(this.pets.levels[pet], allBonuses);
      }
    }

    for (var skill in this.skills) {
      if (SkillInfo[skill].bonusType != BonusType.None) {
        SkillInfo[skill].getBonus(this.skills[skill], allBonuses);
      }
    }

    // ClanModel.ApplyClanBonus
    addBonus(allBonuses, BonusType.AllDamage, Math.pow(ServerVarsModel.clanBonusBase, this.clan.score));
    addBonus(allBonuses, BonusType.Memory, Math.min(ServerVarsModel.maxMemoryAmount, ServerVarsModel.clanMemoryBase * this.clan.score));
    return allBonuses;
  }

  getBonus(bonusType) {
    return getBonus(this.bonuses, bonusType);
  }

  // PlayerModel.GetMaxNumUpgrades()
  getMaxPlayerUpgrades(cLevel, gold) {
    var d = gold * (ServerVarsModel.playerUpgradeCostGrowth - 1) / ServerVarsModel.playerUpgradeCostBase + Math.pow(ServerVarsModel.playerUpgradeCostGrowth, cLevel);
    return Math.floor(Math.log(d) / Math.log(ServerVarsModel.playerUpgradeCostGrowth) - cLevel);
  }

  // HelperInfo.GetMaxNumUpgrades()
  getMaxHeroUpgrades(hero, cLevel, gold) {
    var num = 1 - this.getBonus(BonusType.HelperUpgradeCost);
    return Math.floor(Math.log(gold * (ServerVarsModel.helperUpgradeBase - 1) / (num * hero.cost * Math.pow(ServerVarsModel.helperUpgradeBase, cLevel)) + 1) / Math.log(ServerVarsModel.helperUpgradeBase));
  }

  // PlayerModel.GetUpgradeCost()
  getPlayerUpgradeCost(sLevel, eLevel) {
    return ServerVarsModel.playerUpgradeCostBase *
           (Math.pow(ServerVarsModel.playerUpgradeCostGrowth, eLevel) -
            Math.pow(ServerVarsModel.playerUpgradeCostGrowth, sLevel)) /
           (ServerVarsModel.playerUpgradeCostGrowth - 1);
  }

  // PlayerModel.GetCurrentDamageFromLevel()
  getBaseTapDamage() {
    var swordmaster = this.swordmaster.level *
                      getPlayerImprovementBonus(this.swordmaster.level) *
                      ServerVarsModel.playerDamageMult *
                      this.getBonus(BonusType.TapDamage) *
                      this.getBonus(BonusType.AllDamage);
    var heroDamage = this.getHeroDamage() * this.getBonus(BonusType.TapDamageFromHelpers);
    return swordmaster + heroDamage;
  }

  getTapPercentageFromHeroes() {
    var swordmaster = this.swordmaster.level *
                      getPlayerImprovementBonus(this.swordmaster.level) *
                      ServerVarsModel.playerDamageMult *
                      this.getBonus(BonusType.TapDamage) *
                      this.getBonus(BonusType.AllDamage);
    var heroDamage = this.getHeroDamage() * this.getBonus(BonusType.TapDamageFromHelpers);
    return heroDamage / (swordmaster + heroDamage);
  }

  // PlayerModel.GetCriticalDamage()
  getAverageCritDamage() {
    var critChance = Math.min(ServerVarsModel.maxCritChance, ServerVarsModel.playerCritChance + this.getBonus(BonusType.CritChance));
    var critMinMult = ServerVarsModel.playerCritMinMult * this.getBonus(BonusType.CritDamage);
    var critMaxMult = ServerVarsModel.playerCritMaxMult * this.getBonus(BonusType.CritDamage);
    return this.getBaseTapDamage() * (1 + critChance * (critMinMult + critMaxMult) / 2);
  }

  getPetTotalLevels() {
    return Object.values(this.pets.levels).reduce((a, b) => a + b, 0);
  }

  // PetModel.GetPetOfflineDPS()
  getPetOfflineDPS() {
    return this.getAverageCritDamage() * this.getBonus(BonusType.PetDamage) * this.getBonus(BonusType.PetDamageMult) * ServerVarsModel.petAutoAttackDuration;
  }

  // PetModel.RefreshCurrentDamage()
  getPetDamage() {
    return this.getAverageCritDamage() * this.getBonus(BonusType.PetDamage) * this.getBonus(BonusType.PetDamageMult);
  }

  getWeaponMultiplier(hero) {
    if (hero in this.heroes.weapons) {
      return this.heroes.weapons[hero] * 0.5;
    }
    return 0;
  }

  // HelperInfo.GetDPS
  getHeroDamage() {
    var allHeroDamage = 0;
    for (var hero in this.heroes.levels) {
      var heroDamage = HeroInfo[hero].getBaseDamage(this.heroes.levels[hero]) *
                       this.getBonus(HeroInfo[hero].type) *
                       this.getBonus(BonusType.AllDamage) *
                       this.getBonus(BonusType.AllHelperDamage) *
                       (1 + this.getWeaponMultiplier(hero));
      allHeroDamage += heroDamage;
    }
    return allHeroDamage;
  }

  getTopDamageHeroLevel() {
    var maxDamage = 0;
    var maxLevel = 0;
    for (var hero in this.heroes.levels) {
      var heroDamage = HeroInfo[hero].getBaseDamage(this.heroes.levels[hero]) *
                       this.getBonus(HeroInfo[hero].type) *
                       this.getBonus(BonusType.AllDamage) *
                       this.getBonus(BonusType.AllHelperDamage) *
                       (1 + this.getWeaponMultiplier(hero));
      if (heroDamage > maxDamage) {
        maxDamage = heroDamage;
        maxLevel = this.heroes.levels[hero];
      }
    }
    return maxLevel;
  }

  getDPS(tps) {
    // TODO: fire strike
    var tapDPS = tps * this.getAverageCritDamage();
    // TODO: war cry
    var petDPS = this.getPetTotalLevels() > ServerVarsModel.petAutoAttackLevel ?
      this.getPetDamage() / ServerVarsModel.petAutoAttackDuration :
      this.getPetDamage() * (tps / ServerVarsModel.petTapAmount);
    var heroDPS = this.getHeroDamage();
    return (tapDPS + petDPS + heroDPS) / this.getBonus(BonusType.MonsterHP);
  }

  getDamageEquivalent(tps, reload = false) {
    if (!this.bonuses || reload) {
      this.calculateBonuses();
    }

    var goldM = this.getGoldMultiplier();
    // assume hero/SM levels are optimal
    var skew = this.getTapPercentageFromHeroes();
    var r = ServerVarsModel.helperUpgradeBase * skew + ServerVarsModel.playerUpgradeCostGrowth * (1 - skew);

    var extraLevels = Math.log(1 + goldM - goldM/r) / Math.log(r);
    var a = getHeroCurrentA(this.getTopDamageHeroLevel()) * skew + getPlayerCurrentA(this.swordmaster.level)  * (1 - skew);

    // TODO: alternative option:
    // calculate hero and SM equivalents separately, then skew
    return Math.pow(a, extraLevels) * this.getDPS(tps);
  }

  getGoldMultiplier() {
    // Average hp across five stages:
    // # of monsters                                  + boss
    // base^0 + base^0 + base^0 + base^0 + base^0 ... + 2*base^0
    // base^1 + base^1 + base^1 + base^1 + base^1 ... + 3*base^1
    // base^2 + base^2 + base^2 + base^2 + base^2 ... + 4*base^2
    // base^3 + base^3 + base^3 + base^3 + base^3 ... + 5*base^3
    // base^4 + base^4 + base^4 + base^4 + base^4 ... + 8*base^4

    // Get base gold (without bonuses)
    var monsterCount = this.getMonsterCount(this.info.maxStage);
    var baseHP = this.getBaseMonsterHP(this.info.maxStage);
    var hpGrowth = this.info.maxStage > ServerVarsModel.monsterHPLevelOff ? ServerVarsModel.monsterHPBase2 : ServerVarsModel.monsterHPBase1;
    var baseGold = 0;
    var actualGold = 0;
    for (var i of [0, 1, 2, 3, 4]) {
      // Get base monster gold with 1 as base
      var baseMonsterHP = Math.pow(hpGrowth, i) * baseHP;
      var baseMonsterGold = this.getMonsterGold(baseMonsterHP, this.info.maxStage, {}) * monsterCount;

      // Get actual monster gold with bonuses
      var monsterHP = baseMonsterHP * this.getBonus(BonusType.MonsterHP);
      var monsterGold = this.getMonsterGold(monsterHP, this.info.maxStage, this.bonuses) * monsterCount;

      // Get base boss gold
      var baseBossHP = baseMonsterHP * ServerVarsModel.themeMultiplierSequence[i];
      var baseBossGold = this.getBossGold(baseBossHP, this.info.maxStage, {});

      // Get actual boss gold
      var bossHP = baseBossHP * this.getBonus(BonusType.MonsterHP);
      var bossGold = this.getBossGold(bossHP, this.info.maxStage, this.bonuses);

      baseGold += baseMonsterGold + baseBossGold;
      actualGold += monsterGold + bossGold;
    }

    // Get multiplier
    return actualGold / baseGold;
  }

  getMonsterGold(hp, maxstage, bonuses) {
    var base = (hp * ServerVarsModel.monsterGoldMultiplier +
               (ServerVarsModel.monsterGoldSlope * Math.min(maxstage, ServerVarsModel.noMoreMonsterGoldSlope))) *
               getBonus(bonuses, BonusType.GoldAll);

    // goldx10Chance of the time, you get x10
    // (1 - goldx10Chance) of the time, you get x1
    var goldx10Chance = ServerVarsModel.goldx10Chance + getBonus(bonuses, BonusType.Goldx10Chance);
    var goldx10Multiplier = ((goldx10Chance * 9) + 1);

    // chestersonChance of the time, it's a chesterson
    // (1 - chestersonChance) of the time, it's a normal
    var chestersonChance = ServerVarsModel.chestersonChance + getBonus(bonuses, BonusType.ChestChance);
    var chestersonMultiplier = ServerVarsModel.treasureGold * getBonus(bonuses, BonusType.ChestAmount);

    var normalChance = 1 - chestersonChance;
    var normalMultiplier = getBonus(bonuses, BonusType.GoldMonster);

    // familyChance of the time, you get x[2, 5]
    // (1 - familyChance) of the time, you get x1
    var familyChance = ServerVarsModel.multiMonsterBaseChance + getBonus(bonuses, BonusType.MultiMonster);
    var familyMultiplier = ((familyChance * 2.5) + 1);

    return base * goldx10Multiplier * familyMultiplier * (chestersonChance * chestersonMultiplier + normalChance * normalMultiplier);
  }

  getBossGold(bossHP, maxstage, bonuses) {
    var base = (bossHP * ServerVarsModel.monsterGoldMultiplier +
               (ServerVarsModel.monsterGoldSlope * Math.min(maxstage, ServerVarsModel.noMoreMonsterGoldSlope))) *
               getBonus(bonuses, BonusType.GoldAll);

    // goldx10Chance of the time, you get x10
    // (1 - goldx10Chance) of the time, you get x1
    var goldx10Chance = ServerVarsModel.goldx10Chance + getBonus(bonuses, BonusType.Goldx10Chance);
    var goldx10Multiplier = ((goldx10Chance * 9) + 1);

    var bossMultiplier =
      Math.max(
        ServerVarsModel.maxBossGoldMultiplier,
        Math.min(
          1.0,
          Math.ceil((maxstage - 5) / 5) * ServerVarsModel.bossGoldMultiplierSlope)) *
      getBonus(bonuses, BonusType.GoldBoss);

    return base * goldx10Multiplier * bossMultiplier;
  }

  // MonsterModel.GetMonsterHP
  getBaseMonsterHP(stage) {
    return ServerVarsModel.monsterHPMultiplier *
      Math.pow(ServerVarsModel.monsterHPBase1, Math.min(stage, ServerVarsModel.monsterHPLevelOff)) *
      Math.pow(ServerVarsModel.monsterHPBase2, Math.max(stage - ServerVarsModel.monsterHPLevelOff, 0));
  }

  // StageLogic.GetEnemyCount()
  getMonsterCount(stage) {
    return Math.max(
      1,
      Math.min(
        ServerVarsModel.maxMonsterCount,
        ServerVarsModel.monsterCountBase + Math.floor(stage / 1000) * ServerVarsModel.monsterCountInc) -
      this.getBonus(BonusType.MonsterCountPerStage));
  }

  // InactiveGameplayModel.GetTotalDPS()
  getOfflineDPS() {
    // TODO: wtf is this?
    // a = Singleton<BonusModel>.instance.GetBonus("active_skill_helper_boost", BonusType.None)
    var a = 1;
    return this.getHeroDamage() / a + this.getPetOfflineDPS() * this.getBonus(BonusType.PetOfflineDamage);
  }

  // InactiveGameplayModel.CollectInactiveGold()
  getOfflineGold(time) {

// // InactiveGameplayModel.AdvanceStage
//   double num = (double)dictionary["goldAccumulated"];
//   int num2 = (int)dictionary["targetStage"];
//   int num3 = (int)dictionary["killCount"];
//   if (num > 0.0)
//   {
//     this.uncollectedInactiveGold += num * Singleton<BonusModel>.instance.GetBonus(BonusType.InactiveGold);
//     double val = Singleton<MonsterModel>.instance.GetMonsterGoldDrop(num2, MonsterClass.Normal) * (double)ServerVarsModel.inactiveGoldMonsterCap;
//     this.uncollectedInactiveGold = Math.Min(this.uncollectedInactiveGold, val);
//   }


// // InactiveGameplayModel
// public Dictionary<string, object> CalculateStageAdvance(float timeElapsed)
// {
//   Dictionary<string, object> dictionary = new Dictionary<string, object>();
//   double totalDPS = this.GetTotalDPS();
//   if (totalDPS <= 0.0)
//   {
//     return null;
//   }
//   double num = (double)timeElapsed;
//   int num2 = Singleton<StageLogicController>.instance.currentStage;
//   int num3 = num2;
//   int num4 = Singleton<StageLogicController>.instance.enemyKillCount;
//   float offlineKillAnimationTime = ServerVarsModel.offlineKillAnimationTime;
//   double num5 = 30.0 + Singleton<BonusModel>.instance.GetBonus(BonusType.BossTimer);
//   double bonus = Singleton<BonusModel>.instance.GetBonus(BonusType.InactiveAdvance);
//   double num6 = (double)Singleton<ActiveSkillModel>.instance.GetBankedDoubleDamageTime();
//   double num7 = 0.0;
//   bool flag = true;
//   while (num > 0.0)
//   {
//     bool flag2 = num6 > 0.0;
//     double num8 = totalDPS * (double)((!flag2) ? 1 : 2);
//     int monsterCount = Singleton<StageLogicController>.instance.GetMonsterCount(num3);
//     double monsterHP = Singleton<MonsterModel>.instance.GetMonsterHP(num3, MonsterClass.Normal);
//     double monsterHP2 = Singleton<MonsterModel>.instance.GetMonsterHP(num3, MonsterClass.Boss);
//     double num9 = monsterHP / num8;
//     double num10 = num9 + (double)offlineKillAnimationTime;
//     double inactiveMonsterGoldDrop = Singleton<MonsterModel>.instance.GetInactiveMonsterGoldDrop(num3);
//     double num11 = monsterHP2 / num8;
//     double num12 = num11 + (double)offlineKillAnimationTime;
//     double monsterGoldDrop = Singleton<MonsterModel>.instance.GetMonsterGoldDrop(num3, MonsterClass.Boss);
//     double num13 = (!flag2) ? num : num6;
//     if (flag && Singleton<TournamentModel>.instance.tournamentStatus == TournamentStatus.Active)
//     {
//       flag = false;
//     }
//     if (flag && (double)num3 >= bonus)
//     {
//       flag = false;
//     }
//     int num14 = (int)Math.Floor(num13 / num10);
//     if (num14 <= 0)
//     {
//       if (flag2)
//       {
//         num6 = 0.0;
//       }
//       else
//       {
//         num = 0.0;
//       }
//     }
//     else
//     {
//       if (flag)
//       {
//         num14 = Math.Min(num14, monsterCount - num4);
//       }
//       num13 -= (double)num14 * num10;
//       num -= (double)num14 * num10;
//       num6 -= (double)num14 * num10;
//       num7 += (double)num14 * inactiveMonsterGoldDrop;
//       num4 = Math.Min(num4 + num14, monsterCount);
//       if (flag && num4 < monsterCount)
//       {
//         if (flag2)
//         {
//           num6 = 0.0;
//           continue;
//         }
//         flag = false;
//       }
//       if (flag && (num13 < num11 || num11 >= num5))
//       {
//         if (flag2)
//         {
//           num6 = 0.0;
//           continue;
//         }
//         flag = false;
//       }
//       if (flag)
//       {
//         num -= num12;
//         num6 -= num12;
//         num7 += monsterGoldDrop;
//         num3++;
//         num4 = 0;
//       }
//     }
//   }
//   dictionary.Add("goldAccumulated", num7);
//   dictionary.Add("targetStage", num3);
//   dictionary.Add("killCount", num4);
//   return dictionary;
// }

// // MonsterModel
// public double GetInactiveMonsterGoldDrop(int stageNum)
// {
//   double monsterGoldDrop = this.GetMonsterGoldDrop(stageNum, MonsterClass.Normal);
//   return this.GetMonsterGoldDrop(stageNum, MonsterClass.Normal) * (double)(1f + Singleton<BonusModel>.instance.Get10xGoldChance() * 9f) * (1.0 + (double)Singleton<BonusModel>.instance.GetChestersonChance() * (Singleton<BonusModel>.instance.GetChestersonMultiplier() - 1.0)) * (double)(1f + Singleton<BonusModel>.instance.GetMultiMonsterChance() * 2.5f);
// }
  }

  getSplashGold(numSplashed, stage) {
    return numSplashed * this.getInactiveMonsterGoldDrop(stage);
  }

  // MonsterModel.GetInactiveMonsterGoldDrop
  getInactiveMonsterGoldDrop(stageNum) {
    var monsterGoldDrop = this.getMonsterGoldDrop(stageNum); //, MonsterClass.Normal);

    var goldx10Chance = ServerVarsModel.goldx10Chance + this.getBonus(BonusType.Goldx10Chance);
    var goldx10Multiplier = ((goldx10Chance * 9) + 1);

    var chestersonChance = ServerVarsModel.chestersonChance + this.getBonus(BonusType.ChestChance);
    var chestersonMultiplier = ServerVarsModel.treasureGold * this.getBonus(BonusType.ChestAmount);

    var familyChance = ServerVarsModel.multiMonsterBaseChance + this.getBonus(BonusType.MultiMonster);
    var familyMultiplier = ((familyChance * 2.5) + 1);

    return monsterGoldDrop * goldx10Multiplier * (1.0 + chestersonChance * (chestersonMultiplier - 1.0)) * familyMultiplier;
  }

  // MonsterModel.GetMonsterGoldDrop
  getMonsterGoldDrop(stageNum) {//, MonsterClass monsterClass) {
    // double num = (this.GetMonsterHP(stageNum, monsterClass) * (double)ServerVarsModel.monsterGoldMultiplier + (double)(ServerVarsModel.monsterGoldSlope * Math.Min((float)stageNum, ServerVarsModel.noMoreMonsterGoldSlope))) * Singleton<BonusModel>.instance.GetBonus(BonusType.GoldAll);
    // if (monsterClass == MonsterClass.Chesterson)
    // {
    //   num *= Singleton<BonusModel>.instance.GetChestersonMultiplier();
    // }
    // else if (monsterClass == MonsterClass.Boss)
    // {
    //   num *= Math.Max((double)ServerVarsModel.maxBossGoldMultiplier, Math.Min(1.0, Math.Ceiling((double)((stageNum - 5) / 5)) * (double)ServerVarsModel.bossGoldMultiplierSlope)) * Singleton<BonusModel>.instance.GetBonus(BonusType.GoldBoss);
    // }
    // else
    // {
    //   num *= Singleton<BonusModel>.instance.GetBonus(BonusType.GoldMonster);
    // }
    // if (num < 100.0)
    // {
    //   num = Math.Ceiling(num);
    // }
    // return Math.Max(Singleton<BonusModel>.instance.GetBonus(BonusType.GoldAll), num);
  }

  getRelicsFromStage(stage) {

  }
}

// For swordmaster levels, hero levels, artifact levels
export function getDiff(g1, g2) {
  var outcome = {"heroes": {}, "artifacts": {}};
  var changes = {"heroes": {}, "artifacts": {}};
  if (g1.swordmaster.level != g2.swordmaster.level) {
    outcome["swordmaster"] = g2.swordmaster.level;
    changes["swordmaster"] = g2.swordmaster.level - g1.swordmaster.level;
  }
  for (var hero in g2.heroes.levels) {
    var newLevel = g2.heroes.levels[hero];
    if (newLevel != g1.heroes.levels[hero]) {
      outcome.heroes[hero] = newLevel;
      changes.heroes[hero] = newLevel - g1.heroes.levels[hero];
    }
  }
  for (var artifact in g2.artifacts) {
    var newLevel = g2.artifacts[artifact];
    if (newLevel != g1.artifacts[artifact]) {
      outcome.artifacts[artifact] = newLevel;
      changes.artifacts[artifact] = newLevel - g1.artifacts[artifact];
    }
  }
  return {
    outcome: outcome,
    changes: changes
  };
}

export function fromSaveFile(saveJSON) {
  console.log(saveJSON);
  var artifactLevels = {};
  for (var artifact in saveJSON.ArtifactModel.allArtifactInfo) {
    var level = saveJSON.ArtifactModel.allArtifactInfo[artifact].level.$content;
    if (level > 0) {
      artifactLevels[artifact] = level;
    }
  }

  var equipmentOwned = {};
  for (var equipment in saveJSON.EquipmentModel.allEquipment) {
    var equip = saveJSON.EquipmentModel.allEquipment[equipment];
    var eid = equip.equipmentID.$content;
    var level = equip.level.$content;
    var equipped = equip.equipped.$content;
    equipmentOwned[eid] = {
      level: level,
      equipped: equipped,
    };
  }

  var skillLevels = {};
  for (var skill in saveJSON.SkillTreeModel.idToLevelDict) {
    var level = saveJSON.SkillTreeModel.idToLevelDict[skill];
    if (level > 0) {
      skillLevels[skill] = level;
    }
  }

  return new GameState(
    // info
    {
      playerId            : saveJSON.AccountModel.playerID.$content,
      supportCode         : saveJSON.AccountModel.supportCode.$content,
      reportedPlayers     : saveJSON.PlayerModel.reportedPlayers.$content.slice(),
      totalActiveGameTime : saveJSON.GHTime.totalActiveGameTime.$content,
      gold                : saveJSON.PlayerModel.gold.$content,
      relics              : saveJSON.PlayerModel.relicsReceivedServer.$content - saveJSON.PlayerModel.relicsSpentServer.$content,
      lastEquipMaxStage   : saveJSON.EquipmentModel.lastMaxStage.$content,
      lastSkillMaxStage   : saveJSON.PlayerModel.lastSkillPointsCollectedStage.$content,
      skillPoints         : saveJSON.PlayerModel.skillPointsReceivedServer.$content,
      maxStage            : Math.max(saveJSON.PrestigeModel.maxPrestigeStageCount.$content,
                              saveJSON.StageLogicController.currentStage.$content,
                              saveJSON.AchievementModel.ReachStageprogress.$content,
                              saveJSON.EquipmentModel.lastMaxStage.$content,
                              saveJSON.PlayerModel.lastSkillPointsCollectedStage.$content),
    },
    // swordmaster
    {
      level: saveJSON.PlayerModel.level.$content,
      // TODO: active skills?
    },
    // artifacts
    artifactLevels,
    // heroes
    {
      levels: Object.assign({}, saveJSON.HelperModel.allHelperLevels),
      weapons: Object.assign({}, saveJSON.HelperModel.allHelperWeaponLevels),
    },
    // equipment
    equipmentOwned,
    // pets
    {
      levels: Object.assign({}, saveJSON.PetModel.allPetLevels),
      active: saveJSON.PetModel.currentPet.$content,
    },
    // skills
    skillLevels,
    // clan
    {
      id: saveJSON.ClanModel.clan.clanID,
      name: saveJSON.ClanModel.clan.name,
      score: saveJSON.ClanModel.clan.score,
    }
  );
}