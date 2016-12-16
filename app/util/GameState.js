import { Artifact, ArtifactInfo } from './Artifact';
import { Hero, HeroInfo } from './Hero';
import { Pet, PetInfo } from './Pet';
import { getHeroImprovementBonus } from './HeroImprovementBonus';
import { getPlayerImprovementBonus } from './PlayerImprovementBonus';

export class GameState {
  constructor(swordmaster, artifacts, heroes, equipment, pets) {
    this.swordmaster = swordmaster;
    this.artifacts = artifacts;
    this.heroes = heroes;
    this.equipment = equipment;
    this.pets = pets;
  }

  getBonuses() {

  }

  getDPS() {

  }
}