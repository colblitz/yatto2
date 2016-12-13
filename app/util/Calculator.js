import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { getImprovementBonus } from './HeroImprovementBonus';
import { csv }  from 'd3';
const fs = require('fs');

export function test() {
  // console.log(ArtifactInfo);
  // console.log(typeof(ArtifactInfo));
  // console.log(Object.keys(ArtifactInfo));
  // console.log(ArtifactInfo[5]);
  // console.log(ArtifactInfo[5].name);
  // console.log(getImprovementBonus(1234));
  // console.log(HeroInfo[2]);

  console.log("alksdjfljalsjdlfjalksdf");
  console.log(fs);
  fs.readFileSync('./data/[12/12/16]ISavableGlobal.adat', (err, data) => {
    if (err) {
      console.log("aslkejl error error error ");
      throw err;
    }
    console.log(data);
  });

}