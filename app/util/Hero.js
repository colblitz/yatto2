import { BonusType } from './BonusType';
import { ServerVarsModel } from './ServerVarsModel';
import { getImprovementBonus } from './HeroImprovementBonus';

export class Hero {
  constructor(id, heroId, name, type, cost) {
    this.id = id; // unlock order
    this.heroId = heroId;
    this.name = name;
    this.type = type;
    this.cost = cost;

    var a = 1.0 - ServerVarsModel.helperInefficiency * Math.Min(this.id, ServerVarsModel.helperInefficiencySlowDown);
    this.efficiency = Math.Pow(a, this.id);
    this.constant1 = this.cost * ServerVarsModel.dMGScaleDown * this.efficiency;
  }

  // TODO: precompute
  getCostToLevelUp(cLevel) {

  }

  getCostToLevelFromTo(sLevel, eLevel) {

  }

  getBaseDamage(cLevel) {
    return this.constant1 * cLevel * getImprovementBonus(cLevel);
    // Singleton<BonusModel>.instance.GetBonus(BonusType.typeDamage) *
    // Singleton<BonusModel>.instance.GetBonus(BonusType.AllDamage) *
    // Singleton<BonusModel>.instance.GetBonus(BonusType.AllHelperDamage) *
    // (double)(1f + Singleton<HelperModel>.instance.GetAdditionalDamageMultiplierFromWeaponLevel(this.ID));
  }
}
