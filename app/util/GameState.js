import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { Equipment, EquipmentInfo } from './Equipment';
import { Skill, SkillInfo } from './Skill';
import { getHeroImprovementBonus } from './HeroImprovementBonus';
import { getPlayerImprovementBonus } from './PlayerImprovementBonus';
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
    "equipped": "Pet13",
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
    // dafuq... ArtifactModel.ApplyAllArtifactBonuses
    addBonus(allBonuses, BonusType.AllDamage, getBonus(allBonuses, BonusType.ArtifactDamage));

    for (var hero in this.heroes.levels) {
      HeroInfo[hero].getAllBonuses(this.heroes.levels[hero], allBonuses);
    }

    for (var equip in this.equipment) {
      if (this.equipment[equip].equipped) {
        EquipmentInfo[equip].getBonus(this.equipment[equip].level, allBonuses);
      }
    }

    for (var pet in this.pets.levels) {
      if (pet === this.pets.equipped) {
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

    addBonus(allBonuses, BonusType.AllDamage, Math.pow(ServerVarsModel.clanBonusBase, this.clan.score));
    addBonus(allBonuses, BonusType.Memory, Math.min(ServerVarsModel.maxMemoryAmount, ServerVarsModel.clanMemoryBase * this.clan.score));

    return allBonuses;
  }

  getBonus(bonusType) {
    return getBonus(this.bonuses, bonusType);
  }

  getMaxPlayerUpgrades(cLevel, gold) {
    var d = gold * (ServerVarsModel.playerUpgradeCostGrowth - 1) / ServerVarsModel.playerUpgradeCostBase + Math.pow(ServerVarsModel.playerUpgradeCostGrowth, cLevel);
    return Math.floor(Math.log(d) / Math.log(ServerVarsModel.playerUpgradeCostGrowth) - cLevel);
  }

  getMaxHeroUpgrades(hero, cLevel, gold) {
    var num = 1 - this.getBonus(BonusType.HelperUpgradeCost);
    return Math.floor(Math.log(gold * (ServerVarsModel.helperUpgradeBase - 1) / (num * hero.cost * Math.pow(ServerVarsModel.helperUpgradeBase, cLevel)) + 1) / Math.log(ServerVarsModel.helperUpgradeBase));
  }

  getPlayerUpgradeCost(sLevel, eLevel) {
    return ServerVarsModel.playerUpgradeCostBase *
           (Math.pow(ServerVarsModel.playerUpgradeCostGrowth, eLevel) -
            Math.pow(ServerVarsModel.playerUpgradeCostGrowth, sLevel)) /
           (ServerVarsModel.playerUpgradeCostGrowth - 1);
  }

  // getGoldEquivalence() {
  //   // get optimal tap/hero gold distribution
  //   // cost = 1.082 for hero, 1.062 for player
  //   var monsterGold = getAverageMonsterGold();

  //   var tempSwordMaster = this.getMaxPlayerUpgrades(1, monsterGold);
  //   var tempHeroLevels = Object.assign({}, this.heroes.levels);
  //   for (var hero in tempHeroLevels) {
  //     tempHeroLevels[hero] = this.getMaxHeroUpgrades(HeroInfo[hero], 1, monsterGold);
  //   }

  //   // save values
  //   var oldSwordMaster = this.swordmaster.level;
  //   var oldHeroLevels = Object.assign({}, this.heroes.levels);

  //   this.swordmaster.level = tempSwordMaster;
  //   this.heroes.levels = tempHeroLevels;

  //   var tapDPS = this.getAverageCritDamage();
  //   var heroDPS = this.getHeroDamage();

  //   this.swordmaster.level = oldSwordMaster;
  //   this.heroes.levels = oldHeroLevels;

  //   // get proportion of tap/hero damage
  //   // get current cost/damage conversion

  // }


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

  getAverageCritDamage() {
    var critChance = Math.min(ServerVarsModel.maxCritChance, ServerVarsModel.playerCritChance + this.getBonus(BonusType.CritChance));
    var critMinMult = ServerVarsModel.playerCritMinMult * this.getBonus(BonusType.CritDamage);
    var critMaxMult = ServerVarsModel.playerCritMaxMult * this.getBonus(BonusType.CritDamage);
    return this.getBaseTapDamage() * (1 + critChance * (critMinMult + critMaxMult) / 2);
  }

  getPetTotalLevels() {
    return Object.values(this.pets.levels).reduce((a, b) => a + b);
  }

  getPetDamage() {
    return this.getAverageCritDamage() * this.getBonus(BonusType.PetDamage) * this.getBonus(BonusType.PetDamageMult);
  }

  getWeaponMultiplier(hero) {
    if (hero in this.heroes.weapons) {
      return this.heroes.weapons[hero] * 0.5;
    }
    return 0;
  }

  getHeroDamage() {
    var allHeroDamage = 0;
    var maxHeroDamage = 0;
    var maxHeroLevel = 0;
    for (var hero in this.heroes.levels) {
      var heroDamage = HeroInfo[hero].getBaseDamage(this.heroes.levels[hero]) *
                       this.getBonus(HeroInfo[hero].type) *
                       this.getBonus(BonusType.AllDamage) *
                       this.getBonus(BonusType.AllHelperDamage) *
                       (1 + this.getWeaponMultiplier(hero));
      if (heroDamage > maxHeroDamage) {
        maxHeroDamage = heroDamage;
        maxHeroLevel = this.heroes.levels[hero];
      }
      allHeroDamage += heroDamage;
    }
    return allHeroDamage;
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

  getGoldMultiplier() {
    return this.getAverageMonsterGold();
  }

  getDamageEquivalent(tps) {
    if (!this.bonuses) {
      this.calculateBonuses();
    }
    // TODO: lol
    return Math.pow(1.05, (Math.log(this.getGoldMultiplier()) / Math.log(1.072))) * this.getDPS(tps);
  }

  getMonsterCount(stage) {
    return Math.max(
      1,
      Math.min(
        ServerVarsModel.maxMonsterCount,
        ServerVarsModel.monsterCountBase + Math.floor(stage / 1000) * ServerVarsModel.monsterCountInc) -
      this.getBonus(BonusType.MonsterCountPerStage));
  }

  getAverageMonsterHPUnits() {
    // Average hp across five stages:
    // # of monsters                                  + boss
    // base^0 + base^0 + base^0 + base^0 + base^0 ... + 2*base^0
    // base^1 + base^1 + base^1 + base^1 + base^1 ... + 3*base^1
    // base^2 + base^2 + base^2 + base^2 + base^2 ... + 4*base^2
    // base^3 + base^3 + base^3 + base^3 + base^3 ... + 5*base^3
    // base^4 + base^4 + base^4 + base^4 + base^4 ... + 8*base^4
    var monsterCount = this.getMonsterCount(this.info.maxStage);
    var hpBase = this.info.maxStage > ServerVarsModel.monsterHPLevelOff ? ServerVarsModel.monsterHPBase1 : ServerVarsModel.monsterHPBase2;
    var totalHPUnits = 0;
    for (var i of [0, 1, 2, 3, 4]) {
      totalHPUnits += Math.pow(hpBase, i) * (monsterCount + ServerVarsModel.themeMultiplierSequence[i]);
    }
    var averageHPUnits = totalHPUnits / ((monsterCount + 1) * 5);
    return averageHPUnits;
  }

  getAverageMonsterGold() {
    var monsterCount = this.getMonsterCount(this.info.maxStage);

    // TODO: check that this got fixed in-game
    var base = (this.getAverageMonsterHPUnits() * this.getBonus(BonusType.MonsterHP) * ServerVarsModel.monsterGoldMultiplier +
               (ServerVarsModel.monsterGoldSlope * Math.min(this.info.maxStage, ServerVarsModel.noMoreMonsterGoldSlope))) *
              this.getBonus(BonusType.GoldAll);

    // goldx10Chance of the time, you get x10
    // (1 - goldx10Chance) of the time, you get x1
    var goldx10Chance = ServerVarsModel.goldx10Chance + this.getBonus(BonusType.Goldx10Chance);
    var goldx10Multiplier = ((goldx10Chance * 9) + 1);

    // 1 / (monsterCount + 1) of the time, it's a boss
    var bossChance = (1 / (monsterCount + 1));
    var bossMultiplier =
      Math.max(
        ServerVarsModel.maxBossGoldMultiplier,
        Math.min(
          1.0,
          Math.ceil((this.info.maxStage - 5) / 5) * ServerVarsModel.bossGoldMultiplierSlope)) *
      this.getBonus(BonusType.GoldBoss);

    // (1 - bossChance) * chestersonChance of the time, it's a chesterson
    // (1 - bossChance)  * (1 - chestersonChance) of the time, it's a normal
    var nonBossChance = 1 - bossChance;

    var chestersonChance = ServerVarsModel.chestersonChance + this.getBonus(BonusType.ChestChance);
    var chestersonMultiplier = ServerVarsModel.treasureGold * this.getBonus(BonusType.ChestAmount);

    var monsterChance = 1 - chestersonChance;
    var monsterMultiplier = this.getBonus(BonusType.GoldMonster);

    // familyChance of the non-boss time, you get x[2, 5]
    // (1 - familyChance) of the non-boss time, you get x1
    var familyChance = ServerVarsModel.multiMonsterBaseChance + this.getBonus(BonusType.MultiMonster);
    var familyMultiplier = ((familyChance * 2.5) + 1);

    // base * goldx10Multiplier * (bossChance * bossMultiplier)
    //                             +
    //                            (monsterChance * (1 - chestersonChance) * monsterMultiplier * familyMultiplier)
    //                             +
    //                            (monsterChance * chestersonChance * chestersonMultiplier * familyMultiplier)
    var nonBossMultiplier = familyMultiplier * (chestersonChance * chestersonMultiplier + monsterChance * monsterMultiplier);
    return base * goldx10Multiplier * (bossChance * bossMultiplier + nonBossChance * nonBossMultiplier);
  }
}

// For swordmaster levels, hero levels, artifact levels
export function getDiff(g1, g2) {
  var outcome = {};
  var changes = {};
  if (g1.swordmaster.level != g2.swordmaster.level) {
    outcome["swordmaster"] = g2.swordmaster.level;
    changes["swordmaster"] = g2.swordmaster.level - g1.swordmaster.level;
  }
  for (var hero in g2.heroes.levels) {
    var newLevel = g2.heroes.levels[hero];
    if (newLevel != g1.heroes.levels[hero]) {
      outcome[hero] = newLevel;
      changes[hero] = newLevel - g1.heroes.levels[hero];
    }
  }
  for (var artifact in g2.artifacts) {
    var newLevel = g2.artifacts[artifact];
    if (newLevel != g1.artifacts[artifact]) {
      outcome[artifact] = newLevel;
      changes[artifact] = newLevel - g1.artifacts[artifact];
    }
  }
  return {
    outcome: outcome,
    changes: changes
  };
}

export function fromSaveFile(saveJSON) {
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
      maxStage            : saveJSON.PrestigeModel.maxPrestigeStageCount.$content,
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
      equipped: saveJSON.PetModel.currentPet.$content,
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