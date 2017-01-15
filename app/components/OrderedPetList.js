import React from 'react';
import { connect } from 'react-redux';
import PetList from './PetList';

const OrderedPetList = ({ allLoaded }) => {
  return (
    <div className="ordered-pet-list ordered-list">
      { allLoaded &&
        <PetList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  var allLoaded = state.getIn(['infoDocs', 'PetInfo']) &&
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
)(OrderedPetList);