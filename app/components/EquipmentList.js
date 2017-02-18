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
  getBlank() {
    return (
      <tr>
        <td colSpan="4">
        No equipment!
        </td>
      </tr>
    )
  }
  render() {
    const equipment = this.getEquipment(this.props.category, this.props.equipment);
    return (
      <div className="equipment-table">
        <table>
          <tbody>
            <tr>
              <th className="equipment-h equipment-h0">Equipped</th>
              <th className="equipment-h equipment-h1">Bonus</th>
              <th className="equipment-h equipment-h2"></th>
              <th className="equipment-h equipment-h3"></th>
            </tr>
            { equipment.length > 0 ? equipment : this.getBlank() }
            { this.hasAddOptions(this.props.category, this.props.equipment) &&
              <EquipmentAdd category={this.props.category}/>
            }
          </tbody>
        </table>
      </div>
    );
  }
}

class EquipmentList extends React.Component {
  render() {
    return (
      <div className='equipment-list'>
        <p><b>Make sure that your artifact info has been filled out before you do these, otherwise the values might get messed up</b></p>
        <p>Add a new equip with the selectors - you won't be able to edit the equip bonus aftewards (yet), but you can always just remove it and re-add it. The bonus should be the number that you see in-game, and it'll try to figure out the level from the multiplier.</p>
        <h3>Weapons</h3>
        <EquipmentTable category={4} equipment={this.props.equipment}/>
        <h3>Helmets</h3>
        <EquipmentTable category={1} equipment={this.props.equipment}/>
        <h3>Suits</h3>
        <EquipmentTable category={3} equipment={this.props.equipment}/>
        <h3>Auras</h3>
        <EquipmentTable category={0} equipment={this.props.equipment}/>
        <h3>Slashes</h3>
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