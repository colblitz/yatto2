import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import { equipmentAdded, equipmentSelected } from '../actions/actions';

class EquipmentAdd extends React.Component {
  getOption(eid) {
    return <option key={eid} value={eid}>{getEquipmentName(eid)}</option>;
  }
  getEquipmentOptions(equipment) {
    return equipment.map(function(eid) { return ( this.getOption(eid) ); }.bind(this));
  }
  render() {
    return (
      <div className='equipment-add-box'>
        <i className="fa fa-plus" onClick={(e) => this.props.onEquipmentAdded(this.props.selected)}></i>
        <select className='equipment-select' value={this.props.selected} onChange={(e) => this.props.onEquipmentSelected(this.props.category, e)}>
          {this.getEquipmentOptions(this.props.equipment)}
        </select>
      </div>
    );
  }
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

  return {
    category: ownProps.category,
    equipment,
    selected,
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
    onEquipmentAdded: (eid) => {
      dispatch(equipmentAdded(eid));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentAdd);