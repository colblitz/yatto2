import React from 'react';
import { connect } from 'react-redux';
import ArtifactList from './ArtifactList';

const OrderedArtifactList = ({ allLoaded }) => {
  return (
    <div className="ordered-artifact-list ordered-list">
      { allLoaded &&
        <ArtifactList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  var allLoaded = state.getIn(['infoDocs', 'ArtifactInfo']) &&
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
)(OrderedArtifactList);