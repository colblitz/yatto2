import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import EquipmentInput from './EquipmentInput';
import EquipmentAdd from './EquipmentAdd';

class EquipmentList extends React.Component {
  renderEquipmentInput(eid) {
    return <EquipmentInput key={eid} eid={eid} />;
  }
  getEquipment(category, equipment) {
    return Object.keys(EquipmentInfo)
                .filter(function(eid) {
                  return equipment.includes(eid);
                })
                .filter(function(eid) {
                  return EquipmentInfo[eid].bonusType != 62; // BonusType.None
                })
                .filter(function(eid) {
                  return EquipmentInfo[eid].category == category;
                })
                .sort(function(a, b) { return getEquipmentName(a).localeCompare(getEquipmentName(b)); })
                .map(function(eid) {
                  return (
                    this.renderEquipmentInput(eid)
                  );
                }.bind(this));
  }
  hasAddOptions(category, equipment) {
    return Object.keys(EquipmentInfo)
                .filter(function(eid) {
                  return EquipmentInfo[eid].bonusType != 62; // BonusType.None
                })
                .filter(function(eid) {
                  return EquipmentInfo[eid].category == category;
                })
                .filter(function(eid) {
                  return !equipment.includes(eid);
                }).length > 0;
  }
  render() {
    return (
      <div className='equipment-list'>
        <h3>
          Equipment (multiplier)
        </h3>
        <h4>Weapons</h4>
        <div>
          { this.getEquipment(4, this.props.equipment) }
          { this.hasAddOptions(4, this.props.equipment) &&
            <EquipmentAdd category={4}/>
          }
        </div>
        <h4>Helmets</h4>
        <div>
          { this.getEquipment(1, this.props.equipment) }
          { this.hasAddOptions(1, this.props.equipment) &&
            <EquipmentAdd category={1}/>
          }
        </div>
        <h4>Suits</h4>
        <div>
          { this.getEquipment(3, this.props.equipment) }
          { this.hasAddOptions(3, this.props.equipment) &&
            <EquipmentAdd category={3}/>
          }
        </div>
        <h4>Auras</h4>
        <div>
          { this.getEquipment(0, this.props.equipment) }
          { this.hasAddOptions(0, this.props.equipment) &&
            <EquipmentAdd category={0}/>
          }
        </div>
        <h4>Slashes</h4>
        <div>
          { this.getEquipment(2, this.props.equipment) }
          { this.hasAddOptions(2, this.props.equipment) &&
            <EquipmentAdd category={2}/>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    equipment: [...state.getIn(['gamestate', 'equipment']).keys()]
  }
}

export default connect(mapStateToProps)(EquipmentList);