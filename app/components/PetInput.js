import React from 'react';
import { connect } from 'react-redux';
import { getPetName } from '../util/Localization';
import { PetInfo } from '../util/Pet';
import { petLevelChanged, petActiveChanged } from '../actions/actions';

class PetInput extends React.Component {
  render() {
    const p = PetInfo[this.props.pid];
    return (
      <div className='pet-input-box'>
        <input type="checkbox"
               className="input pet-active-input"
               checked={this.props.isActive}
               onChange={(e) => this.props.onPetActiveChange(this.props.pid, e)}/>
        <input type="number"
               className="input pet-level-input"
               value={this.props.level}
               min="0"
               step="1"
               onChange={(e) => this.props.onPetLevelChange(this.props.pid, e)}/>
        <div className="label pet-label">
          {getPetName(this.props.pid)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    level: state.getIn(['gamestate', 'pets', 'levels', ownProps.pid], 0),
    isActive: state.getIn(['gamestate', 'pets', 'active']) == ownProps.pid,
    pid: ownProps.pid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPetActiveChange: (id, e) => {
      dispatch(petActiveChanged(id, e.target.checked));
    },
    onPetLevelChange: (id, e) => {
      var level = parseInt(e.target.value);
      if (!isNaN(level)) {
        dispatch(petLevelChanged(id, level))
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetInput);