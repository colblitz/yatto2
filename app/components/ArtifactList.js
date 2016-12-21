import React from 'react';
import { ArtifactInfo } from '../util/Artifact';
import ArtifactInput from './ArtifactInput';

class ArtifactList extends React.Component {
  constructor() {
    super();
    this.state = {};
    // TODO: Figure out how to not be bad at React
    setTimeout(function(){
      const b = {};
      for (var artifact in ArtifactInfo) {
        b[ArtifactInfo[artifact].name] = 1;
      }
      this.setState(b);
      this.render();
    }.bind(this), 1000);
  }
  artifactChanged(aid, event) {
    this.setState({[aid]: event.target.value});
  }
  renderArtifactInput(aid) {
    return <ArtifactInput key={aid} name={aid} value={this.state[aid]} onChange={event => this.artifactChanged(aid, event)} />;
  }
  getArtifacts() {
    return Object.keys(ArtifactInfo)
                .sort(function(a, b) { return ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name); })
                .map(function(artifact) {
                  return (
                    this.renderArtifactInput(ArtifactInfo[artifact].name)
                  );
                }.bind(this));
  }
  render() {
    const artifacts = this.getArtifacts();
    return (
      <div className='artifactList'>
        { artifacts }
      </div>
    );
  }
}

export default ArtifactList;