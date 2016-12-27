var parse = require('csv-parse');

var heroImprovementCSV = require('../data/HelperImprovementsInfo.csv');

const HeroImprovementsInfo = {}
const HeroImprovementsTotals = {};

var MIN_LEVEL = 0;
var MAX_LEVEL = 10000;

var multiplier = 1.0;

export function loadHeroImprovementInfo(callback) {
  parse(heroImprovementCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var row of data) {
      HeroImprovementsInfo[row.Level] = row.Amount;
    }
    console.log("Done loading HeroImprovementsInfo");
    MIN_LEVEL = Math.min.apply(null, Object.keys(HeroImprovementsInfo));
    MAX_LEVEL = Math.max.apply(null, Object.keys(HeroImprovementsInfo));

    var multiplier = 1.0;
    for (var level = 0; level <= MAX_LEVEL; level += 10) {
      if (level in HeroImprovementsInfo) {
        multiplier *= HeroImprovementsInfo[level];
        HeroImprovementsTotals[level] = multiplier;
      }
    }
    callback(true);
    console.log("Done loading HeroImprovementsTotals");
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
    answer = getImprovementBonus(MAX_LEVEL);
  } else {
    var tLevel = Math.floor(cLevel / 10) * 10;
    while (!(tLevel in HeroImprovementsTotals)) {
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
    while (!(tLevel in HeroImprovementsTotals) || cLevel >= tLevel) {
      tLevel += 10;
    }
    answer = tLevel;
  }
  memoizedNext[cLevel] = answer;
  return answer;
}