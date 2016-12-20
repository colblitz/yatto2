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

export function getRelicSteps(gamestate, relics, tps = 15) {
  var t0 = performance.now();
  // ASSUMPTION: SM/heroes are already optimal and won't change
  var currentState = gamestate.getCopy();
  var relicsLeft = relics;
  var shouldBuy = false;
  while (relicsLeft > 0) {
    var options = [];

    // get base values
    var baseValue = currentState.getDamageEquivalent(tps);

    for (var artifact in currentState.artifacts) {
      var newState = currentState.getCopy();
      var cost = ArtifactInfo[artifact].getCostToLevelUp(newState.artifacts[artifact]);
      if (cost < relicsLeft) {
        newState.artifacts[artifact] += 1;
        options.push({
          result: newState,
          resultCost: cost,
          efficiency: (newState.getDamageEquivalent(tps) - baseValue) / cost,
        });
      }
    }

    var costToBuy = nextArtifactCost(Object.keys(currentState.artifacts).length);
    if (costToBuy < relicsLeft) {
      var dmgEquivalents = [];
      for (var artifact in ArtifactInfo) {
        if (!(artifact in currentState.artifacts)) {
          // don't own
          var newState = currentState.getCopy();
          newState.artifacts[artifact] = 1;
          dmgEquivalents.push(newState.getDamageEquivalent(tps));
        }
      }
      var averageDamageEquivalent = dmgEquivalents.reduce(function(a, b) { return a + b; }) / dmgEquivalents.length;
      options.push({
        resultCost: costToBuy,
        efficiency: (averageDamageEquivalent - baseValue) / costToBuy,
      });
    }

    if (options.length > 0) {
      var bestOption = getMax(options, function(o1, o2) {
        return o1.efficiency > o2.efficiency;
      });
      if (!(bestOption.result)) {
        // best option is to buy an artifact - terminate
        shouldBuy = true;
        relicsLeft = 0;
        break;
      }
      currentState = bestOption.result;
      relicsLeft -= bestOption.resultCost;
    } else {
      relicsLeft = 0;
      break;
    }
  } // end while

  var t1 = performance.now();
  console.log("took: " + (t1-t0) + " milliseconds for " + relics);
  return {
    diff: getDiff(gamestate, currentState),
    buy: shouldBuy
  };
}



