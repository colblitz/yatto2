import React, { PropTypes } from 'react'
import { ArtifactInfo } from '../util/Artifact';
import ArtifactInput from './ArtifactInput';

class ArtifactList extends React.Component {
  renderArtifactInput(aid) {
    return <ArtifactInput key={aid} aid={aid} />;
  }
  getArtifacts() {
    // if (artifactOrder) {
    //   return artifactOrder.map(function(aid) { return this.renderArtifactInput(aid); }.bind(this));
    // }
    return Object.keys(ArtifactInfo)
                .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
                .map(function(aid) {
                  return (
                    this.renderArtifactInput(aid)
                  );
                }.bind(this));
  }
  render() {
    console.log("render ArtifactList");
    // const artifacts = this.getArtifacts(artifactOrder);
    const artifacts = this.getArtifacts();
    console.log(artifacts.length);
    return (
      <div className='artifactList'>
        { artifacts }
      </div>
    );
  }
}

export default ArtifactList;