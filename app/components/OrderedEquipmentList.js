import React from 'react';
import { connect } from 'react-redux';
import EquipmentList from './EquipmentList';

const OrderedEquipmentList = ({ allLoaded }) => {
  return (
    <div className="ordered-equipment-list ordered-list">
      { allLoaded &&
        <EquipmentList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  var allLoaded = state.getIn(['infoDocs', 'EquipmentInfo']) &&
                  state.getIn(['infoDocs', 'ArtifactInfo']) &&
                  state.getIn(['infoDocs', 'LocalizationInfo']);
  return {
    allLoaded
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedEquipmentList);