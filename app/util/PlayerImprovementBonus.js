var parse = require('csv-parse');

var playerImprovementCSV = require('../data/PlayerImprovementsInfo.csv');

const PlayerImprovementsInfo = {};
const PlayerImprovementsGap = {};
const PlayerImprovementsTotals = {};

var MIN_LEVEL = 10;
var MAX_LEVEL = 10000;

var multiplier = 1.0;

export function loadPlayerImprovementInfo(callback) {
  parse(playerImprovementCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var row of data) {
      PlayerImprovementsInfo[row.Level] = row.Amount;
    }
    MIN_LEVEL = Math.min.apply(null, Object.keys(PlayerImprovementsInfo));
    MAX_LEVEL = Math.max.apply(null, Object.keys(PlayerImprovementsInfo));

    var multiplier = 1.0;
    var lastLevel = 0;
    for (var level = 0; level <= MAX_LEVEL; level += 1) {
      if (level in PlayerImprovementsInfo) {
        multiplier *= PlayerImprovementsInfo[level];
        PlayerImprovementsGap[level] = level - lastLevel;
        lastLevel = level;
        PlayerImprovementsTotals[level] = multiplier;
      }
    }

    callback(true);
  });
}

const memoizedBonus = {};
export function getPlayerImprovementBonus(cLevel) {
  if (cLevel in memoizedBonus) {
    return memoizedBonus[cLevel];
  }

  var answer;
  if (cLevel < MIN_LEVEL) {
    answer = 1.0;
  } else if (cLevel > MAX_LEVEL) {
    answer = getPlayerImprovementBonus(MAX_LEVEL);
  } else {
    var tLevel = Math.floor(cLevel / 10) * 10;
    while (!(tLevel in PlayerImprovementsTotals) || isNaN(PlayerImprovementsTotals[tLevel])) {
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
    while (!(tLevel in PlayerImprovementsTotals) || isNaN(PlayerImprovementsTotals[tLevel]) || cLevel >= tLevel) {
      tLevel += 10;
    }
    answer = tLevel;
  }
  memoizedNext[cLevel] = answer;
  return answer;
}

const memoizedA = {};
export function getPlayerCurrentA(cLevel) {
  if (cLevel in memoizedA) {
    return memoizedA[cLevel];
  }

  var answer;
  if (cLevel >= MAX_LEVEL) {
    answer = (cLevel + 1) / cLevel;
  } else {
    var nextLevel = getNextPlayerImprovement(cLevel);
    var gap = PlayerImprovementsGap[nextLevel];
    var multiplier = PlayerImprovementsInfo[nextLevel];
    answer = Math.pow(multiplier, 1 / gap);

    for (var l = nextLevel - gap; l < nextLevel; l += 1) {
      memoizedA[l] = answer;
    }
  }
  return answer;
}