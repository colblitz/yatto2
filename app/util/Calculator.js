import { Hero, HeroInfo, printHeroLevels } from './Hero';
import { ArtifactInfo, nextArtifactCost, printArtifactLevels } from './Artifact';
import { GameState, getDiff } from './GameState';
import { getNextPlayerImprovement } from './PlayerImprovementBonus';
import { getNextHeroImprovement } from './HeroImprovementBonus';
import { ServerVarsModel } from './ServerVarsModel';
import { BonusType } from './BonusType';

function getMax(array, comparator) {
  var max = array[0];
  var maxIndex = 0;
  for (var i = 1; i < array.length; i++) {
    if (comparator(array[i], max)) {
      maxIndex = i;
      max = array[i];
    }
  }
  return max;
}

export const optimizationType = {
  AD     : 0,
  Gold   : 1,
  Pet    : 2,
  Tap    : 3,
  Hero   : 4,
  DmgE   : 5,
  RelicE : 6,
};

export const optimizationLabels = {
  AD     : "AD",
  Gold   : "Gold",
  Pet    : "Pet Dmg",
  Tap    : "Tap Dmg",
  Hero   : "Hero Dmg",
  DmgE   : "DmgE",
  RelicE : "RelicE",
}

var dmgE = optimizationType.DmgE;

function getValue(gamestate, settings) {
  gamestate.calculateBonuses();
  switch (settings.method) {
    case optimizationType.AD     : return gamestate.getBonus(BonusType.ArtifactDamage) * gamestate.getBonus(BonusType.HSArtifactDamage);
    case optimizationType.Gold   : return gamestate.getGoldMultiplier();
    case optimizationType.Pet    : return gamestate.getPetDamage();
    case optimizationType.Tap    : return gamestate.getAverageCritDamage();
    case optimizationType.Hero   : return gamestate.getHeroDamage();
    case optimizationType.DmgE   : return gamestate.getDamageEquivalent(settings.tps, settings.reload);
    case optimizationType.RelicE : return [gamestate.getDamageEquivalent(settings.tps, settings.reload), gamestate.getBonus(BonusType.PrestigeRelic)];
    default: return gamestate.getDamageEquivalent(settings.tps, settings.reload);
  }
}

function getEfficiency(newState, baseValue, cost, settings) {
  newState.calculateBonuses();
  switch (settings.method) {
    case optimizationType.RelicE :
      var dmgE = getValue(newState, settings)[0];
      var d = dmgE / baseValue[0];
      var a = ServerVarsModel.relicFromStageBaseline;
      var c = ServerVarsModel.relicFromStagePower;
      var s = settings.maxstage; // get stage
      var b = s > ServerVarsModel.monsterHPLevelOff ? ServerVarsModel.monsterHPBase2 : ServerVarsModel.monsterHPBase1;
      var prgd = Math.pow(1 + (Math.log(d) / Math.log(b)) / (s-a), c);   // % relic gain from d% gain
      var prga = newState.getBonus(BonusType.PrestigeRelic) / baseValue[1];
      var prg = prgd * prga;
      return (prg - 1) / cost;
    case optimizationType.AD     :
    case optimizationType.Gold   :
    case optimizationType.Pet    :
    case optimizationType.Tap    :
    case optimizationType.Hero   :
    case optimizationType.DmgE   :
    default:
      return (getValue(newState, settings) - baseValue) / cost;
  }
}

export function getGoldSteps(gamestate, gold, settings) {
  // The growth in swordmaster and hero damage comes from the improvement bonuses
  // swordmaster:
  //   level * improvement * constants * bonuses
  // heroes:
  //   cost * level * improvement * constants * bonuses
  // Given this, the only meaningful jumps in damage come from these improvement breakpoints
  // Given that, greedy knapsack should basically be an approximation of optimal damage given gold

  var currentState = gamestate.getCopy();
  var goldLeft = gold;
  while (goldLeft > 0) {
    var options = [];

    // get base values
    var baseValue = getValue(currentState, settings);

    // swordmaster option
    var newState = currentState.getCopy();
    var oLevel = newState.swordmaster.level;
    var nLevel = getNextPlayerImprovement(oLevel);
    var cost = newState.getPlayerUpgradeCost(oLevel, nLevel);

    if (cost < goldLeft) {
      newState.swordmaster.level = nLevel;
      options.push({
        text: "swordmaster to " + nLevel,
        result: newState,
        resultCost: cost,
        efficiency: getEfficiency(newState, baseValue, cost, settings),
      });
    }

    for (var hero in HeroInfo) {
      // heroes that can be bought
      if (!(hero in currentState.heroes.levels) && HeroInfo[hero].cost < goldLeft) {
        var newHState = currentState.getCopy();
        newHState.heroes.levels[hero] = 1;
        options.push({
          text: "buying " + hero,
          result: newHState,
          resultCost: HeroInfo[hero].cost,
          efficiency: getEfficiency(newHState, baseValue, HeroInfo[hero].cost, settings),
        });
      // heroes that can be leveled
      } else if (hero in currentState.heroes.levels) {
        var newHState = currentState.getCopy();
        var oHLevel = newHState.heroes.levels[hero];
        var nHLevel = getNextHeroImprovement(oHLevel);
        // TODO: this doesn't include skills
        var costH = HeroInfo[hero].getCostToLevelFromTo(oHLevel, nHLevel);

        if (costH < goldLeft) {
          newHState.heroes.levels[hero] = nHLevel;
          options.push({
            text: "hero " + hero + " to " + nHLevel,
            result: newHState,
            resultCost: costH,
            efficiency: getEfficiency(newHState, baseValue, costH, settings),
          });
        }
      }
    }

    // get max efficiency
    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });
      currentState = bestOption.result;
      goldLeft -= bestOption.resultCost;
    } else {
      goldLeft = 0;
      break;
    }
  } // end while

  return currentState;
}

function getOverallEfficiency(startState, artifact, costToBuy, bestLevelArtifact, settings) {
  // initialize stuff
  console.log("get overall efficiency for ", artifact, ArtifactInfo[artifact].name);
  var newSettings = Object.assign({}, settings, {reload: true});
  var newState = startState.getCopy();

  function getEfficiencyAtLevel(a, baseValue) {
    newState.artifacts[a] += 1;
    var currentCost = ArtifactInfo[a].getCostToLevelUp(newState.artifacts[a] - 1);
    var efficiency = getEfficiency(newState, baseValue, currentCost, newSettings);
    newState.artifacts[a] -= 1;
    return efficiency;
  }

  function isBestLevelEfficiency(cLevel) {
    // console.log("checking is best efficiency at level: ", cLevel);
    newState.artifacts[artifact] = cLevel;
    var options = [];
    var baseValue = getValue(newState, newSettings);

    var thisEfficiency = getEfficiencyAtLevel(artifact, baseValue);
    var bestEfficiency = getEfficiencyAtLevel(bestLevelArtifact, baseValue);
    return thisEfficiency >= bestEfficiency;



    // for (var a in newState.artifacts) {
    //   if (ArtifactInfo[a].canLevel(newState.artifacts[a])) {
    //     var copyState = newState.getCopy();
    //     var cost = ArtifactInfo[a].getCostToLevelUp(copyState.artifacts[a]);

    //     copyState.artifacts[a] += 1;
    //     options.push({
    //       artifact: a,
    //       efficiency: getEfficiency(copyState, baseValue, cost, settings),
    //     });
    //     if (a == artifact) {
    //       aEfficiency = getEfficiency(copyState, baseValue, cost, settings);
    //     }
    //   }
    // }

    // var bestOption = getMax(options, function(o1, o2) {
    //   return o1.efficiency > o2.efficiency;
    // });
    // var isBest = bestOption.artifact == artifact;
    // console.log("isBest: ", isBest, "best: ", ArtifactInfo[bestOption.artifact].name);
    // return bestOption.artifact == artifact;
  }

  // console.log("get base to save");
  var baseDamageEquivalent = getValue(newState, newSettings);

  // isBestLevelEfficiency(0);

  var levelUpper = 1;
  var levelLower = 1;
  newState.artifacts[artifact] = 1;

  console.log("before first while");
  // var currentEfficiency = getEfficiencyAtLevel(levelUpper);
  while (isBestLevelEfficiency(levelUpper)) {
    console.log(levelLower, levelUpper);
    levelLower = levelUpper;
    levelUpper *= 2;
    // currentEfficiency = getEfficiencyAtLevel(levelUpper);
  }


  console.log("before second while: ", levelLower, levelUpper);
  while ((levelUpper - levelLower) > 1) {
    console.log("before: ", levelLower, levelUpper);
    var levelHalfway = (levelUpper + levelLower) / 2
    // currentEfficiency = getEfficiencyAtLevel(levelHalfway);

    if (isBestLevelEfficiency(levelHalfway)) {
      levelLower = levelHalfway;
    } else {
      levelUpper = levelHalfway;
    }
    // } else if (currentEfficiency < bestLevelEfficiency) {
    //   levelUpper = levelHalfway;
    // } else if (currentEfficiency == bestLevelEfficiency) {
    //   levelLower = levelHalfway;
    //   levelUpper = levelHalfway;
    // }
    console.log("after : ", levelLower, levelUpper);
  }

  // console.log("returning");
  var shouldLevelTo = levelLower;
  var totalCost = ArtifactInfo[artifact].getCostToLevelFromTo(1, shouldLevelTo) + costToBuy;

  // console.log("shouldLevelTo: ", shouldLevelTo);
  // console.log("totalCost: ", totalCost);
  newState.artifacts[artifact] = shouldLevelTo;
  return getEfficiency(newState, baseDamageEquivalent, totalCost, newSettings);



  // var totalCost = 0;
  // var currentLevel = 1;
  // newState.artifacts[artifact] = 1;

  // // get starting state, save for later
  // var baseDamageEquivalent = getValue(newState, newSettings);
  // var savedBasedDamageEquivalent = baseDamageEquivalent;

  // // find cost -> find efficiency for next upgrade
  // var currentCost = ArtifactInfo[artifact].getCostToLevelUp(currentLevel);
  // newState.artifacts[artifact] = ++currentLevel;
  // totalCost += currentCost;
  // var currentDmgEquivalent = getValue(newState, newSettings);
  // var currentEfficiency = getEfficiency(newState, baseDamageEquivalent, currentCost, newSettings);
  // baseDamageEquivalent = currentDmgEquivalent;

  // // loop while upgrade efficiency better than leveling
  // while (currentEfficiency > bestLevelEfficiency && ArtifactInfo[artifact].canLevel(currentLevel)) {
  //   currentCost = ArtifactInfo[artifact].getCostToLevelUp(currentLevel);
  //   console.log("c vs b at ", currentLevel, " for ", currentCost, ": ", currentEfficiency, " | ", bestLevelEfficiency);
  //   newState.artifacts[artifact] = ++currentLevel;
  //   totalCost += currentCost;
  //   currentDmgEquivalent = getValue(newState, newSettings);
  //   currentEfficiency = getEfficiency(newState, baseDamageEquivalent, currentCost, newSettings);
  //   baseDamageEquivalent = currentDmgEquivalent;
  // }

  // // "undo" the latest levelup
  // var canLevelTo = currentLevel - 1;
  // totalCost -= currentCost;
  // newState.artifacts[artifact] = canLevelTo;
  // totalCost += costToBuy;
  // return getEfficiency(newState, savedBasedDamageEquivalent, totalCost, newSettings);
}

export function getRelicSteps(gamestate, settings, progressCallback) {
  // var t0 = performance.now();
  // ASSUMPTION: SM/heroes are already optimal and won't change

  var currentState = gamestate.getCopy();
  console.log("starting state");
  console.log(currentState);

  var relicsLeft = settings.relics;
  var shouldBuy = false;
  var steps = [];
  var totalSpent = 0;

  while ((settings.limittype == 0 && relicsLeft > 0) ||
         (settings.limittype == 1 && steps.length < settings.steps)) {
    console.log("start of loop");
    var options = [];

    // get base values
    var baseValue = getValue(currentState, settings);

    for (var artifact in currentState.artifacts) {
      if (ArtifactInfo[artifact].canLevel(currentState.artifacts[artifact])) {
        var newState = currentState.getCopy();
        var cost = ArtifactInfo[artifact].getCostToLevelUp(newState.artifacts[artifact]);
        if ((settings.useAll && cost < relicsLeft) || !settings.useAll || settings.limittypes == 1) {
          newState.artifacts[artifact] += 1;
          options.push({
            artifact: artifact,
            levelTo: newState.artifacts[artifact],
            result: newState,
            cost: cost,
            efficiency: getEfficiency(newState, baseValue, cost, settings),
          });
        }
      }
    }

    console.log("done calculating level efficiencies");

    var costToBuy = nextArtifactCost(Object.keys(currentState.artifacts).length);
    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });
      var bestLevelArtifact = bestOption.artifact;
      // var bestLevelEfficiency = bestOption.efficiency;

      // if we can buy an artifact, then for each artifact that we don't own, simulate buying and then
      // leveling it up until the next level-up efficiency is lower than the best level up efficiency
      // of the previously owned artifacts, then get the overall efficiency with the costToBuy factored in.
      // Then take the average of all these overall efficiencies to get a "buy" efficiency
      // console.log("cost to buy: " + costToBuy + ", relicsLeft: " + relicsLeft);
      if ((settings.useAll && costToBuy < relicsLeft) || !settings.useAll || settings.limittypes == 1) {
        var overallEfficiencies = [];
        for (var artifact in ArtifactInfo) {
          if (!(artifact in currentState.artifacts) || currentState.artifacts[artifact] == 0) {
            overallEfficiencies.push(getOverallEfficiency(currentState, artifact, costToBuy, bestLevelArtifact, settings));
          }
        }
        var averageOverallEfficiency = overallEfficiencies.reduce(function(a, b) { return a + b; }, 0) / overallEfficiencies.length;
        options.push({
          cost: costToBuy,
          efficiency: averageOverallEfficiency,
        });
      }
    } else if ((settings.useAll && costToBuy < relicsLeft) || !settings.useAll || settings.limittypes == 1) {
      // only option is to buy another artifact
      console.log("only option is to buy another artifact");
      options.push({
        cost: costToBuy,
        efficiency: 0,
      });
    } else {
      console.log("no options");
      // no options - go prestige more
      relicsLeft = 0;
      break;
    }

    console.log("got options: " + options.length);

    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });

      if (!settings.useAll && bestOption.cost > relicsLeft) {
        break;
      }

      if (!(bestOption.result)) {
        // best option is to buy an artifact - terminate
        shouldBuy = true;
        relicsLeft = 0;

        totalSpent += costToBuy;
        steps.push({
          buy: true,
          cost: bestOption.cost,
          total: totalSpent,
        });

        break;
      } else {
        totalSpent += bestOption.cost;
        steps.push({
          buy: false,
          artifact: bestOption.artifact,
          levelTo: bestOption.levelTo,
          cost: bestOption.cost,
          total: totalSpent,
        });
      }
      currentState = bestOption.result;
      relicsLeft -= bestOption.cost;

      console.log("lkjalskjdlkjf");

      if (settings.limittype == 1) {
        console.log("steps.length / settings.steps: ", steps.length / settings.steps);
        progressCallback(steps.length / settings.steps);
      } else {
        console.log("totalSpent / settings.relics: ", totalSpent / settings.relics);
        progressCallback(totalSpent / settings.relics);
      }
    } else {
      console.log("no options");
      relicsLeft = 0;
      break;
    }
  } // end while


  console.log("done with lkajsdf");
  // var t1 = performance.now();
  // console.log("took: " + (t1-t0) + " milliseconds for " + settings.relics);

  var summary = {};
  var summarySteps = [];

  for (var step of steps) {
    if (!step.buy) {
      if (!(step.artifact in summary)) {
        summary[step.artifact] = {
          cost: 0
        }
      }
      var ss = summary[step.artifact];
      ss["levelTo"] = step.levelTo;
      ss["cost"] += step.cost;
    } else {
      summarySteps.push({
        buy: true,
        cost: step.cost
      });
    }
  }

  for (var artifact in summary) {
    summarySteps.push({
      artifact: artifact,
      levelTo: summary[artifact].levelTo,
      cost: summary[artifact].cost
    });
  }

  console.log("returning");

  return {
    steps,
    summarySteps
  };
}