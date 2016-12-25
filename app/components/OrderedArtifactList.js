import React from 'react';
import { connect } from 'react-redux';
import ArtifactList from './ArtifactList';

const OrderedArtifactList = ({ artifactLoaded }) => {
  console.log(artifactLoaded);
  return (
    <div>
      { artifactLoaded &&
        <ArtifactList />
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log("ordered map state to props");
  console.log(state.getIn(['infoDocs', 'ArtifactInfo']));
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