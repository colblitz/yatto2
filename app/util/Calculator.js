import { Hero, HeroInfo, printHeroLevels } from './Hero';
import { ArtifactInfo, nextArtifactCost, printArtifactLevels } from './Artifact';
import { GameState, getDiff } from './GameState';
import { getNextPlayerImprovement } from './PlayerImprovementBonus';
import { getNextHeroImprovement } from './HeroImprovementBonus';

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

export function getGoldSteps(gamestate, gold, tps = 15) {
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
    var baseValue = currentState.getDamageEquivalent(tps);

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
        efficiency: (newState.getDamageEquivalent(tps) - baseValue) / cost,
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
          efficiency: (newHState.getDamageEquivalent(tps) - baseValue) / HeroInfo[hero].cost,
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
            efficiency: (newHState.getDamageEquivalent(tps) - baseValue) / costH,
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

function getOverallEfficiency(startState, artifact, costToBuy, bestLevelEfficiency, tps) {
  // initialize stuff
  var newState = startState.getCopy();
  var totalCost = 0;
  var currentLevel = 1;
  newState.artifacts[artifact] = 1;

  // get starting state, save for later
  var baseDamageEquivalent = newState.getDamageEquivalent(tps, true);
  var savedBasedDamageEquivalent = baseDamageEquivalent;

  // find cost -> find efficiency for next upgrade
  var currentCost = ArtifactInfo[artifact].getCostToLevelUp(currentLevel);
  newState.artifacts[artifact] = ++currentLevel;
  totalCost += currentCost;
  var currentDmgEquivalent = newState.getDamageEquivalent(tps, true);
  var currentEfficiency = (currentDmgEquivalent - baseDamageEquivalent) / currentCost;
  baseDamageEquivalent = currentDmgEquivalent;

  // loop while upgrade efficiency better than leveling
  while (currentEfficiency > bestLevelEfficiency && ArtifactInfo[artifact].canLevel(currentLevel)) {
    currentCost = ArtifactInfo[artifact].getCostToLevelUp(currentLevel);
    newState.artifacts[artifact] = ++currentLevel;
    totalCost += currentCost;
    currentDmgEquivalent = newState.getDamageEquivalent(tps, true);
    currentEfficiency = (currentDmgEquivalent - baseDamageEquivalent) / currentCost;
    baseDamageEquivalent = currentDmgEquivalent;
  }

  // "undo" the latest levelup
  var canLevelTo = currentLevel - 1;
  totalCost -= currentCost;
  newState.artifacts[artifact] = canLevelTo;
  currentDmgEquivalent = newState.getDamageEquivalent(tps, true);
  totalCost += costToBuy;
  return (currentDmgEquivalent - savedBasedDamageEquivalent) / totalCost;
}

export function getRelicSteps(gamestate, relics, tps = 15) {
  var t0 = performance.now();
  // ASSUMPTION: SM/heroes are already optimal and won't change
  var currentState = gamestate.getCopy();
  var relicsLeft = relics;
  var shouldBuy = false;
  var steps = [];
  var totalSpent = 0;
  while (relicsLeft > 0) {
    var options = [];

    // get base values
    var baseValue = currentState.getDamageEquivalent(tps);

    for (var artifact in currentState.artifacts) {
      if (ArtifactInfo[artifact].canLevel(currentState.artifacts[artifact])) {
        var newState = currentState.getCopy();
        var cost = ArtifactInfo[artifact].getCostToLevelUp(newState.artifacts[artifact]);
        if (cost < relicsLeft) {
          newState.artifacts[artifact] += 1;
          options.push({
            artifact: artifact,
            levelTo: newState.artifacts[artifact],
            result: newState,
            cost: cost,
            efficiency: (newState.getDamageEquivalent(tps) - baseValue) / cost,
          });
        }
      }
    }

    var costToBuy = nextArtifactCost(Object.keys(currentState.artifacts).length);
    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });
      var bestLevelEfficiency = bestOption.efficiency;

      // if we can buy an artifact, then for each artifact that we don't own, simulate buying and then
      // leveling it up until the next level-up efficiency is lower than the best level up efficiency
      // of the previously owned artifacts, then get the overall efficiency with the costToBuy factored in.
      // Then take the average of all these overall efficiencies to get a "buy" efficiency
      // console.log("cost to buy: " + costToBuy + ", relicsLeft: " + relicsLeft);
      if (costToBuy < relicsLeft) {
        var overallEfficiencies = [];
        for (var artifact in ArtifactInfo) {
          if (!(artifact in currentState.artifacts)) {
            overallEfficiencies.push(getOverallEfficiency(currentState, artifact, costToBuy, bestLevelEfficiency, tps));
          }
        }
        var averageOverallEfficiency = overallEfficiencies.reduce(function(a, b) { return a + b; }) / overallEfficiencies.length;
        options.push({
          efficiency: averageOverallEfficiency,
        });
      }

    } else if (costToBuy < relicsLeft) {
      // only option is to buy another artifact
      options.push({
        efficiency: 0,
      });
    } else {
      // no options - go prestige more
      relicsLeft = 0;
      break;
    }

    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });
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
    } else {
      relicsLeft = 0;
      break;
    }
  } // end while

  var t1 = performance.now();
  console.log("took: " + (t1-t0) + " milliseconds for " + relics);

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

  console.log(summary);

  for (var artifact in summary) {
    summarySteps.push({
      artifact: artifact,
      levelTo: summary[artifact].levelTo,
      cost: summary[artifact].cost
    });
  }

  console.log(summarySteps);

  // var diff = getDiff(gamestate, currentState);
  return {
    steps,
    summarySteps
  };
}