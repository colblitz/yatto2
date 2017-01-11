import React from 'react';
import { connect } from 'react-redux';
import { getSkillName } from '../util/Localization';
import { SkillInfo } from '../util/Skill';
import { skillLevelChanged } from '../actions/actions';

class SkillInput extends React.Component {
  render() {
    const s = SkillInfo[this.props.sid];
    return (
      <div className='skill-input-box'>
        <input type="number"
               className="input skill-level-input"
               value={this.props.level}
               min="0"
               onChange={(e) => this.props.onSkillLevelChange(this.props.sid, e)}/>
        <div className="label skill-label">
          {getSkillName(this.props.sid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    level: state.getIn(['gamestate', 'skills', ownProps.sid], 0),
    sid: ownProps.sid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSkillLevelChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(skillLevelChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkillInput);