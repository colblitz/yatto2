import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import { ArtifactInfo } from '../util/Artifact';
import { BonusType, notPercentageBonuses } from '../util/BonusType';
import { equipmentAdded, equipmentSelected, equipmentAddedBonus } from '../actions/actions';

class EquipmentAdd extends React.Component {
  getOption(eid) {
    return <option key={eid} value={eid}>{getEquipmentName(eid)}</option>;
  }
  getEquipmentOptions(equipment) {
    return equipment.map(function(eid) { return ( this.getOption(eid) ); }.bind(this));
  }
  render() {
    return (
      <tr className="equipment-add">
        <td></td>
        <td>
          <input type="text" className="input equipment-bonus-input" value={this.props.toAddBonus} onChange={(e) => this.props.onEquipmentBonus(e, this.props.category)}/>
        </td>
        <td>
          <select className='equipment-select' value={this.props.selected} onChange={(e) => this.props.onEquipmentSelected(this.props.category, e)}>
            {this.getEquipmentOptions(this.props.equipment)}
          </select>
        </td>
        <td>
          <i className="fa fa-plus" onClick={(e) => this.props.onEquipmentAdded(this.props.selected, this.props.toAddBonus, this.props.fMultiplier, this.props.boost)}></i>
        </td>
      </tr>
    );
  }
}

var categoryToArtifactBooster = {
  4: "Artifact25", // weapons
  1: "Artifact17", // helmets
  3: "Artifact23", // suits/armor
  2: "Artifact28", // slashes
}

var categoryToBonusType = {
  4: BonusType.SwordBoost,
  1: BonusType.HelmetBoost,
  3: BonusType.ArmorBoost,
  2: BonusType.SlashBoost,
}

function mapStateToProps(state, ownProps) {
  var existing = [...state.getIn(['gamestate', 'equipment']).keys()];
  var equipment = Object.keys(EquipmentInfo)
                .filter(function(eid) {
                  return !existing.includes(eid);
                })
                .filter(function(eid) {
                  return EquipmentInfo[eid].bonusType != 62; // BonusType.None
                })
                .filter(function(eid) {
                  return EquipmentInfo[eid].category == ownProps.category;
                })
                .sort(function(a, b) { return getEquipmentName(a).localeCompare(getEquipmentName(b)); })
  var selected = state.getIn(['equipmentSelected', ownProps.category], equipment[0]);

  // TODO: lkajslfjlkajlksjdlkjfadf
  var boost = 1;
  if (ownProps.category != 0) {
    var aid = categoryToArtifactBooster[ownProps.category];
    var aLevel = state.getIn(['gamestate', 'artifacts', aid], 0);
    boost = 1 + aLevel * ArtifactInfo[aid].effects[categoryToBonusType[ownProps.category]];
  }

  return {
    toAddBonus: state.getIn(['options', 'toAddBonus', ownProps.category]),
    category: ownProps.category,
    equipment,
    selected,
    // TODO: alijsfojaoijsoeifj
    boost,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEquipmentSelected: (category, e) => {
      var eid = e.target.value;
      if (EquipmentInfo[eid]) {
        dispatch(equipmentSelected(category, eid));
      }
    },
    onEquipmentAdded: (eid, bonust, fMultiplier, boost) => {
      console.log("bonust: ", bonust);
      var bonus = parseFloat(bonust);
      console.log(bonus);
      if (!isNaN(bonus)) {
        var fMultiplier = 1;
        var eBonusType = EquipmentInfo[eid].bonusType;
        if (eBonusType == BonusType.ChestChance || eBonusType == BonusType.CritChance) {
          fMultiplier = 100;
        }
        var baseBonus = bonus / (boost * fMultiplier);
        var level = EquipmentInfo[eid].getLevelFromBonus(baseBonus);
        dispatch(equipmentAdded(eid, level, baseBonus));
      }
    },
    onEquipmentBonus: (e, category) => {
      dispatch(equipmentAddedBonus(category, e.target.value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentAdd);