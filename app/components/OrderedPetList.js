import React from 'react';
import { connect } from 'react-redux';
import PetList from './PetList';

const OrderedPetList = ({ petLoaded, localizationLoaded }) => {
  return (
    <div className="ordered-pet-list ordered-list">
      { petLoaded && localizationLoaded &&
        <PetList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    petLoaded: state.getIn(['infoDocs', 'PetInfo']),
    localizationLoaded: state.getIn(['infoDocs', 'LocalizationInfo']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedPetList);