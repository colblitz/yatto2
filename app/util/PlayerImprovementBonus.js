import { csv }  from 'd3';

const PlayerImprovementsInfo = {}
const PlayerImprovementsTotals = {};

var MIN_LEVEL = 0;
var MAX_LEVEL = 10000;

var multiplier = 1.0;

csv("./data/PlayerImprovementsInfo.csv", function(data) {
  for (var row of data) {
    PlayerImprovementsInfo[row.Level] = row.Amount;
  }
  console.log("done loading PlayerImprovementsInfo");
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

export function getPlayerImprovementBonus(cLevel) {
  if (cLevel < MIN_LEVEL) {
    return 1.0;
  } else if (cLevel > MAX_LEVEL) {
    return getImprovementBonus(MAX_LEVEL);
  } else {
    cLevel = Math.floor(cLevel / 10) * 10;
    while (!(cLevel in PlayerImprovementsTotals)) {
      cLevel -= 10;
    }
    return PlayerImprovementsTotals[cLevel];
  }
}