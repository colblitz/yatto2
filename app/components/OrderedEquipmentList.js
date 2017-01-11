import React from 'react';
import { connect } from 'react-redux';
import EquipmentList from './EquipmentList';

const OrderedEquipmentList = ({ equipmentLoaded, localizationLoaded }) => {
  return (
    <div className="ordered-equipment-list ordered-list">
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