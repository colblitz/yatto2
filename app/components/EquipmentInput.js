import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import { equipmentChanged, equipmentActiveChanged } from '../actions/actions';

class EquipmentInput extends React.Component {
  render() {
    return (
      <div className='equipmentInputBox'>
        <input type="checkbox"
               className="input equipmentInput"
               value={this.props.equipped}
               onChange={(e) => this.props.onEquipmentActiveChange(this.props.eid, e)}/>
        <input type="number"
               className="input equipmentBonusInput"
               value={this.props.bonus}
               onChange={(e) => this.props.onEquipmentLevelChange(this.props.eid, e)}/>
        <div className="label equipmentLabel">
          {getEquipmentName(this.props.eid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const e = EquipmentInfo[ownProps.eid];
  var level = state.getIn(['gamestate', 'equipment', ownProps.eid, 'levels'], 0);
  return {
    bonus: level == 0 ? 0 : e.getBonus(level),
    equipped: state.getIn(['gamestate', 'equipment', ownProps.eid, 'equipped'], false),
    eid: ownProps.eid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEquipmentActiveChange: (id, e) => {
      // var level = parseInt(e.target.value);
      // if (!isNaN(level)) {
      //   dispatch(equipmentActiveChanged(id, level))
      // }
    },
    onEquipmentLevelChange: (id, e) => {
      const eq = EquipmentInfo[id];
      var level = eq.getLevelFromBonus(parseFloat(e.target.value));
      if (!isNaN(level)) {
        dispatch(equipmentLevelChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInput);