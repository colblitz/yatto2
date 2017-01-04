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

// why is this necessary :<
const skillToTalentString = {
  "PetQTE"              : "TALENT_ENGAGED_PETQTE",
  "BossDmgQTE"          : "TALENT_ENGAGED_PETQTEBOSS",
  "PetGoldQTE"          : "TALENT_ENGAGED_PETGOLD",
  "HelperDmgQTE"        : "TALENT_ENGAGED_HELPERQTE",
  "HelperCountQTE"      : "TALENT_ENGAGED_HELPERCOUNT",
  "Fairy"               : "TALENT_ENGAGED_FAIRY",
  "BossTimer"           : "TALENT_ENGAGED_BOSSTIMER",
  "ClanQTE"             : "TALENT_ENGAGED_CLANQTE",
  "GoblinQTE"           : "TALENT_ENGAGED_GOBLIN",
  "BossCountQTE"        : "TALENT_ENGAGED_PETCOUNT",
  "OfflineGold"         : "TALENT_LAZY_OFFLINEG",
  "MeleeHelperDmg"      : "TALENT_LAZY_MELEE",
  "SpellHelperDmg"      : "TALENT_LAZY_SPELL",
  "RangedHelperDmg"     : "TALENT_LAZY_RANGE",
  "PetDmg"              : "TALENT_LAZY_PETDMG",
  "LessMonsters"        : "TALENT_LAZY_MONSTERCOUNT",
  "SplashDmg"           : "TALENT_LAZY_SPLASH",
  "AutoAdvance"         : "TALENT_LAZY_AUTOADV",
  "MultiMonsters"       : "TALENT_LAZY_MULTIMON",
  "PetOfflineDmg"       : "TALENT_LAZY_PETDMGOFFLINE",
  "GoldRateBoost"       : "TALENT_LAZY_GOLDRATE",
  "BurstSkillBoost"     : "TALENT_ACTIVE_BURST",
  "FireTapSkillBoost"   : "TALENT_ACTIVE_FIRETAP",
  "MPRegenBoost"        : "TALENT_ACTIVE_MPREGEN",
  "MPCapacityBoost"     : "TALENT_ACTIVE_MPCAP",
  "HelperDmgSkillBoost" : "TALENT_ACTIVE_HELPER",
  "MidasSkillBoost"     : "TALENT_ACTIVE_MIDAS",
  "ManaStealSkillBoost" : "TALENT_ACTIVE_MPSTEAL",
  "CritSkillBoost"      : "TALENT_ACTIVE_CRITBOOST",
  "CloneSkillBoost"     : "TALENT_ACTIVE_CLONE",
  "ManaMonster"         : "TALENT_ACTIVE_MPMONSTER",
};

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

export function getSkillName(sid, language = Languages.English) {
  return LocalizationInfo[skillToTalentString[sid]][language];
}