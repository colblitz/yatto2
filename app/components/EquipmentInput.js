import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import { equipmentLevelChanged, equipmentBonusChanged, equipmentActiveChanged } from '../actions/actions';

class EquipmentInput extends React.Component {
  render() {
    const e = EquipmentInfo[this.props.eid];
    return (
      <div className='equipment-input-box'>
        <input type="checkbox"
               className="input equipment-input"
               checked={this.props.equipped}
               onChange={(e) => this.props.onEquipmentActiveChange(this.props.eid, e)}/>
        <input type="text"
               className="input equipment-bonus-input"
               value={this.props.bonus}
               onChange={(e) => this.props.onEquipmentBonusChange(this.props.eid, e)}/>
        <div className="label equipment-label">
          {getEquipmentName(this.props.eid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    bonus: state.getIn(['gamestate', 'equipment', ownProps.eid, 'bonus'], 0),
    equipped: state.getIn(['gamestate', 'equipment', ownProps.eid, 'equipped'], false),
    eid: ownProps.eid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEquipmentActiveChange: (id, e) => {
      dispatch(equipmentActiveChanged(id, e.target.checked))
    },
    onEquipmentBonusChange: (id, e) => {
      const eq = EquipmentInfo[id];
      var newBonus = parseFloat(e.target.value);
      if (!isNaN(newBonus)) {
        var level = eq.getLevelFromBonus(newBonus);
        if (!isNaN(level)) {
          console.log("new level: ", level);
          dispatch(equipmentLevelChanged(id, level));
        }
      }
      dispatch(equipmentBonusChanged(id, e.target.value));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInput);