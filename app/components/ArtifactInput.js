import React from 'react';
import { connect } from 'react-redux';
import { getArtifactName } from '../util/Localization';
import { ArtifactInfo } from '../util/Artifact';
import { artifactLevelChanged } from '../actions/actions';

class ArtifactInput extends React.Component {
  render() {
    const a = ArtifactInfo[this.props.aid];
    return (
      <div className='artifact-input-box'>
        <input type="number"
               className={"input artifact-input " + (this.props.level == a.maxLevel ? "at-cap" : "")}
               value={this.props.level}
               min="0"
               max={a.maxLevel}
               onChange={(e) => this.props.onArtifactLevelChange(this.props.aid, e)}/>
        <div className="label artifact-label">
          {getArtifactName(this.props.aid)}
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
    onArtifactLevelChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(artifactLevelChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactInput);