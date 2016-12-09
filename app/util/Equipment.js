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
});

export const AEquipmentInfo = {
  "Aura_Dizzy"           : new Equipment("Aura_Dizzy"           , EquipmentType.Aura   , 1, BonusType.ChestChance        , 0.01,  0.0001),
  "Aura_GroundLightning" : new Equipment("Aura_GroundLightning" , EquipmentType.Aura   , 1, BonusType.ChestChance        , 0.01,  0.0001),
  "Aura_Colors"          : new Equipment("Aura_Colors"          , EquipmentType.Aura   , 1, BonusType.ChestChance        , 0.01,  0.0001),
  "Aura_Water"           : new Equipment("Aura_Water"           , EquipmentType.Aura   , 2, BonusType.ChestChance        , 0.01,  0.0002),
  "Aura_Orbs"            : new Equipment("Aura_Orbs"            , EquipmentType.Aura   , 2, BonusType.ChestChance        , 0.01,  0.0002),
  "Aura_Bats"            : new Equipment("Aura_Bats"            , EquipmentType.Aura   , 3, BonusType.ChestChance        , 0.01,  0.0002),
  "Aura_Lightning"       : new Equipment("Aura_Lightning"       , EquipmentType.Aura   , 1, BonusType.CritChance         , 0.01,  0.0001),
  "Aura_Diamonds"        : new Equipment("Aura_Diamonds"        , EquipmentType.Aura   , 1, BonusType.CritChance         , 0.01,  0.0001),
  "Aura_Star"            : new Equipment("Aura_Star"            , EquipmentType.Aura   , 1, BonusType.CritChance         , 0.01,  0.0001),
  "Aura_Bird"            : new Equipment("Aura_Bird"            , EquipmentType.Aura   , 2, BonusType.CritChance         , 0.01,  0.0001),
  "Aura_BlackEnergy"     : new Equipment("Aura_BlackEnergy"     , EquipmentType.Aura   , 2, BonusType.CritChance         , 0.01,  0.0002),
  "Aura_Bones"           : new Equipment("Aura_Bones"           , EquipmentType.Aura   , 3, BonusType.CritChance         , 0.01,  0.0002),
  "Aura_Wind"            : new Equipment("Aura_Wind"            , EquipmentType.Aura   , 3, BonusType.CritChance         , 0.01,  0.0050),
  "Aura_Bugs"            : new Equipment("Aura_Bugs"            , EquipmentType.Aura   , 1, BonusType.MonsterHP          , 0.99, -0.0001),
  "Aura_Embers"          : new Equipment("Aura_Embers"          , EquipmentType.Aura   , 1, BonusType.MonsterHP          , 0.99, -0.0003),
  "Aura_Sparks"          : new Equipment("Aura_Sparks"          , EquipmentType.Aura   , 1, BonusType.MonsterHP          , 0.99, -0.0003),
  "Aura_Leaves"          : new Equipment("Aura_Leaves"          , EquipmentType.Aura   , 2, BonusType.MonsterHP          , 0.99, -0.0006),
  "Aura_Ice"             : new Equipment("Aura_Ice"             , EquipmentType.Aura   , 3, BonusType.MonsterHP          , 0.99, -0.0009),
  "Aura_Cards"           : new Equipment("Aura_Cards"           , EquipmentType.Aura   , 0, BonusType.None               , 1.00,  0.0000),
  "Aura_Fire"            : new Equipment("Aura_Fire"            , EquipmentType.Aura   , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Cat"              : new Equipment("Hat_Cat"              , EquipmentType.Hat    , 1, BonusType.RangedHelperDamage , 1.00,  0.0400),
  "Hat_HelmTall"         : new Equipment("Hat_HelmTall"         , EquipmentType.Hat    , 1, BonusType.RangedHelperDamage , 1.00,  0.0450),
  "Hat_Ice"              : new Equipment("Hat_Ice"              , EquipmentType.Hat    , 1, BonusType.RangedHelperDamage , 1.00,  0.0470),
  "Hat_Wizard"           : new Equipment("Hat_Wizard"           , EquipmentType.Hat    , 1, BonusType.RangedHelperDamage , 1.00,  0.0500),
  "Hat_HelmDevil"        : new Equipment("Hat_HelmDevil"        , EquipmentType.Hat    , 2, BonusType.RangedHelperDamage , 1.00,  0.1200),
  "Hat_Indie"            : new Equipment("Hat_Indie"            , EquipmentType.Hat    , 3, BonusType.RangedHelperDamage , 1.00,  0.3000),
  "Hat_KickAss"          : new Equipment("Hat_KickAss"          , EquipmentType.Hat    , 1, BonusType.MeleeHelperDamage  , 1.00,  0.0400),
  "Hat_BatGrey"          : new Equipment("Hat_BatGrey"          , EquipmentType.Hat    , 1, BonusType.MeleeHelperDamage  , 1.00,  0.0450),
  "Hat_Robot"            : new Equipment("Hat_Robot"            , EquipmentType.Hat    , 1, BonusType.MeleeHelperDamage  , 1.00,  0.0470),
  "Hat_HelmHorned"       : new Equipment("Hat_HelmHorned"       , EquipmentType.Hat    , 1, BonusType.MeleeHelperDamage  , 1.00,  0.0500),
  "Hat_Tribal"           : new Equipment("Hat_Tribal"           , EquipmentType.Hat    , 2, BonusType.MeleeHelperDamage  , 1.00,  0.1200),
  "Hat_Chicken"          : new Equipment("Hat_Chicken"          , EquipmentType.Hat    , 3, BonusType.MeleeHelperDamage  , 1.00,  0.3000),
  "Hat_BatRed"           : new Equipment("Hat_BatRed"           , EquipmentType.Hat    , 1, BonusType.SpellHelperDamage  , 1.00,  0.0400),
  "Hat_Cap"              : new Equipment("Hat_Cap"              , EquipmentType.Hat    , 1, BonusType.SpellHelperDamage  , 1.00,  0.0450),
  "Hat_Music"            : new Equipment("Hat_Music"            , EquipmentType.Hat    , 1, BonusType.SpellHelperDamage  , 1.00,  0.0470),
  "Hat_HelmWhite"        : new Equipment("Hat_HelmWhite"        , EquipmentType.Hat    , 1, BonusType.SpellHelperDamage  , 1.00,  0.0500),
  "Hat_Top"              : new Equipment("Hat_Top"              , EquipmentType.Hat    , 2, BonusType.SpellHelperDamage  , 1.00,  0.1200),
  "Hat_Link"             : new Equipment("Hat_Link"             , EquipmentType.Hat    , 3, BonusType.SpellHelperDamage  , 1.00,  0.3000),
  "Hat_Ninja"            : new Equipment("Hat_Ninja"            , EquipmentType.Hat    , 3, BonusType.SpellHelperDamage  , 1.00,  0.3200),
  "Hat_Football"         : new Equipment("Hat_Football"         , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Alien"            : new Equipment("Hat_Alien"            , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Transformer"      : new Equipment("Hat_Transformer"      , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_PowerRanger"      : new Equipment("Hat_PowerRanger"      , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Poo"              : new Equipment("Hat_Poo"              , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Pineapple"        : new Equipment("Hat_Pineapple"        , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Soccer"           : new Equipment("Hat_Soccer"           , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Bag"              : new Equipment("Hat_Bag"              , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Mega"             : new Equipment("Hat_Mega"             , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Ironman"          : new Equipment("Hat_Ironman"          , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Kid"              : new Equipment("Hat_Kid"              , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Hat_Kitty"            : new Equipment("Hat_Kitty"            , EquipmentType.Hat    , 0, BonusType.None               , 1.00,  0.0000),
  "Slash_Darkness"       : new Equipment("Slash_Darkness"       , EquipmentType.Slash  , 1, BonusType.TapDamage          , 1.00,  0.0500),
  "Slash_FireGray"       : new Equipment("Slash_FireGray"       , EquipmentType.Slash  , 1, BonusType.TapDamage          , 1.00,  0.0530),
  "Slash_FireOrange"     : new Equipment("Slash_FireOrange"     , EquipmentType.Slash  , 1, BonusType.TapDamage          , 1.00,  0.0550),
  "Slash_Embers"         : new Equipment("Slash_Embers"         , EquipmentType.Slash  , 1, BonusType.TapDamage          , 1.00,  0.0600),
  "Slash_Lava"           : new Equipment("Slash_Lava"           , EquipmentType.Slash  , 2, BonusType.TapDamage          , 1.00,  0.1400),
  "Slash_EmbersBlue"     : new Equipment("Slash_EmbersBlue"     , EquipmentType.Slash  , 2, BonusType.TapDamage          , 1.00,  0.1500),
  "Slash_StarsBlue"      : new Equipment("Slash_StarsBlue"      , EquipmentType.Slash  , 3, BonusType.TapDamage          , 1.00,  0.5000),
  "Slash_Fire"           : new Equipment("Slash_Fire"           , EquipmentType.Slash  , 3, BonusType.TapDamage          , 1.00,  0.4000),
  "Slash_Lightning"      : new Equipment("Slash_Lightning"      , EquipmentType.Slash  , 1, BonusType.PetDamageMult      , 1.00,  0.0180),
  "Slash_Paint"          : new Equipment("Slash_Paint"          , EquipmentType.Slash  , 1, BonusType.PetDamageMult      , 1.00,  0.0190),
  "Slash_Stars"          : new Equipment("Slash_Stars"          , EquipmentType.Slash  , 1, BonusType.PetDamageMult      , 1.00,  0.0200),
  "Slash_Water"          : new Equipment("Slash_Water"          , EquipmentType.Slash  , 1, BonusType.PetDamageMult      , 1.00,  0.0210),
  "Slash_Rainbow"        : new Equipment("Slash_Rainbow"        , EquipmentType.Slash  , 2, BonusType.PetDamageMult      , 1.00,  0.0500),
  "Slash_Leaves"         : new Equipment("Slash_Leaves"         , EquipmentType.Slash  , 2, BonusType.PetDamageMult      , 1.00,  0.0600),
  "Slash_FireBlack"      : new Equipment("Slash_FireBlack"      , EquipmentType.Slash  , 3, BonusType.PetDamageMult      , 1.00,  0.0180),
  "Slash_Smelly"         : new Equipment("Slash_Smelly"         , EquipmentType.Slash  , 3, BonusType.PetDamageMult      , 1.00,  0.2000),
  "Slash_Petals"         : new Equipment("Slash_Petals"         , EquipmentType.Slash  , 0, BonusType.None               , 0.00,  0.0000),
  "Suit_ArmorFace"       : new Equipment("Suit_ArmorFace"       , EquipmentType.Suit   , 1, BonusType.GoldAll            , 1.00,  0.0100),
  "Suit_ArmorIce"        : new Equipment("Suit_ArmorIce"        , EquipmentType.Suit   , 1, BonusType.GoldAll            , 1.00,  0.0110),
  "Suit_Casual"          : new Equipment("Suit_Casual"          , EquipmentType.Suit   , 1, BonusType.GoldAll            , 1.00,  0.0120),
  "Suit_Wizard"          : new Equipment("Suit_Wizard"          , EquipmentType.Suit   , 1, BonusType.GoldAll            , 1.00,  0.0130),
  "Suit_ArmorRoyal"      : new Equipment("Suit_ArmorRoyal"      , EquipmentType.Suit   , 2, BonusType.GoldAll            , 1.00,  0.0300),
  "Suit_KungFu"          : new Equipment("Suit_KungFu"          , EquipmentType.Suit   , 2, BonusType.GoldAll            , 1.00,  0.0330),
  "Suit_ArmorHighTec"    : new Equipment("Suit_ArmorHighTec"    , EquipmentType.Suit   , 3, BonusType.GoldAll            , 1.00,  0.1100),
  "Suit_ArmorRed"        : new Equipment("Suit_ArmorRed"        , EquipmentType.Suit   , 3, BonusType.GoldAll            , 1.00,  0.1000),
  "Suit_ArmorPurple"     : new Equipment("Suit_ArmorPurple"     , EquipmentType.Suit   , 1, BonusType.ChestAmount        , 1.00,  0.0200),
  "Suit_ArmorScale"      : new Equipment("Suit_ArmorScale"      , EquipmentType.Suit   , 1, BonusType.ChestAmount        , 1.00,  0.0210),
  "Suit_Farmer"          : new Equipment("Suit_Farmer"          , EquipmentType.Suit   , 1, BonusType.ChestAmount        , 1.00,  0.0220),
  "Suit_ArmorGreen"      : new Equipment("Suit_ArmorGreen"      , EquipmentType.Suit   , 1, BonusType.ChestAmount        , 1.00,  0.0230),
  "Suit_ArmorWhite"      : new Equipment("Suit_ArmorWhite"      , EquipmentType.Suit   , 2, BonusType.ChestAmount        , 1.00,  0.0600),
  "Suit_ArmorOrange"     : new Equipment("Suit_ArmorOrange"     , EquipmentType.Suit   , 2, BonusType.ChestAmount        , 1.00,  0.0620),
  "Suit_ArmorRoman"      : new Equipment("Suit_ArmorRoman"      , EquipmentType.Suit   , 3, BonusType.ChestAmount        , 1.00,  0.2000),
  "Suit_Ninja"           : new Equipment("Suit_Ninja"           , EquipmentType.Suit   , 3, BonusType.ChestAmount        , 1.00,  0.2100),
  "Suit_Chicken"         : new Equipment("Suit_Chicken"         , EquipmentType.Suit   , 0, BonusType.None               , 0.00,  0.0000),
  "Suit_Robot"           : new Equipment("Suit_Robot"           , EquipmentType.Suit   , 0, BonusType.None               , 0.00,  0.0000),
  "Suit_Snowman"         : new Equipment("Suit_Snowman"         , EquipmentType.Suit   , 0, BonusType.None               , 0.00,  0.0000),
  "Suit_Ironman"         : new Equipment("Suit_Ironman"         , EquipmentType.Suit   , 0, BonusType.None               , 0.00,  0.0000),
  "Weapon_Basic"         : new Equipment("Weapon_Basic"         , EquipmentType.Weapon , 1, BonusType.AllDamage          , 1.00,  0.0300),
  "Weapon_Bat"           : new Equipment("Weapon_Bat"           , EquipmentType.Weapon , 1, BonusType.AllDamage          , 1.00,  0.0190),
  "Weapon_Club"          : new Equipment("Weapon_Club"          , EquipmentType.Weapon , 1, BonusType.AllDamage          , 1.00,  0.0200),
  "Weapon_WoodAxe"       : new Equipment("Weapon_WoodAxe"       , EquipmentType.Weapon , 1, BonusType.AllDamage          , 1.00,  0.0310),
  "Weapon_Brute"         : new Equipment("Weapon_Brute"         , EquipmentType.Weapon , 1, BonusType.AllDamage          , 1.00,  0.0350),
  "Weapon_Laser"         : new Equipment("Weapon_Laser"         , EquipmentType.Weapon , 2, BonusType.AllDamage          , 1.00,  0.0550),
  "Weapon_ZigZag"        : new Equipment("Weapon_ZigZag"        , EquipmentType.Weapon , 2, BonusType.AllDamage          , 1.00,  0.0700),
  "Weapon_Excalibur"     : new Equipment("Weapon_Excalibur"     , EquipmentType.Weapon , 3, BonusType.AllDamage          , 1.00,  0.1000),
  "Weapon_Cleaver"       : new Equipment("Weapon_Cleaver"       , EquipmentType.Weapon , 3, BonusType.AllDamage          , 1.00,  0.0900),
  "Weapon_Gear"          : new Equipment("Weapon_Gear"          , EquipmentType.Weapon , 1, BonusType.AllHelperDamage    , 1.00,  0.0500),
  "Weapon_Sythe"         : new Equipment("Weapon_Sythe"         , EquipmentType.Weapon , 1, BonusType.AllHelperDamage    , 1.00,  0.0500),
  "Weapon_Hammer"        : new Equipment("Weapon_Hammer"        , EquipmentType.Weapon , 1, BonusType.AllHelperDamage    , 1.00,  0.0700),
  "Weapon_Ninja"         : new Equipment("Weapon_Ninja"         , EquipmentType.Weapon , 1, BonusType.AllHelperDamage    , 1.00,  0.0600),
  "Weapon_BattleAxe"     : new Equipment("Weapon_BattleAxe"     , EquipmentType.Weapon , 1, BonusType.AllHelperDamage    , 1.00,  0.0650),
  "Weapon_Halberd"       : new Equipment("Weapon_Halberd"       , EquipmentType.Weapon , 2, BonusType.AllHelperDamage    , 1.00,  0.1700),
  "Weapon_Beam"          : new Equipment("Weapon_Beam"          , EquipmentType.Weapon , 2, BonusType.AllHelperDamage    , 1.00,  0.1400),
  "Weapon_Holy"          : new Equipment("Weapon_Holy"          , EquipmentType.Weapon , 3, BonusType.AllHelperDamage    , 1.00,  0.2500),
  "Weapon_Poison"        : new Equipment("Weapon_Poison"        , EquipmentType.Weapon , 3, BonusType.AllHelperDamage    , 1.00,  0.2700),
  "Weapon_Glaive"        : new Equipment("Weapon_Glaive"        , EquipmentType.Weapon , 1, BonusType.CritDamage         , 1.00,  0.0400),
  "Weapon_Buster"        : new Equipment("Weapon_Buster"        , EquipmentType.Weapon , 1, BonusType.CritDamage         , 1.00,  0.0500),
  "Weapon_Skull"         : new Equipment("Weapon_Skull"         , EquipmentType.Weapon , 1, BonusType.CritDamage         , 1.00,  0.0500),
  "Weapon_Spear"         : new Equipment("Weapon_Spear"         , EquipmentType.Weapon , 1, BonusType.CritDamage         , 1.00,  0.0450),
  "Weapon_Katana"        : new Equipment("Weapon_Katana"        , EquipmentType.Weapon , 1, BonusType.CritDamage         , 1.00,  0.0550),
  "Weapon_PitchFork"     : new Equipment("Weapon_PitchFork"     , EquipmentType.Weapon , 2, BonusType.CritDamage         , 1.00,  0.1000),
  "Weapon_Staff"         : new Equipment("Weapon_Staff"         , EquipmentType.Weapon , 2, BonusType.CritDamage         , 1.00,  0.1100),
  "Weapon_Saw"           : new Equipment("Weapon_Saw"           , EquipmentType.Weapon , 3, BonusType.CritDamage         , 1.00,  0.2000),
  "Weapon_Pencil"        : new Equipment("Weapon_Pencil"        , EquipmentType.Weapon , 0, BonusType.None               , 1.00,  0.0000),
  "Weapon_Fish"          : new Equipment("Weapon_Fish"          , EquipmentType.Weapon , 0, BonusType.None               , 1.00,  0.0000),
  "Weapon_Carrot"        : new Equipment("Weapon_Carrot"        , EquipmentType.Weapon , 0, BonusType.None               , 1.00,  0.0000),
};

console.log(EquipmentInfo);
console.log(AEquipmentInfo);