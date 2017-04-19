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

const MonsterClass = {
  Normal      : 0,
  Boss        : 1,
  DungeonBoss : 2,
  Chesterson  : 3,
  ManaMonster : 4,
  Tutorial    : 5,
};

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
    console.log("average crit damage: " + this.getAverageDamageWithCrits());
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
    if (this.clan.score > ServerVarsModel.clanQuestStageNerf) {
      addBonus(allBonuses, BonusType.AllDamage,
        Math.pow(ServerVarsModel.clanBonusBase, ServerVarsModel.clanQuestStageNerf) *
        Math.pow(ServerVarsModel.clanBonusBaseNerf, this.clan.score - ServerVarsModel.clanQuestStageNerf));
      addBonus(allBonuses, BonusType.Memory,
        Math.min(
          ServerVarsModel.maxMemoryAmount,
          (ServerVarsModel.clanMemoryBase * ServerVarsModel.clanQuestStageNerf +
           ServerVarsModel.clanMemoryBaseNerf * (this.clan.score - ServerVarsModel.clanQuestStageNerf))));
    } else {
      addBonus(allBonuses, BonusType.AllDamage, Math.pow(ServerVarsModel.clanBonusBase, this.clan.score));
      addBonus(allBonuses, BonusType.Memory, Math.min(ServerVarsModel.maxMemoryAmount, ServerVarsModel.clanMemoryBase * this.clan.score));
    }
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
  getAverageDamageWithCrits() {
    var critChance = Math.min(ServerVarsModel.maxCritChance, ServerVarsModel.playerCritChance + this.getBonus(BonusType.CritChance));
    var critMinMult = ServerVarsModel.playerCritMinMult * this.getBonus(BonusType.CritDamage);
    var critMaxMult = ServerVarsModel.playerCritMaxMult * this.getBonus(BonusType.CritDamage);
    return this.getBaseTapDamage() * (1 - critChance + critChance * (critMinMult + critMaxMult) / 2);
  }

  // PlayerModel.GetPlayerDamageWithAverageCrit()
  getPlayerDamageWithAverageCrit() {
    var critChance = Math.min(ServerVarsModel.maxCritChance, ServerVarsModel.playerCritChance + this.getBonus(BonusType.CritChance));
    var critMinMult = ServerVarsModel.playerCritMinMult * this.getBonus(BonusType.CritDamage);
    var critMaxMult = ServerVarsModel.playerCritMaxMult * this.getBonus(BonusType.CritDamage);
    return this.getBaseTapDamage() * (1 + critChance * (critMinMult + critMaxMult) / 2);
  }

  getPetTotalLevels() {
    return Object.keys(this.pets.levels).reduce((s, n) => s + this.pets.levels[n], 0);
    // return Object.values(this.pets.levels).reduce((a, b) => a + b, 0);
  }

  // PetModel.GetPetOfflineDPS()
  getPetOfflineDPS() {
    return this.getPlayerDamageWithAverageCrit() * this.getBonus(BonusType.PetDamage) * this.getBonus(BonusType.PetDamageMult) / ServerVarsModel.petAutoAttackDuration;
  }

  // PetModel.RefreshCurrentDamage()
  getPetDamage() {
    return this.getPlayerDamageWithAverageCrit() * this.getBonus(BonusType.PetDamage) * this.getBonus(BonusType.PetDamageMult);
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

  getHeroDamageMap() {
    var damages = {};
    for (var hero in this.heroes.levels) {
      var heroDamage = HeroInfo[hero].getBaseDamage(this.heroes.levels[hero]) *
                       this.getBonus(HeroInfo[hero].type) *
                       this.getBonus(BonusType.AllDamage) *
                       this.getBonus(BonusType.AllHelperDamage) *
                       (1 + this.getWeaponMultiplier(hero));
      damages[hero] = heroDamage;
    }
    return damages;
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
    var tapDPS = tps * this.getAverageDamageWithCrits();
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
      var baseBossHP = baseMonsterHP * ServerVarsModel.themeMultiplierSequence[i] * Math.min(2.5, Math.pow(ServerVarsModel.bossHPModBase, this.info.maxStage / 200));
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

  // MonsterModel.GetMonsterHP
  getMonsterHP(stage, mClass) {
    var num = this.getBaseMonsterHP(stage) * this.getBonus(BonusType.MonsterHP);
    if (mClass == MonsterClass.Boss && stage >= 1) {
      num = num * ServerVarsModel.themeMultiplierSequence[(stage - 1) % 5] * Math.min(2.5, Math.pow(ServerVarsModel.bossHPModBase, Math.floor(stageNum / 200)));
    }
    return num;
  }

  // TODO: refactor getMonsterGold/getBossGold with this or use this
  getMonsterGoldDrop(stage, mClass) {
    var num =
      (this.getMonsterHP(stage, mClass) * ServerVarsModel.monsterGoldMultiplier +
       ServerVarsModel.monsterGoldSlope * Math.min(stage, ServerVarsModel.noMoreMonsterGoldSlope)) *
      this.getBonus(BonusType.GoldAll);
    if (mClass == MonsterClass.Chesterson) {
      // BonusModel.GetChestersonMultiplier()
      num = num * ServerVarsModel.treasureGold * this.getBonus(BonusType.ChestAmount);
    } else if (mClass == MonsterClass.Boss) {
      num = num *
        Math.max(
          ServerVarsModel.maxBossGoldMultiplier,
          Math.min(
            1,
            Math.ceiling((stage - 5) / 5) * ServerVarsModel.bossGoldMultiplierSlope)) *
        this.getBonus(BonusType.GoldBoss);
    } else {
      num = num * this.getBonus(BonusType.GoldMonster);
    }
    if (num < 100) {
      num = Math.ceiling(num);
    }
    return Math.max(this.getBonus(BonusType.GoldAll), num);
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

  // InactiveGameplayModel.AdvanceStage()
  getOfflineGold(timeElapsed) {
    var d = this.calculateStageAdvance(timeElapsed);
    var baseOfflineGold = d["goldAccumulated"] * this.getBonus(BonusType.InactiveGold);
    var baseOfflineStage = d["targetStage"];
    var v = this.getMonsterGoldDrop(baseOfflineStage, MonsterClass.Normal) * ServerVarsModel.inactiveGoldMonsterCap;
    return Math.min(baseOfflineGold, v);
  }

  // MonsterModel.GetInactiveMonsterGoldDrop
  getInactiveMonsterGoldDrop(stageNum) {
    var monsterGoldDrop = this.getMonsterGoldDrop(stageNum, MonsterClass.Normal);

    var goldx10Chance = ServerVarsModel.goldx10Chance + this.getBonus(BonusType.Goldx10Chance);
    var goldx10Multiplier = ((goldx10Chance * 9) + 1);

    var chestersonChance = ServerVarsModel.chestersonChance + this.getBonus(BonusType.ChestChance);
    var chestersonMultiplier = ServerVarsModel.treasureGold * this.getBonus(BonusType.ChestAmount);

    var familyChance = ServerVarsModel.multiMonsterBaseChance + this.getBonus(BonusType.MultiMonster);
    var familyMultiplier = ((familyChance * 2.5) + 1);

    return monsterGoldDrop * goldx10Multiplier * (1.0 + chestersonChance * (chestersonMultiplier - 1.0)) * familyMultiplier;
  }

  // InactiveGameplayModel.CalculateStageAdvance - quality variable naming right here
  calculateStageAdvance(timeElapsed, startStage) {
    var timeLeft = timeElapsed;
    var currentStage = startStage;
    var stageProgress = 0;
    var goldAccumulated = 0;

    var totalDPS = this.getOfflineDPS();
    var offlineKillAnimationTime = ServerVarsModel.offlineKillAnimationTime;

    var bossTimer = 30 + this.getBonus(BonusType.BossTimer);
    var silentMarchStage = this.getBonus(BonusType.InactiveAdvance);
    if (silentMarchStage > ServerVarsModel.maxStage) {
      silentMarchStage = ServerVarsModel.maxStage;
    }
    var doubleDamageTimeLeft = doubleDamageTime;

    var canAdvance = true;
    while (timeLeft > 0) {
      var hasDoubleDamage = doubleDamageTimeLeft > 0;
      var dps = totalDPS * (!hasDoubleDamage ? 1 : 2);
      var monsterCount = this.getMonsterCount(currentStage);

      var timeToKillNormalMonster = this.getMonsterHP(currentStage, MonsterClass.Normal) / dps + offlineKillAnimationTime;
      var timeToKillBoss = this.getMonsterHP(currentStage, MonsterClass.Boss) / dps + offlineKillAnimationTime;

      var timeLeftForLoop = !hasDoubleDamage ? timeLeft : doubleDamageTimeLeft;
      if (canAdvance && activeTournament) {
        canAdvance = false;
      }
      if (canAdvance && currentStage >= silentMarchStage) {
        canAdvance = false;
      }

      var normalMonstersKilled = Math.floor(timeLeftForLoop / timeToKillNormalMonster);
      if (normalMonstersKilled <= 0)  {
        if (hasDoubleDamage) {
          doubleDamageTimeLeft = 0;
        } else {
          timeLeft = 0;
        }
      } else {
        if (canAdvance) {
          normalMonstersKilled = Math.min(normalMonstersKilled, monsterCount - stageProgress);
        }
        timeLeftForLoop -= normalMonstersKilled * timeToKillNormalMonster;
        timeLeft -= normalMonstersKilled * timeToKillNormalMonster;
        doubleDamageTimeLeft -= normalMonstersKilled * timeToKillNormalMonster;
        goldAccumulated += normalMonstersKilled * this.getInactiveMonsterGoldDrop(currentStage);
        stageProgress = Math.min(stageProgress + normalMonstersKilled, monsterCount);
        if (canAdvance && stageProgress < monsterCount) {
          if (hasDoubleDamage) {
            doubleDamageTimeLeft = 0;
            continue;
          }
          canAdvance = false;
        }
        if (canAdvance && (timeLeftForLoop < num12 || num12 >= bossTimer)) {
          if (hasDoubleDamage) {
            doubleDamageTimeLeft = 0;
            continue;
          }
          canAdvance = false;
        }
        if (canAdvance) {
          timeLeft -= timeToKillBoss;
          doubleDamageTimeLeft -= timeToKillBoss;
          goldAccumulated += this.getMonsterGoldDrop(currentStage, MonsterClass.Boss);
          currentStage++;
          stageProgress = 0;
        }
      }
    }
    return {
      goldAccumulated : goldAccumulated,
      targetStage : currentStage,
      killCount : stageProgress
    };
  }

  // StageLogic.AddSplashDamage
  // StageLogic.OnMonsterDeath

  // StageLogic.ApllySplashDamageOverKill [sic]
  getSplashGold(numSplashed, stage) {
    return numSplashed * this.getInactiveMonsterGoldDrop(stage);
  }

  // PrestigeModel.GetBonusRelicsFromStageCount
  getRelicsFromStage(stage) {
    var num = 0;
    if (stage > ServerVarsModel.relicFromStageBaseline) {
      num =
        ServerVarsModel.relicFromStageMult *
        Math.pow(
          ((stage - ServerVarsModel.relicFromStageBaseline) / ServerVarsModel.relicFromStageDivider),
          ServerVarsModel.relicFromStagePower);
    }
    return Math.max(0, num);
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
    saveJSON.ClanModel.clan ?
    {
      id: saveJSON.ClanModel.clan.clanID,
      name: saveJSON.ClanModel.clan.name,
      score: saveJSON.ClanModel.clan.score,
    } : { id: "", name: "", score: 0 },
  );
}