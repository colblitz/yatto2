import React from 'react';
import { connect } from 'react-redux';
import { ArtifactInfo } from '../util/Artifact';

class ArtifactInput extends React.Component {
  render() {
    const a = ArtifactInfo[this.props.aid];
    return (
      <div className='artifactInput'>
        <input type="number" className="input artifactInput" value={this.props.level} max={a.maxLevel}/>
        <div className="label artifactLabel">
          {a.name}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    level: state.getIn(['gamestate', 'artifacts', 'levels', ownProps.aid], 0),
    aid: ownProps.aid
  }
}

export default connect(mapStateToProps)(ArtifactInput);