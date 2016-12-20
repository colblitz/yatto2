var parse = require('csv-parse');

var playerImprovementCSV = require('../data/PlayerImprovementsInfo.csv');

const PlayerImprovementsInfo = {}
const PlayerImprovementsTotals = {};

var MIN_LEVEL = 0;
var MAX_LEVEL = 10000;

var multiplier = 1.0;

parse(playerImprovementCSV, {delimiter: ',', columns: true}, function(err, data) {
  for (var row of data) {
    PlayerImprovementsInfo[row.Level] = row.Amount;
  }
  console.log("Done loading PlayerImprovementsInfo");
  MIN_LEVEL = Math.min.apply(null, Object.keys(PlayerImprovementsInfo));
  MAX_LEVEL = Math.max.apply(null, Object.keys(PlayerImprovementsInfo));

  var multiplier = 1.0;
  for (var level = 0; level <= MAX_LEVEL; level += 10) {
    if (level in PlayerImprovementsInfo) {
      multiplier *= PlayerImprovementsInfo[level];
      PlayerImprovementsTotals[level] = multiplier;
    }
  }
  console.log("done loading PlayerImprovementsTotals");
});

const memoizedBonus = {};
export function getPlayerImprovementBonus(cLevel) {
  if (cLevel in memoizedBonus) {
    return memoizedBonus[cLevel];
  }

  var answer;
  if (cLevel < MIN_LEVEL) {
    answer = 1.0;
  } else if (cLevel > MAX_LEVEL) {
    answer = getImprovementBonus(MAX_LEVEL);
  } else {
    var tLevel = Math.floor(cLevel / 10) * 10;
    while (!(tLevel in PlayerImprovementsTotals)) {
      tLevel -= 10;
    }
    answer = PlayerImprovementsTotals[tLevel];
  }
  memoizedBonus[cLevel] = answer;
  return answer;
}

const memoizedNext = {};
export function getNextPlayerImprovement(cLevel) {
  if (cLevel in memoizedNext) {
    return memoizedNext[cLevel];
  }

  var answer;
  if (cLevel < MIN_LEVEL) {
    answer = MIN_LEVEL;
  } else if (cLevel >= MAX_LEVEL) {
    answer = Infinity;
  } else {
    var tLevel = Math.floor(cLevel / 10) * 10;
    while (!(tLevel in PlayerImprovementsTotals) || cLevel >= tLevel) {
      tLevel += 10;
    }
    answer = tLevel;
  }
  memoizedNext[cLevel] = answer;
  return answer;
}