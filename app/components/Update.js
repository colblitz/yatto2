import React from 'react';
import { connect } from 'react-redux';
import { toggleUpdate } from '../actions/actions';

class Update extends React.Component {
  render() {
    return (
      <div className="update">
        { this.props.update &&
          <div className="update-stuff">
            <h3>Update (1/27/2017) #2</h3>
            <h3>Still tweaking formulas and artifacts, fewer actual bugs now (*fingers crossed*)</h3>
            <ul>
              <li><b>Equipment boosting artifacts and gold artifacts should be fixed now, let me know if things still seem strange</b></li>
              <li>Hero damage artifacts are next in line to be examined</li>
              <li>You should be able to reload and stay logged in now, but I expect someone out there will find some bug with this</li>
              <li>If you're getting weird values, make sure that you've filled in all your info (<b>artifacts before equipment</b>), and if possible, import information from your save file</li>
              <li>Save files - for Android, this save file would be somewhere like /sdcard/Android/data/com.gavehivecorp.taptitans2/files/ISavableGlobal.adat, whereas for iOS I assume it's something like Apps->Tap Titans 2->Documents->ISavableGlobal.adat (going off of what it was for TT1)</li>
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