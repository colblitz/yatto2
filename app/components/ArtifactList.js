import React from 'react'
import { connect } from 'react-redux';
import { aorderChanged } from '../actions/actions';
import { ArtifactInfo } from '../util/Artifact';
import ArtifactInput from './ArtifactInput';

class ArtifactList extends React.Component {
  renderArtifactInput(aid) {
    return <ArtifactInput key={aid} aid={aid} />;
  }
  getArtifacts(aorder) {
    const alphabetical = (a, b) => ArtifactInfo[a].name.localeCompare(ArtifactInfo[b].name);
    const artifactID = (a, b) => parseInt(a.substring(8)) - parseInt(b.substring(8));
    return Object.keys(ArtifactInfo)
                .sort(aorder == 0 ? alphabetical : artifactID)
                .map(function(aid) {
                  return (
                    this.renderArtifactInput(aid)
                  );
                }.bind(this));
  }
  render() {
    const artifacts = this.getArtifacts(this.props.aorder);
    return (
      <div className='artifact-list'>
        Sort by:
        <input type="radio" value={0} name="aorder" checked={this.props.aorder == 0} onChange={this.props.aorderChange}/>Alphabetical
        <input type="radio" value={1} name="aorder" checked={this.props.aorder == 1} onChange={this.props.aorderChange}/>Artifact ID
        { artifacts }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    aorder: state.getIn(['options', 'aorder'], 0),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    aorderChange: (e) => {
      dispatch(aorderChanged(parseInt(e.target.value)));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactList);