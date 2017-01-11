import React from 'react';
import { connect } from 'react-redux';
import ArtifactList from './ArtifactList';

const OrderedArtifactList = ({ artifactLoaded, localizationLoaded }) => {
  return (
    <div className="ordered-artifact-list ordered-list">
      { artifactLoaded && localizationLoaded &&
        <ArtifactList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    artifactLoaded: state.getIn(['infoDocs', 'ArtifactInfo']),
    localizationLoaded: state.getIn(['infoDocs', 'LocalizationInfo']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedArtifactList);