import React from 'react';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import EquipmentInput from './EquipmentInput';

class EquipmentList extends React.Component {
  renderEquipmentInput(eid) {
    return <EquipmentInput key={eid} eid={eid} />;
  }
  getEquipment(category) {
    return Object.keys(EquipmentInfo)
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
  render() {
    return (
      <div className='equipmentList'>
        <h3>
          Equipment (multiplier)
        </h3>
        <h4>Weapons</h4>
        <div>
          { this.getEquipment(4) }
        </div>
        <h4>Helmets</h4>
        <div>
          { this.getEquipment(1) }
        </div>
        <h4>Suits</h4>
        <div>
          { this.getEquipment(3) }
        </div>
        <h4>Auras</h4>
        <div>
          { this.getEquipment(0) }
        </div>
        <h4>Slashes</h4>
        <div>
          { this.getEquipment(2) }
        </div>
      </div>
    );
  }
}

export default EquipmentList;