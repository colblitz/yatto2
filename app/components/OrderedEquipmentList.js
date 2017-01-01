import React from 'react';
import { connect } from 'react-redux';
import EquipmentList from './EquipmentList';

const OrderedEquipmentList = ({ equipmentLoaded, localizationLoaded }) => {
  console.log("in ordered: " + (equipmentLoaded && localizationLoaded));
  return (
    <div className="orderedEquipmentList">
      { equipmentLoaded && localizationLoaded &&
        <EquipmentList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    equipmentLoaded: state.getIn(['infoDocs', 'EquipmentInfo']),
    localizationLoaded: state.getIn(['infoDocs', 'LocalizationInfo']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedEquipmentList);