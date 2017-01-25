import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import { equipmentRemoved, equipmentLevelChanged, equipmentBonusChanged, equipmentActiveChanged } from '../actions/actions';
import { ArtifactInfo } from '../util/Artifact';
import { BonusType, notPercentageBonuses } from '../util/BonusType';

class EquipmentInput extends React.Component {
  render() {
    return (
      <tr className='equipment-row'>
        <td>
          <input type="checkbox"
                 className="input equipment-input"
                 checked={this.props.equipped}
                 onChange={(e) => this.props.onEquipmentActiveChange(this.props.eid, e)}/>
        </td>
        <td>
          <input type="text"
                 className="input equipment-bonus-input"
                 value={this.props.formattedBonus}
                 disabled={true}
                 onChange={(e) => this.props.onEquipmentBonusChange(this.props.eid, e, this.props.boost, this.props.fMultiplier)}/>
        </td>
        <td>
          <div className="label equipment-label">
            {getEquipmentName(this.props.eid)}
          </div>
        </td>
        <td>
          <i className="fa fa-remove" onClick={(e) => this.props.removeEquipment(this.props.eid)}></i>
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
  // TODO: need to do something better if more than one source of boost
  var baseBonus = state.getIn(['gamestate', 'equipment', ownProps.eid, 'bonus'], 0);
  var boost = 1;
  if (ownProps.category != 0) {
    var aid = categoryToArtifactBooster[ownProps.category];
    var aLevel = state.getIn(['gamestate', 'artifacts', aid], 0);
    boost = 1 + aLevel * ArtifactInfo[aid].effects[categoryToBonusType[ownProps.category]];
  }

  // TODO: uh.
  var fMultiplier = 1;
  var eBonusType = EquipmentInfo[ownProps.eid].bonusType;
  if (eBonusType == BonusType.ChestChance || eBonusType == BonusType.CritChance) {
    fMultiplier = 100;
  }
  var formattedBonus = (baseBonus * boost * fMultiplier).toPrecision(3);

  return {
    equipped: state.getIn(['gamestate', 'equipment', ownProps.eid, 'equipped'], false),
    category: ownProps.category,
    eid: ownProps.eid,
    formattedBonus,
    fMultiplier,
    boost,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEquipmentActiveChange: (id, e) => {
      dispatch(equipmentActiveChanged(id, e.target.checked))
    },
    onEquipmentBonusChange: (id, e, boost, fMultiplier) => {
      const eq = EquipmentInfo[id];
      var newBonus = parseFloat(e.target.value);
      console.log("newBonus");
      console.log(newBonus);

      if (!isNaN(newBonus)) {
        var level = eq.getLevelFromBonus(newBonus / (fMultiplier * boost));
        // var level = eq.getLevelFromBonus(newBonus);
        if (!isNaN(level)) {
          console.log("new level: ", level);
          dispatch(equipmentLevelChanged(id, level));
        }
        dispatch(equipmentBonusChanged(id, newBonus / (fMultiplier * boost)));
      } else {
        dispatch(equipmentBonusChanged(id, 0));
      }
    },
    removeEquipment: (id) => {
      dispatch(equipmentRemoved(id));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInput);