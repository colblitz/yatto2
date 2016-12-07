import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { getImprovementBonus } from './HeroImprovementBonus';

export function test() {
  console.log(ArtifactInfo[5].name);
  console.log(getImprovementBonus(1234));
  console.log(HeroInfo[2]);
}