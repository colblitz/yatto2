import React from 'react';
import { connect } from 'react-redux';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import EquipmentInput from './EquipmentInput';
import EquipmentAdd from './EquipmentAdd';

class EquipmentTable extends React.Component {
  renderEquipmentInput(eid, category) {
    return <EquipmentInput key={eid} eid={eid} category={category}/>;
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
                    this.renderEquipmentInput(eid, category)
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
      <div className="equipment-table">
        <table>
          <tr>
            <th className="equipment-h equipment-h0">Equipped</th>
            <th className="equipment-h equipment-h1">Bonus</th>
            <th className="equipment-h equipment-h2"></th>
            <th className="equipment-h equipment-h3"></th>
          </tr>
          { this.getEquipment(this.props.category, this.props.equipment) }
          { this.hasAddOptions(this.props.category, this.props.equipment) &&
            <EquipmentAdd category={this.props.category}/>
          }
        </table>
      </div>
    );
  }
}

class EquipmentList extends React.Component {
  render() {
    return (
      <div className='equipment-list'>
        <h3>
          Equipment (multiplier)
        </h3>
        <h4>Weapons</h4>
        <EquipmentTable category={4} equipment={this.props.equipment}/>
        <h4>Helmets</h4>
        <EquipmentTable category={1} equipment={this.props.equipment}/>
        <h4>Suits</h4>
        <EquipmentTable category={3} equipment={this.props.equipment}/>
        <h4>Auras</h4>
        <EquipmentTable category={0} equipment={this.props.equipment}/>
        <h4>Slashes</h4>
        <EquipmentTable category={2} equipment={this.props.equipment}/>
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