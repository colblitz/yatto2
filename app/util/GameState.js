import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { Equipment, EquipmentInfo, eCategoryToBoostBonus } from './Equipment';
import { Skill, SkillInfo } from './Skill';
import { getHeroImprovementBonus, getHeroCurrentA } from './HeroImprovementBonus';
import { getPlayerImprovementBonus, getPlayerCurrentA } from './PlayerImprovementBonus';
import { ServerVarsModel } from './ServerVarsModel';
import { BonusType, addBonus, getBonus, printBonuses } from './BonusType';
import { getHeroName, getPetName, getSkillName } from './Localization';
var BigNumber = require('bignumber.js');

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

  getAsRedditString() {
    var s = "";
    function addToRedditString(field, value) {
      if (value) {
        s += field + ": " + value + "\n\n";
      }
    }

    function addRow(field, value) {
      if (value) {
        s += field + " | " + value + "\n";
      }
    }

    addToRedditString("Username", this.info.displayName);
    if (this.clan.name) {
      s += "Clan (CQ): " + this.clan.name + " (" + this.clan.score + ")";
      s += "\n\n";
    }

    // Stats
    if (this.info.numPrestiges) {
      s += "All-time statistics|Value\n";
      s += "--|--\n";
      addRow("Tap Count", this.info.tapCount);
      addRow("Tournament Count", this.info.numTournaments);
      addRow("Prestige Count", this.info.numPrestiges);
      addRow("Total Skill Points", this.info.totalSkillPoints);
      addRow("Equipment Collected", this.info.equipCollected);
      addRow("Total Time Played", this.info.totalActiveGameTime);
      s += "\n\n";
    }

    // Artifacts
    if (this.artifacts) {
      var aRow = function(aList, aid) {
        return ArtifactInfo[aid].name + " | " + (aList[aid] || 0);
      }
      var blank = function() {
        return " | ";
      }
      var getRow = function(aList, a1, a2, a3) {
        return (a1 == 0 ? blank() : aRow(aList, "Artifact" + a1)) + " | " +
               (a2 == 0 ? blank() : aRow(aList, "Artifact" + a2)) + " | " +
               (a3 == 0 ? blank() : aRow(aList, "Artifact" + a3)) + "\n";
      }
      s += "Artifact|Level|Artifact|Level|Artifact|Level\n";
      s += "--|--|--|--|--|--\n";
      s += getRow(this.artifacts, 22, 7, 6);
      s += getRow(this.artifacts, 0, 14, 12);
      s += getRow(this.artifacts, 35, 3, 8);
      s += getRow(this.artifacts, 32, 0, 0);
      s += getRow(this.artifacts, 33, 9, 10);
      s += getRow(this.artifacts, 34, 15, 16);
      s += getRow(this.artifacts, 0, 39, 37);
      s += getRow(this.artifacts, 26, 0, 0);
      s += getRow(this.artifacts, 29, 20, 11);
      s += getRow(this.artifacts, 31, 1, 36);
      s += getRow(this.artifacts, 38, 2, 0);
      s += getRow(this.artifacts, 0, 0, 13);
      s += getRow(this.artifacts, 17, 18, 27);
      s += getRow(this.artifacts, 23, 19, 0);
      s += getRow(this.artifacts, 25, 21, 4);
      s += getRow(this.artifacts, 28, 24, 5);
      s += "\n\n";
    }

    // Equipment
    if (this.equipment) {
      s += "Equipment | Bonus\n";
      s += "--|--\n";
      var e4 = this.getEquippedEquipmentString(4);
      if (e4) { s += "Weapon | " + e4 + "\n"; }
      var e1 = this.getEquippedEquipmentString(1);
      if (e1) { s += "Hat | " + e1 + "\n"; }
      var e3 = this.getEquippedEquipmentString(3);
      if (e3) { s += "Suit | " + e3 + "\n"; }
      var e0 = this.getEquippedEquipmentString(0);
      if (e0) { s += "Aura | " + e0 + "\n"; }
      var e2 = this.getEquippedEquipmentString(2);
      if (e2) { s += "Slash | " + e2 + "\n"; }
      s += "\n\n";
    }

    // Skills
    if (this.skills) {
      var skillL = function(sList, sid) {
        return getSkillName(sid) + " | " + (sList[sid] || 0);
      }
      var skillR = function(sList, sid) {
        return (sList[sid] || 0) + " | " + getSkillName(sid);
      }
      var blank = function() {
        return " | ";
      }
      var getRow = function(sList, s1, s2, s3, s4, s5, s6) {
        console.log("asdfasdf");
        console.log(s1, s2, s3, s4, s5, s6);
        return (s1 === "" ? blank() : skillL(sList, s1)) + " | " +
               (s2 === "" ? blank() : skillR(sList, s2)) + " | " + blank() +
               (s3 === "" ? blank() : skillL(sList, s3)) + " | " +
               (s4 === "" ? blank() : skillR(sList, s4)) + " | " + blank() +
               (s5 === "" ? blank() : skillL(sList, s5)) + " | " +
               (s6 === "" ? blank() : skillR(sList, s6)) + "\n";
      }
      s += "Skill | Value | Value | Skill | Sep | Skill | Value | Value | Skill | Sep | Skill | Value | Value | Skill\n";
      s += "--|--|--|--|--|--|--|--|--|--|--|--|--|--\n";
      s += getRow(this.skills, "PetQTE", "", "", "OfflineGold", "", "BurstSkillBoost");
      s += getRow(this.skills, "PetGoldQTE", "BossDmgQTE", "PetDmg", "MeleeHelperDmg", "MPRegenBoost", "FireTapSkillBoost");
      s += getRow(this.skills, "", "", "LessMonsters", "SpellHelperDmg", "MPCapacityBoost", "HelperDmgSkillBoost");
      s += getRow(this.skills, "HelperDmgQTE", "Fairy", "SplashDmg", "RangedHelperDmg", "ManaStealSkillBoost", "MidasSkillBoost");
      s += getRow(this.skills, "HelperCountQTE", "BossTimer", "AutoAdvance", "MultiMonsters", "CloneSkillBoost", "CritSkillBoost");
      s += getRow(this.skills, "ClanQTE", "", "PetOfflineDmg", "", "ManaMonster", "");
      s += "\n\n";
    }

    // Pets
    if (this.pets) {
      var pRow = function(pList, pid) {
        return getPetName(pid) + " | " + (pList.levels[pid] || 0);
      }
      var getRow = function(pList, p1, p2, p3, p4) {
        return pRow(pList, "Pet" + p1) + " | " +
               pRow(pList, "Pet" + p2) + " | " +
               pRow(pList, "Pet" + p3) + " | " +
               pRow(pList, "Pet" + p4) + "\n";
      }
      s += "Pet | Level | Pet | Level | Pet | Level | Pet | Level\n";
      s += "--|--|--|--|--|--|--|--\n";
      s += getRow(this.pets, 1, 2, 3, 4);
      s += getRow(this.pets, 5, 6, 7, 8);
      s += getRow(this.pets, 9, 10, 11, 12);
      s += getRow(this.pets, 13, 14, 15, 16);
      s += "\n\n";
    }

    // Heroes
    if (this.heroes) {
      var hRow = function(hList, hid) {
        return getHeroName(hid) + " | " + (hList.levels[hid] || 0) + " | " + (hList.weapons[hid] || 0);
      }
      var getRow = function(hList, h1, h2) {
        return hRow(hList, "H" + h1) + " | " +
               hRow(hList, "H" + h2) + "\n";
      }
      s += "Hero | Level | Weapons | Hero | Level | Weapons\n";
      s += "--|--|--|--|--|--\n";
      s += getRow(this.heroes, "18", "29");
      s += getRow(this.heroes, "01", "12");
      s += getRow(this.heroes, "21", "23");
      s += getRow(this.heroes, "02", "30");
      s += getRow(this.heroes, "06", "11");
      s += getRow(this.heroes, "24", "07");
      s += getRow(this.heroes, "08", "32");
      s += getRow(this.heroes, "26", "31");
      s += getRow(this.heroes, "09", "34");
      s += getRow(this.heroes, "04", "15");
      s += getRow(this.heroes, "20", "17");
      s += getRow(this.heroes, "10", "28");
      s += getRow(this.heroes, "03", "37");
      s += getRow(this.heroes, "25", "35");
      s += getRow(this.heroes, "27", "16");
      s += getRow(this.heroes, "22", "33");
      s += getRow(this.heroes, "05", "14");
      s += getRow(this.heroes, "13", "36");
      s += hRow(this.heroes, "H19") + " | | | \n";
      s += "\n\n";
    }

    return s;
  }

  printStats() {
    this.calculateBonuses();
    printBonuses(this.bonuses);
    console.log("base tap damage: " + this.getBaseTapDamage());
    console.log("average crit damage: " + this.getAverageDamageWithCrits());
    console.log("pet damage: " + this.getPetDamage());
    console.log("hero damage: " + this.getHeroDamage());
  }

  getEquippedEquipmentString(category) {
    for (var equip in this.equipment) {
      if (this.equipment[equip].equipped && EquipmentInfo[equip].category == category) {
        var boost = getBonus(this.bonuses, eCategoryToBoostBonus[EquipmentInfo[equip].category]);
        return EquipmentInfo[equip].getBonusString(this.equipment[equip].level, boost);
      }
    }
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

    // HelperModel.RefreshHelperWeaponSet
    addBonus(allBonuses, BonusType.AllDamage, this.getWeaponSets() * 10);

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

  getWeaponSets() {
    var weapons = Object.keys(this.heroes.weapons).map((k) => this.heroes.weapons[k]);
    if (weapons.length == 0) {
      return 0;
    } else {
      return Math.min.apply(null, weapons);
    }
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

    var L = this.getTopDamageHeroLevel();

    var br = new BigNumber(r.toFixed(15));
    var b1 = new BigNumber(1);
    var bg = new BigNumber(goldM.toFixed(15));
    // https://www.reddit.com/r/TapTitans2/comments/668gdl/math_deriving_a_gold_to_damage_multiplier_formula/
    var extraLevels = Math.log(bg.minus(1).times(b1.minus(br.pow(-L))).plus(1).toNumber()) / Math.log(r);

    // var extraLevels = Math.log(1 + goldM - goldM/r) / Math.log(r);
    var a = getHeroCurrentA(L) * skew + getPlayerCurrentA(this.swordmaster.level)  * (1 - skew);

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
      displayName         : saveJSON.AccountModel.displayName.$content,
      countryCode         : saveJSON.AccountModel.countryCode.$content,
      tapCount            : saveJSON.AchievementModel.TapCountprogress.$content,
      numTournaments      : saveJSON.AchievementModel.ParticipatedTournamentprogress.$content,
      equipCollected      : saveJSON.AchievementModel.EquipmentCollectedprogress.$content,
      numPrestiges        : saveJSON.AchievementModel.PrestigeCountprogress.$content,
      totalSkillPoints    : saveJSON.AchievementModel.TotalSkillPointsprogress.$content,
      numWeapons          : saveJSON.AchievementModel.Weaponsprogress.$content,
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