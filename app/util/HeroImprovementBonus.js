var parse = require('csv-parse');

var heroImprovementCSV = require('../data/HelperImprovementsInfo.csv');

const HeroImprovementsInfo = {};
const HeroImprovementsGap = {};
const HeroImprovementsTotals = {};

var MIN_LEVEL = 10;
var MAX_LEVEL = 10000;

var multiplier = 1.0;

// TODO: combine with PlayerImprovementBonus
export function loadHeroImprovementInfo(callback) {
  parse(heroImprovementCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var row of data) {
      HeroImprovementsInfo[row.Level] = row.Amount;
    }
    MIN_LEVEL = Math.min.apply(null, Object.keys(HeroImprovementsInfo));
    MAX_LEVEL = Math.max.apply(null, Object.keys(HeroImprovementsInfo));

    var multiplier = 1.0;
    var lastLevel = 0;
    for (var level = 0; level <= MAX_LEVEL; level += 1) {
      if (level in HeroImprovementsInfo) {
        multiplier *= HeroImprovementsInfo[level];
        HeroImprovementsGap[level] = level - lastLevel;
        lastLevel = level;
        HeroImprovementsTotals[level] = multiplier;
      }
    }
    callback(true);
  });
}

const memoizedBonus = {};
export function getHeroImprovementBonus(cLevel) {
  if (cLevel in memoizedBonus) {
    return memoizedBonus[cLevel];
  }

  var answer;
  if (cLevel < MIN_LEVEL) {
    answer = 1.0;
  } else if (cLevel > MAX_LEVEL) {
    answer = getHeroImprovementBonus(MAX_LEVEL);
  } else {
    var tLevel = Math.floor(cLevel / 10) * 10;
    while (!(tLevel in HeroImprovementsTotals) || isNaN(HeroImprovementsTotals[tLevel])) {
      tLevel -= 10;
    }
    answer = HeroImprovementsTotals[tLevel];
  }
  memoizedBonus[cLevel] = answer;
  return answer;
}

const memoizedNext = {};
export function getNextHeroImprovement(cLevel) {
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
    while (!(tLevel in HeroImprovementsTotals) || isNaN(HeroImprovementsTotals[tLevel]) || cLevel >= tLevel) {
      tLevel += 10;
    }
    answer = tLevel;
  }
  memoizedNext[cLevel] = answer;
  return answer;
}

const memoizedA = {};
export function getHeroCurrentA(cLevel) {
  if (cLevel in memoizedA) {
    return memoizedA[cLevel];
  }

  var answer;
  if (cLevel >= MAX_LEVEL) {
    answer = (cLevel + 1) / cLevel;
  } else {
    var nextLevel = getNextHeroImprovement(cLevel);
    var gap = HeroImprovementsGap[nextLevel];
    var multiplier = HeroImprovementsInfo[nextLevel];
    answer = Math.pow(multiplier, 1 / gap);

    for (var l = nextLevel - gap; l < nextLevel; l += 1) {
      memoizedA[l] = answer;
    }
  }
  return answer;
}