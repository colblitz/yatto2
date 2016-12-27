import React from 'react';
import { connect } from 'react-redux';
import ArtifactList from './ArtifactList';

const OrderedArtifactList = ({ artifactLoaded }) => {
  console.log(artifactLoaded);
  return (
    <div className="orderedArtifactList">
      { artifactLoaded &&
        <ArtifactList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    artifactLoaded: state.getIn(['infoDocs', 'ArtifactInfo'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderedArtifactList);