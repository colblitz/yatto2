import { BonusType, addBonus, stringToBonus } from './BonusType';
import { csv }  from 'd3';

export const EquipmentType = {
  Aura   : 0,
  Hat    : 1,
  Slash  : 2,
  Suit   : 3,
  Weapon : 4,
};

const stringToEquipmentType = {
  "Aura"  : EquipmentType.Aura,
  "Hat"   : EquipmentType.Hat,
  "Slash" : EquipmentType.Slash,
  "Suit"  : EquipmentType.Suit,
  "Weapon": EquipmentType.Weapon,
};

export class Equipment {
  constructor(id, category, rarity, bonusType, bonusBase, bonusInc) {
    this.id = id;
    this.category = category;
    this.rarity = rarity;
    this.bonusType = bonusType;
    this.bonusBase = bonusBase;
    this.bonusInc = bonusInc;
  }

  getBonus(level) {
    var allBonuses = {};
    addBonus(allBonuses, this.bonusType, this.bonusBase + level * this.bonusInc);
    return allBonuses;
  }
}

export const EquipmentInfo = {};

csv("./data/EquipmentInfo.csv", function(data) {
  for (var equipment of data) {
    EquipmentInfo[equipment.EquipmentID] = new Equipment(
      equipment.EquipmentID,
      stringToEquipmentType[equipment.EquipmentCategory],
      equipment.Rarity,
      stringToBonus[equipment.BonusType],
      parseFloat(equipment.AttributeBaseAmount),
      parseFloat(equipment.AttributeBaseInc)
    );
  }
  console.log("done loading EquipmentInfo");
});