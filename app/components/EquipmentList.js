import React from 'react';
import { getEquipmentName } from '../util/Localization';
import { EquipmentInfo } from '../util/Equipment';
import EquipmentInput from './EquipmentInput';

class EquipmentList extends React.Component {
  renderEquipmentInput(eid) {
    return <EquipmentInput key={eid} eid={eid} />;
  }
  getEquipment() {
    return Object.keys(EquipmentInfo)
                .sort(function(a, b) { return getEquipmentName(a).localeCompare(getEquipmentName(b)); })
                .map(function(eid) {
                  return (
                    this.renderEquipmentInput(eid)
                  );
                }.bind(this));
  }
  render() {
    const equipment = this.getEquipment();
    console.log("EquipmentList");
    console.log(equipment.length);
    return (
      <div className='equipmentList'>
        <h3>
          Equipment
        </h3>
        { equipment }
      </div>
    );
  }
}

export default EquipmentList;