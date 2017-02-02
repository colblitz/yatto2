import { Hero, HeroInfo, printHeroLevels } from './util/Hero';
import { ArtifactInfo, nextArtifactCost, printArtifactLevels } from './util/Artifact';
import { GameState, getDiff } from './util/GameState';
import { getNextPlayerImprovement } from './util/PlayerImprovementBonus';
import { getNextHeroImprovement } from './util/HeroImprovementBonus';
import { ServerVarsModel } from './util/ServerVarsModel';
import { BonusType } from './util/BonusType';
import { getRelicSteps } from './util/Calculator';

import { loadArtifactInfo } from './util/Artifact';
import { loadEquipmentInfo } from './util/Equipment';
import { loadHeroInfo, loadHeroSkillInfo } from './util/Hero';
import { loadHeroImprovementInfo } from './util/HeroImprovementBonus';
import { loadLocalizationInfo } from './util/Localization';
import { loadPetInfo } from './util/Pet';
import { loadPlayerImprovementInfo } from './util/PlayerImprovementBonus';
import { loadSkillInfo } from './util/Skill';

console.log("lakjsldkjflkjalsdkjf in worker");

loadArtifactInfo(() => {});
loadEquipmentInfo(() => {});
loadHeroInfo(() => {});
loadHeroSkillInfo(() => {});
loadHeroImprovementInfo(() => {});
loadLocalizationInfo(() => {});
loadPetInfo(() => {});
loadPlayerImprovementInfo(() => {});
loadSkillInfo(() => {});

module.exports = function (self) {
  self.addEventListener('message',function (ev) {
    console.log("got message from handler: ", ev.data);
    switch (ev.data.type) {
      case "GET_RELIC_STEPS":
        var a = ev.data.gamestate;
        var g = new GameState(a.info, a.swordmaster, a.artifacts, a.heroes, a.equipment, a.pets, a.skills, a.clan);
        console.log(g);

        var results = getRelicSteps(g, ev.data.settings, (progress) => {
          console.log("sending relic progress update");
          self.postMessage({
            type: "RELIC_PROGRESS_UPDATE",
            progress,
          });
        });
        console.log("sending relic results");
        self.postMessage({
          type: "RELIC_DONE",
          results
        });
        break;
      default:
        break;
    }
  });
};