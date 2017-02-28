import React from 'react';
import { connect } from 'react-redux';
import { toggleUpdate, saveIfToken } from '../actions/actions';

const lastUpdate = "2017-02-27-1";

class Update extends React.Component {
  render() {
    return (
      <div className="update">
        { this.props.showUpdate &&
          <div className="update-stuff">
            <h3>Update (2/27/2017)</h3>
            <ul>
              <li>Added a column to see specific hero damage - if you're getting recommended the wrong hero damage artifact, try checking your hero levels and damages and see which hero is doing the most damage.</li>
              <li>Few more QOL things - error message if your save file fails to load, urls directly to FAQ and other pages should work (though reference and formulas are still blank >.>)</li>
            </ul>
          </div>
        }
        <div className="update-toggle" onClick={(e) => this.props.onToggleUpdate(!this.props.showUpdate)}>
          { this.props.showUpdate ? (
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
  var toggle = state.getIn(['ui', 'update'], false);
  var lastDate = state.getIn(['ui', 'lastUpdate'], "");
  return {
    showUpdate: toggle || (lastUpdate > lastDate),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleUpdate: (show) => {
      dispatch(toggleUpdate(show, lastUpdate));
      dispatch(saveIfToken());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);