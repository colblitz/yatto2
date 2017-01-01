var parse = require('csv-parse');

var localizationCSV = require('../data/PrunedLocalizationInfo.csv');

export const Languages = {
  English     : 0,
  ChineseTrad : 1,
  ChineseSimp : 2,
  Japanese    : 3,
  Korean      : 4,
  Danish      : 5,
  Dutch       : 6,
  French      : 7,
  German      : 8,
  Italian     : 9,
  Norwegian   : 10,
  Russian     : 11,
  Spanish     : 12,
  Swedish     : 13,
  Turkish     : 14,
  Portuguese  : 15,
}


export const LocalizationInfo = {};

export function loadLocalizationInfo(callback) {
  parse(localizationCSV, {delimiter: ',', columns: true}, function(err, data) {
    for (var row of data) {
      LocalizationInfo[row.StringID] = {
        [Languages.English    ] : row.English,
        [Languages.ChineseTrad] : row.ChineseTrad,
        [Languages.ChineseSimp] : row.ChineseSimp,
        [Languages.Japanese   ] : row.Japanese,
        [Languages.Korean     ] : row.Korean,
        [Languages.Danish     ] : row.Danish,
        [Languages.Dutch      ] : row.Dutch,
        [Languages.French     ] : row.French,
        [Languages.German     ] : row.German,
        [Languages.Italian    ] : row.Italian,
        [Languages.Norwegian  ] : row.Norwegian,
        [Languages.Russian    ] : row.Russian,
        [Languages.Spanish    ] : row.Spanish,
        [Languages.Swedish    ] : row.Swedish,
        [Languages.Turkish    ] : row.Turkish,
        [Languages.Portuguese ] : row.Portuguese,
      };
    }
    callback(true);
    console.log("Done loading LocalizationInfo");
  });
}

export function getHeroName(hid, language = Languages.English) {
  return LocalizationInfo["HELPERNAME_" + hid][language];
}

export function getArtifactName(aid, language = Languages.English) {
  return LocalizationInfo["ARTIFACT_NAME_" + aid][language];
}

export function getPetName(pid, language = Languages.English) {
  return LocalizationInfo["PET_NAME_" + pid][language];
}

export function getEquipmentName(eid, language = Languages.English) {
  return LocalizationInfo[eid][language];
}