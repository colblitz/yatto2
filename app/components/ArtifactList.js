import React from 'react'
import { ArtifactInfo } from '../util/Artifact';
import ArtifactInput from './ArtifactInput';

class ArtifactList extends React.Component {
  renderArtifactInput(aid) {
    return <ArtifactInput key={aid} aid={aid} />;
  }
  getArtifacts() {
    return Object.keys(ArtifactInfo)
                .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
                .map(function(aid) {
                  return (
                    this.renderArtifactInput(aid)
                  );
                }.bind(this));
  }
  render() {
    const artifacts = this.getArtifacts();
    return (
      <div className='artifactList'>
        <h3>
          Artifacts
        </h3>
        { artifacts }
      </div>
    );
  }
}

export default ArtifactList;