import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { getImprovementBonus } from './HeroImprovementBonus';
import { csv }  from 'd3';

export function test() {
  console.log(ArtifactInfo);
  console.log(typeof(ArtifactInfo));
  console.log(Object.keys(ArtifactInfo));
  console.log(ArtifactInfo[5]);
  console.log(ArtifactInfo[5].name);
  console.log(getImprovementBonus(1234));
  console.log(HeroInfo[2]);

  csv("./data/ArtifactInfo.csv", function(data) {
    console.log(data[0]);
  });

}