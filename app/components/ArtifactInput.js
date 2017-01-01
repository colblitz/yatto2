import React from 'react';
import { connect } from 'react-redux';
import { ArtifactInfo } from '../util/Artifact';
import { artifactLevelChanged } from '../actions/actions';

class ArtifactInput extends React.Component {
  render() {
    const a = ArtifactInfo[this.props.aid];
    return (
      <div className='artifactInputBox'>
        <input type="number"
               className="input artifactInput"
               value={this.props.level}
               min="0"
               max={a.maxLevel}
               onChange={(e) => this.props.onArtifactChange(this.props.aid, e)}/>
        <div className="label artifactLabel">
          {a.name}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    level: state.getIn(['gamestate', 'artifacts', ownProps.aid], 0),
    aid: ownProps.aid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onArtifactChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(artifactLevelChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactInput);