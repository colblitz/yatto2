import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { Skill, SkillInfo } from './Skill';
import { getHeroImprovementBonus } from './HeroImprovementBonus';
import { getPlayerImprovementBonus } from './PlayerImprovementBonus';
import { LocalizationInfo, Languages } from './Localization';

// var fs = require('fs');

// console.log("outside of test");
// console.log(fs);
// console.log(fs.readFile);

export function test() {
  console.log(ArtifactInfo);
  console.log(typeof(ArtifactInfo));
  console.log(Object.keys(ArtifactInfo));
  console.log(ArtifactInfo["Artifact5"]);
  console.log(ArtifactInfo["Artifact5"].name);
  console.log(getHeroImprovementBonus(1234));
  console.log(getPlayerImprovementBonus(1234));
  console.log(HeroInfo["H02"]);

  console.log("alskjdlfjkasdf");
  console.log(SkillInfo["SplashDmg"]);
  // console.log("alksdjfljalsjdlfjalksdf");
  // console.log(fs);
  // fs.readFileSync('./data/[12/12/16]ISavableGlobal.adat', (err, data) => {
  //   if (err) {
  //     console.log("aslkejl error error error ");
  //     throw err;
  //   }
  //   console.log(data);
  // });

}

export function test2() {
  console.log("test 2 from calculator");
  test();
}