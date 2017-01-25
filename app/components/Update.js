import React from 'react';
import { connect } from 'react-redux';
import { toggleUpdate } from '../actions/actions';

class Update extends React.Component {
  render() {
    return (
      <div className="update">
        { this.props.update &&
          <div className="update-stuff">
            <h3>Welcome to YATTWO. This is still a work in progress. No guarantees of anything being right, use at your own risk, etc. etc.</h3>
            <h3>Current/known issues:</h3>
            <ul>
              <li>Advanced options currently don't do anything</li>
              <li>Editing equipment values is kind of fucked up right now, you have to move the cursor to where you want to edit and then edit instead of "normal" typing/backspacing</li>
              <li>Can't navigate directly to FAQ/Reference/Formula urls</li>
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