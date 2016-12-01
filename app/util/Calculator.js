import { Artifact, ArtifactInfo } from './Artifact';
import { getImprovementBonus } from './HeroImprovementBonus';

export function test() {
  console.log(ArtifactInfo[5].name);
  console.log(getImprovementBonus(1234));
}