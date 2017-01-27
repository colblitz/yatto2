import React from 'react';
import { connect } from 'react-redux';
import { toggleUpdate } from '../actions/actions';

class Update extends React.Component {
  render() {
    return (
      <div className="update">
        { this.props.update &&
          <div className="update-stuff">
            <h3>Update (1/26/2017)</h3>
            <h3>Welcome to YATTWO's initial launch. This is still a work in progress, so expect a lot of rough edges. Please read through the FAQ if you don't know what's going on.</h3>
            <h3>Current/known issues (besides the things in the todo):</h3>
            <ul>
              <li>Advanced options currently don't do anything</li>
              <li>Can't navigate directly to FAQ/Reference/Formula urls</li>
              <li>Steps option currently doesn't do anything</li>
              <li>Can only have one of each type of equipment (but really, why would you have two -__-)</li>
              <li>Logs out when you reload</li>
              <li>Site locks up when optimizing instead of some sort of spinner</li>
              <li><b>A few people have reported YATTWO suggesting a lot of Stone of the Valrunes levels - if you're experiencing this too, make sure you have everything filled out (artifact, hero levels at MS, skills, equipment, pets) - better yet, load your information from your save file. For Android, this save file would be somewhere like /sdcard/Android/data/com.gavehivecorp.taptitans2/files/ISavableGlobal.adat, whereas for iOS I assume it's something like Apps->Tap Titans 2->Documents->ISavableGlobal.adat (going off of what it was for TT1)</b></li>
              <li>For now, make sure you input your artifact levels before your equipment information, otherwise the equipment bonuses will get modified by the equipment boosting artifacts</li>
            </ul>
          </div>
        }
        <div className="update-toggle" onClick={(e) => this.props.onToggleUpdate(!this.props.update)}>
          { this.props.update ? (
            <i className="update-icon fa fa-angle-double-up"></i>
          ) : (
            <i className="update-icon fa fa-angle-double-down"></i>
          )}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    update: state.getIn(['options', 'update'], false),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleUpdate: (show) => {
      dispatch(toggleUpdate(show));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);