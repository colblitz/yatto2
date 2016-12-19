import { GameState } from './GameState';
import { getNextPlayerImprovement } from './PlayerImprovementBonus';
import { getNextHeroImprovement } from './HeroImprovementBonus';

export function getRelicSteps(gamestate) {

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
  var steps = {};
  var goldLeft = gold;
  while (goldLeft > 0) {
    var options = [];

    // get base values
    currentState.calculateBonuses();
    var baseValue = currentState.getDamageEquivalent(tps);

    // swordmaster option
    var newState = currentState.getCopy();
    var oLevel = newState.swordmaster.level;
    var nLevel = getNextPlayerImprovement(oLevel);
    var cost = newState.getPlayerUpgradeCost(oLevel, nLevel);
    newState.swordmaster.level = nLevel;
    newState.calculateBonuses();
    var newValue = newState.getDamageEquivalent(tps);
    options.push({
      result: newState,
      resultCost: cost,
      resultValue: newValue,
    });

    // heroes that can be bought
    for (var hero)

    // for swordmaster, each hero, insert an option
    // get max efficiency
    // apply to current state
  }
}